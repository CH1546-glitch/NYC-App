import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Buildings table
export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull().default("New York"),
  zipCode: text("zip_code").notNull(),
  neighborhood: text("neighborhood"),
  buildingType: text("building_type"),
  landlordName: text("landlord_name"),
  status: text("status").notNull().default("pending"), // pending, approved, denied
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by"),
});

export const buildingsRelations = relations(buildings, ({ many }) => ({
  reviews: many(reviews),
}));

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => buildings.id),
  userId: varchar("user_id").notNull(),
  overallRating: integer("overall_rating").notNull(),
  floorNumber: integer("floor_number").notNull(),
  noiseRating: integer("noise_rating"),
  cleanlinessRating: integer("cleanliness_rating"),
  maintenanceRating: integer("maintenance_rating"),
  safetyRating: integer("safety_rating"),
  pestRating: integer("pest_rating"),
  reviewText: text("review_text").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(true),
  status: text("status").notNull().default("pending"), // pending, approved, denied
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  building: one(buildings, {
    fields: [reviews.buildingId],
    references: [buildings.id],
  }),
  photos: many(reviewPhotos),
}));

// Review photos table
export const reviewPhotos = pgTable("review_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull().references(() => reviews.id),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewPhotosRelations = relations(reviewPhotos, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewPhotos.reviewId],
    references: [reviews.id],
  }),
}));

// Insert schemas
export const insertBuildingSchema = createInsertSchema(buildings).omit({
  id: true,
  createdAt: true,
}).extend({
  zipCode: z.string().regex(/^\d{5}$/, "Must be a valid 5-digit ZIP code"),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  overallRating: z.number().min(1).max(5),
  floorNumber: z.number().min(1).max(100),
  noiseRating: z.number().min(1).max(5).optional(),
  cleanlinessRating: z.number().min(1).max(5).optional(),
  maintenanceRating: z.number().min(1).max(5).optional(),
  safetyRating: z.number().min(1).max(5).optional(),
  pestRating: z.number().min(1).max(5).optional(),
  reviewText: z.string().min(50, "Review must be at least 50 characters"),
});

export const insertReviewPhotoSchema = createInsertSchema(reviewPhotos).omit({
  id: true,
  createdAt: true,
});

// Types
export type Building = typeof buildings.$inferSelect;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ReviewPhoto = typeof reviewPhotos.$inferSelect;
export type InsertReviewPhoto = z.infer<typeof insertReviewPhotoSchema>;

// Building with aggregated ratings
export interface BuildingWithRatings extends Building {
  overallRating: number;
  reviewCount: number;
  noiseRating: number;
  cleanlinessRating: number;
  maintenanceRating: number;
  safetyRating: number;
  pestRating: number;
}

// Review with user info and photos
export interface ReviewWithDetails extends Review {
  photos: ReviewPhoto[];
  userName?: string;
  userProfileImage?: string;
}

// NYC Neighborhoods
export const NYC_NEIGHBORHOODS = [
  "Manhattan - Upper East Side",
  "Manhattan - Upper West Side",
  "Manhattan - Midtown",
  "Manhattan - Chelsea",
  "Manhattan - Greenwich Village",
  "Manhattan - SoHo",
  "Manhattan - Tribeca",
  "Manhattan - Financial District",
  "Manhattan - Harlem",
  "Manhattan - East Village",
  "Manhattan - Lower East Side",
  "Brooklyn - Williamsburg",
  "Brooklyn - DUMBO",
  "Brooklyn - Brooklyn Heights",
  "Brooklyn - Park Slope",
  "Brooklyn - Bushwick",
  "Brooklyn - Bedford-Stuyvesant",
  "Brooklyn - Crown Heights",
  "Brooklyn - Greenpoint",
  "Queens - Astoria",
  "Queens - Long Island City",
  "Queens - Flushing",
  "Queens - Jackson Heights",
  "Bronx - Riverdale",
  "Bronx - Fordham",
  "Staten Island - St. George",
] as const;

// Building types
export const BUILDING_TYPES = [
  "High-rise",
  "Mid-rise",
  "Walk-up",
  "Brownstone",
  "Townhouse",
  "Loft",
  "Co-op",
  "Condo",
] as const;
