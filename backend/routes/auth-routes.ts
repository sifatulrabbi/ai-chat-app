import { Router } from "express";
import { eq } from "drizzle-orm";
import { supabase } from "../supabase";
import { db } from "../db";
import { ProfileModel } from "../db/profile-model";
import { attachUserFailIfNotFoundMiddleware } from "../middlewares/attach-user-fail-if-not-found";

export const authRouter = Router();

authRouter.route("/profile").post(async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const token = authToken.split(" ")[1];
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
  .patch(async (req, res) => {
    const profile = res.locals.profile;
    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  })
  .delete(async (req, res) => {
    const profile = res.locals.profile;
    res.status(200).json({
      message: "Profile deleted successfully",
      profile,
    });
  });
