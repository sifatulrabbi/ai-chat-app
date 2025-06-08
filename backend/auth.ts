import type { Request, Response, NextFunction } from "express";
import { supabase } from "./supabase";

export const ensureAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    console.error("ERROR: No auth token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { data, error } = await supabase.auth.getUser(authToken);
  if (error) {
    console.error("ERROR:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.locals.user = data.user;
  next();
};
