import { Router } from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { db } from "../db";
import { ProfileModel } from "../db/profile-model";
import { attachUserFailIfNotFoundMiddleware } from "../middlewares/attach-user-fail-if-not-found";
import { caching } from "../caching";
import { JWT_SECRET } from "../constants";

export const authRouter = Router();

authRouter.post("/profile", async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const token = authToken.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId =
      typeof decoded.sub === "function" ? decoded.sub() : decoded.sub;
    if (!userId) {
      res.status(401).json({
        message: "Invalid authentication! Please try login first.",
      });
      return;
    }
    const cachedProfile = (await caching.helpers.getUserCache(userId)) as {
      user: User;
      profile: typeof ProfileModel;
    };
    if (cachedProfile && cachedProfile.profile) {
      res.status(200).json({
        message: "Profile found!",
        profile: cachedProfile.profile,
      });
      return;
    }
  } catch (err) {
    console.error("Invalid JWT token from the user!", err);
    res.status(401).json({
      message: "Invalid authentication! Please try login first.",
    });
    return;
  }

  console.log("[supabase] Validating user...");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({
      message: "Unauthorized! Please make sure you are logged in.",
    });
    return;
  }
  const user = data.user;

  const existingProfile = await db
    .select()
    .from(ProfileModel)
    .where(eq(ProfileModel.id, user.id));

  if (existingProfile.length > 0) {
    await caching.helpers.setUserCache(
      data.user,
      existingProfile[0] as any as typeof ProfileModel,
    );
    res.status(201).json({
      message: "Profile already exists.",
      profile: existingProfile[0],
    });
    return;
  }

  const [newProfile] = await db
    .insert(ProfileModel)
    .values({
      id: user.id,
      displayName: user.email!.split("@")[0],
      accountType: "regular",
    })
    .returning();
  await caching.helpers.setUserCache(
    data.user,
    newProfile as any as typeof ProfileModel,
  );

  res.status(201).json({
    message: "Profile created successfully",
    profile: newProfile,
  });
});

authRouter
  .route("/profile/:id")
  .all(attachUserFailIfNotFoundMiddleware)
  .get(async (req, res) => {
    const profile = res.locals.profile;
    res.status(200).json({
      message: "Profile fetched successfully",
      profile,
    });
  })
  // TODO:
  .patch(async (req, res) => {
    const profile = res.locals.profile;
    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  })
  // TODO:
  .delete(async (req, res) => {
    const profile = res.locals.profile;
    res.status(200).json({
      message: "Profile deleted successfully",
      profile,
    });
  });
