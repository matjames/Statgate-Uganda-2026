import { Router } from "express";

export const datasetsRouter = Router();

datasetsRouter.get("/", (req, res) => {
  res.json([
    { id: "DS-001", name: "Census 2026", category: "Demographics", status: "Verified" },
    { id: "DS-002", name: "Health Infrastructure", category: "Health", status: "Verified" },
    { id: "DS-003", name: "Education Facilities", category: "Education", status: "Pending" }
  ]);
});

datasetsRouter.get("/:id/records", (req, res) => {
  res.json([
    { district: "Kampala", population: "1,680,600", growthRate: "+4.2%", density: "8,400/km²", status: "Verified" },
    { district: "Wakiso", population: "2,900,000", growthRate: "+5.1%", density: "1,500/km²", status: "Verified" },
    { district: "Mukono", population: "700,000", growthRate: "+3.8%", density: "800/km²", status: "Pending" }
  ]);
});
