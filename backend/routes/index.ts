import express from "express";
import { authRouter } from "./auth";
import { chatRouter } from "./chat";

export const apiRoutes = express.Router();

apiRoutes.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

apiRoutes.use("/auth", authRouter);
apiRoutes.use("/chat", chatRouter);
