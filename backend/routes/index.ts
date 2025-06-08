import express from "express";

export const apiRoutes = express.Router();

apiRoutes.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});
