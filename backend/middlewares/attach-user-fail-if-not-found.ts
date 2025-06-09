import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { supabase } from "../supabase";
import { db } from "../db";
import { ProfileModel } from "../db/profile-model";

export const attachUserFailIfNotFoundMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      console.error("No auth token provided.");
      res.status(401).json({
        message: "Unauthorized! Please make sure you are logged in.",
      });
      return;
    }
    const { data, error } = await supabase.auth.getUser(authToken);
    if (error || !data.user) {
      console.error("Error fetching the user from supabase:", error);
      res.status(401).json({
        message: "Unauthorized! Please make sure you are logged in.",
      });
      return;
    }
    const user = data.user;
    const [profile] = await db
      .select()
      .from(ProfileModel)
      .where(eq(ProfileModel.id, user.id));
    if (!profile) {
      res.status(401).json({
        message: "Unauthorized! Please make sure you are logged in.",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("Error attaching user to request:", err);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};
