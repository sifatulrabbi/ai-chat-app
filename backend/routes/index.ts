import express from "express";
import { authRouter } from "./auth-routes";
import { chatRouter } from "./chat-routes";

export const apiRoutes = express.Router();

apiRoutes.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

apiRoutes.use("/auth", authRouter);
apiRoutes.use("/chat", chatRouter);
