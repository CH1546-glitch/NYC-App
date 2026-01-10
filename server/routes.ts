import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { insertBuildingSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Buildings API
  app.get("/api/buildings", async (req, res) => {
    try {
      const { q, neighborhood, buildingType, sortBy } = req.query;
      const buildings = await storage.getBuildings({
        q: q as string,
        neighborhood: neighborhood as string,
        buildingType: buildingType as string,
        sortBy: sortBy as string,
      });
      res.json(buildings);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      res.status(500).json({ message: "Failed to fetch buildings" });
    }
  });

  app.get("/api/buildings/:id", async (req, res) => {
    try {
      const building = await storage.getBuilding(req.params.id);
      if (!building) {
        return res.status(404).json({ message: "Building not found" });
      }
      res.json(building);
    } catch (error) {
      console.error("Error fetching building:", error);
      res.status(500).json({ message: "Failed to fetch building" });
    }
  });

  app.post("/api/buildings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validatedData = insertBuildingSchema.parse({
        ...req.body,
        createdBy: userId,
        status: "pending",
      });
      const building = await storage.createBuilding(validatedData);
      res.status(201).json(building);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error creating building:", error);
      res.status(500).json({ message: "Failed to create building" });
    }
  });

  // Reviews API
  app.get("/api/buildings/:id/reviews", async (req, res) => {
    try {
      const { sortBy } = req.query;
      const reviews = await storage.getReviewsByBuilding(req.params.id, sortBy as string);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/buildings/:id/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        buildingId: req.params.id,
        userId,
        status: "pending",
      });
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Admin API
  app.get("/api/admin/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/buildings/pending", isAuthenticated, async (req, res) => {
    try {
      const buildings = await storage.getPendingBuildings();
      res.json(buildings);
    } catch (error) {
      console.error("Error fetching pending buildings:", error);
      res.status(500).json({ message: "Failed to fetch pending buildings" });
    }
  });

  app.post("/api/admin/buildings/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const building = await storage.updateBuildingStatus(req.params.id, "approved");
      if (!building) {
        return res.status(404).json({ message: "Building not found" });
      }
      res.json(building);
    } catch (error) {
      console.error("Error approving building:", error);
      res.status(500).json({ message: "Failed to approve building" });
    }
  });

  app.post("/api/admin/buildings/:id/deny", isAuthenticated, async (req, res) => {
    try {
      const building = await storage.updateBuildingStatus(req.params.id, "denied");
      if (!building) {
        return res.status(404).json({ message: "Building not found" });
      }
      res.json(building);
    } catch (error) {
      console.error("Error denying building:", error);
      res.status(500).json({ message: "Failed to deny building" });
    }
  });

  app.get("/api/admin/reviews/pending", isAuthenticated, async (req, res) => {
    try {
      const reviews = await storage.getPendingReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      res.status(500).json({ message: "Failed to fetch pending reviews" });
    }
  });

  app.post("/api/admin/reviews/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const review = await storage.updateReviewStatus(req.params.id, "approved");
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Error approving review:", error);
      res.status(500).json({ message: "Failed to approve review" });
    }
  });

  app.post("/api/admin/reviews/:id/deny", isAuthenticated, async (req, res) => {
    try {
      const review = await storage.updateReviewStatus(req.params.id, "denied");
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Error denying review:", error);
      res.status(500).json({ message: "Failed to deny review" });
    }
  });

  return httpServer;
}
