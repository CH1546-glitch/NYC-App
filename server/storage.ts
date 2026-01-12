import {
  buildings,
  reviews,
  reviewPhotos,
  type Building,
  type InsertBuilding,
  type Review,
  type InsertReview,
  type ReviewPhoto,
  type InsertReviewPhoto,
  type BuildingWithRatings,
  type ReviewWithDetails,
} from "@shared/schema";
import { users, type User } from "@shared/models/auth";
import { db } from "./db";
import { eq, and, ilike, or, desc, asc, sql, count, avg } from "drizzle-orm";

// Lightweight type for autocomplete suggestions
export interface BuildingSuggestion {
  id: string;
  name: string;
  address: string;
}

export interface PaginatedBuildings {
  buildings: BuildingWithRatings[];
  total: number;
  hasMore: boolean;
}

export interface IStorage {
  // Buildings
  getBuildings(filters?: {
    q?: string;
    neighborhood?: string;
    buildingType?: string;
    sortBy?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedBuildings>;
  getBuilding(id: string): Promise<BuildingWithRatings | undefined>;
  getBuildingsAutocomplete(query: string): Promise<BuildingSuggestion[]>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuildingStatus(id: string, status: string): Promise<Building | undefined>;
  getPendingBuildings(): Promise<Building[]>;

  // Reviews
  getReviewsByBuilding(buildingId: string, sortBy?: string): Promise<ReviewWithDetails[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewStatus(id: string, status: string): Promise<Review | undefined>;
  getPendingReviews(): Promise<Review[]>;

  // Admin stats
  getAdminStats(): Promise<{
    totalUsers: number;
    totalBuildings: number;
    pendingBuildings: number;
    totalReviews: number;
    pendingReviews: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getBuildings(filters?: {
    q?: string;
    neighborhood?: string;
    buildingType?: string;
    sortBy?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedBuildings> {
    const conditions = [eq(buildings.status, filters?.status || "approved")];

    if (filters?.q) {
      conditions.push(
        or(
          ilike(buildings.name, `%${filters.q}%`),
          ilike(buildings.address, `%${filters.q}%`),
          ilike(buildings.neighborhood, `%${filters.q}%`)
        ) as any
      );
    }

    if (filters?.neighborhood && filters.neighborhood !== "all") {
      conditions.push(eq(buildings.neighborhood, filters.neighborhood));
    }

    if (filters?.buildingType && filters.buildingType !== "all") {
      conditions.push(eq(buildings.buildingType, filters.buildingType));
    }

    const buildingsList = await db
      .select()
      .from(buildings)
      .where(and(...conditions));

    const buildingsWithRatings: BuildingWithRatings[] = await Promise.all(
      buildingsList.map(async (building) => {
        const reviewStats = await db
          .select({
            count: count(),
            avgOverall: avg(reviews.overallRating),
            avgNoise: avg(reviews.noiseRating),
            avgCleanliness: avg(reviews.cleanlinessRating),
            avgMaintenance: avg(reviews.maintenanceRating),
            avgSafety: avg(reviews.safetyRating),
            avgPest: avg(reviews.pestRating),
          })
          .from(reviews)
          .where(and(eq(reviews.buildingId, building.id), eq(reviews.status, "approved")));

        const stats = reviewStats[0];

        return {
          ...building,
          overallRating: parseFloat(stats.avgOverall || "0"),
          reviewCount: stats.count,
          noiseRating: parseFloat(stats.avgNoise || "0"),
          cleanlinessRating: parseFloat(stats.avgCleanliness || "0"),
          maintenanceRating: parseFloat(stats.avgMaintenance || "0"),
          safetyRating: parseFloat(stats.avgSafety || "0"),
          pestRating: parseFloat(stats.avgPest || "0"),
        };
      })
    );

    // Sort based on sortBy parameter
    if (filters?.sortBy === "reviews") {
      buildingsWithRatings.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (filters?.sortBy === "newest") {
      buildingsWithRatings.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } else {
      // Default: sort by rating
      buildingsWithRatings.sort((a, b) => b.overallRating - a.overallRating);
    }

    // Apply pagination
    const total = buildingsWithRatings.length;
    const limit = filters?.limit || 12;
    const offset = filters?.offset || 0;
    const paginatedBuildings = buildingsWithRatings.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      buildings: paginatedBuildings,
      total,
      hasMore,
    };
  }

  async getBuilding(id: string): Promise<BuildingWithRatings | undefined> {
    const [building] = await db.select().from(buildings).where(eq(buildings.id, id));
    if (!building) return undefined;

    const reviewStats = await db
      .select({
        count: count(),
        avgOverall: avg(reviews.overallRating),
        avgNoise: avg(reviews.noiseRating),
        avgCleanliness: avg(reviews.cleanlinessRating),
        avgMaintenance: avg(reviews.maintenanceRating),
        avgSafety: avg(reviews.safetyRating),
        avgPest: avg(reviews.pestRating),
      })
      .from(reviews)
      .where(and(eq(reviews.buildingId, id), eq(reviews.status, "approved")));

    const stats = reviewStats[0];

    return {
      ...building,
      overallRating: parseFloat(stats.avgOverall || "0"),
      reviewCount: stats.count,
      noiseRating: parseFloat(stats.avgNoise || "0"),
      cleanlinessRating: parseFloat(stats.avgCleanliness || "0"),
      maintenanceRating: parseFloat(stats.avgMaintenance || "0"),
      safetyRating: parseFloat(stats.avgSafety || "0"),
      pestRating: parseFloat(stats.avgPest || "0"),
    };
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const [building] = await db.insert(buildings).values(insertBuilding).returning();
    return building;
  }

  async updateBuildingStatus(id: string, status: string): Promise<Building | undefined> {
    const [building] = await db
      .update(buildings)
      .set({ status })
      .where(eq(buildings.id, id))
      .returning();
    return building;
  }

  async getPendingBuildings(): Promise<Building[]> {
    return db.select().from(buildings).where(eq(buildings.status, "pending"));
  }

  async getBuildingsAutocomplete(query: string): Promise<BuildingSuggestion[]> {
    // Return empty array for queries less than 2 characters
    if (!query || query.length < 2) {
      return [];
    }

    const results = await db
      .select({
        id: buildings.id,
        name: buildings.name,
        address: buildings.address,
      })
      .from(buildings)
      .where(
        and(
          eq(buildings.status, "approved"),
          or(
            ilike(buildings.name, `%${query}%`),
            ilike(buildings.address, `%${query}%`)
          )
        )
      )
      .limit(8);

    return results;
  }

  async getReviewsByBuilding(buildingId: string, sortBy?: string): Promise<ReviewWithDetails[]> {
    let orderBy: any = desc(reviews.createdAt);
    if (sortBy === "highest") {
      orderBy = desc(reviews.overallRating);
    } else if (sortBy === "lowest") {
      orderBy = asc(reviews.overallRating);
    }

    const reviewsList = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.buildingId, buildingId), eq(reviews.status, "approved")))
      .orderBy(orderBy);

    const reviewsWithDetails: ReviewWithDetails[] = await Promise.all(
      reviewsList.map(async (review) => {
        const photos = await db
          .select()
          .from(reviewPhotos)
          .where(eq(reviewPhotos.reviewId, review.id));

        let userName: string | undefined;
        let userProfileImage: string | undefined;

        if (!review.isAnonymous) {
          const [user] = await db.select().from(users).where(eq(users.id, review.userId));
          if (user) {
            userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined;
            userProfileImage = user.profileImageUrl || undefined;
          }
        }

        return {
          ...review,
          photos,
          userName,
          userProfileImage,
        };
      })
    );

    return reviewsWithDetails;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReviewStatus(id: string, status: string): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ status })
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async getPendingReviews(): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.status, "pending"));
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    totalBuildings: number;
    pendingBuildings: number;
    totalReviews: number;
    pendingReviews: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [buildingCount] = await db
      .select({ count: count() })
      .from(buildings)
      .where(eq(buildings.status, "approved"));
    const [pendingBuildingCount] = await db
      .select({ count: count() })
      .from(buildings)
      .where(eq(buildings.status, "pending"));
    const [reviewCount] = await db
      .select({ count: count() })
      .from(reviews)
      .where(eq(reviews.status, "approved"));
    const [pendingReviewCount] = await db
      .select({ count: count() })
      .from(reviews)
      .where(eq(reviews.status, "pending"));

    return {
      totalUsers: userCount.count,
      totalBuildings: buildingCount.count,
      pendingBuildings: pendingBuildingCount.count,
      totalReviews: reviewCount.count,
      pendingReviews: pendingReviewCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
