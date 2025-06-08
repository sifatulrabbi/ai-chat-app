import { Router } from "express";

export const chatRouter = Router();

chatRouter.get("/", async (req, res) => {
  res.status(200).json({ chats: [] });
});

chatRouter.post("/new", async (req, res) => {
  res.status(200).json({ message: "Message sent" });
});

chatRouter
  .route("/single/:id")
  .get(async (req, res) => {
    res.status(200).json({ messages: null });
  })
  .post(async (req, res) => {
    res.status(200).json({ message: "Message sent" });
  })
  .patch(async (req, res) => {
    res.status(200).json({ message: "Chat updated" });
  })
  .delete(async (req, res) => {
    res.status(200).json({ message: "Chat deleted" });
  });
