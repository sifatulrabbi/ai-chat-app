import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { supabase } from "../supabase";
import { db } from "../db";
import { ProfileModel } from "../db/profile-model";
import { JWT_SECRET } from "../constants";
import { caching } from "../caching";
import type { User } from "@supabase/supabase-js";

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
    const token = authToken.split(" ")[1];

    console.log("Authenticating user...");
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Getting user with id:", decoded.sub);

      const userId =
        typeof decoded.sub === "function" ? decoded.sub() : decoded.sub;
      if (!userId) {
        res.status(401).json({
          message: "Invalid authentication! Please try login first.",
        });
        return;
      }

      const userCache = (await caching.helpers.getUserCache(userId)) as {
        user: User;
        profile: typeof ProfileModel;
      } | null;
      if (userCache) {
        res.locals.user = userCache.user;
        res.locals.profile = userCache.profile;
        console.log("User and profile attached from cache.");
        next();
        return;
      }
    } catch (err) {
      console.error("error verifying jwt", err);
      res.status(401).json({
        message: "Unauthorized! Please make sure you are logged in.",
      });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);
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
