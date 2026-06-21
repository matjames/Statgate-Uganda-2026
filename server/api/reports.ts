import { Router } from "express";

export const reportsRouter = Router();

reportsRouter.get("/", (req, res) => {
  res.json([
    { id: "REP-01", title: "National Census Overview", category: "Demographics", date: "2026-05-20", author: "Dr. Sarah Namukasa", status: "Verified" },
    { id: "REP-02", title: "Kampala District Health Audit", category: "Health Infrastructure", date: "2026-05-18", author: "James Okello", status: "Verified" }
  ]);
});
