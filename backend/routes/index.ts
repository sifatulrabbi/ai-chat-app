import express from "express";
import { chatRouter } from "./chat";

export const apiRoutes = express.Router();

apiRoutes.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

apiRoutes.use("/chat", chatRouter);
