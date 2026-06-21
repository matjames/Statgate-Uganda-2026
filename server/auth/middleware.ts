import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sovereign-secret-key-2026";

export enum UserRole {
  SOVEREIGN_ADMIN = "Sovereign Admin",
  LEAD_ANALYST = "Lead Analyst",
  DISTRICT_FIELD_ENGINEER = "District Field Engineer",
  CLIENT_OBSERVER = "Client Observer",
}

export function authenticateToken(req: any, res: any, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access Denied: No Token Provided" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid or Expired Token" });
    req.user = user;
    next();
  });
}

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: any, res: any, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized: Insufficient Permissions" });
    }
    next();
  };
}
