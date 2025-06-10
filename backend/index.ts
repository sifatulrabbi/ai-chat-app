import express from "express";
import cors from "cors";
import { apiRoutes } from "./routes";
import { ChatWorkerPool } from "./chatWorker";
import { ensureRedisConnection } from "./caching";
import { PORT } from "./constants";

await ensureRedisConnection();

const app = express();

app.use(cors());
app.use(express.json());

// TODO: server frontend

app.use("/api", apiRoutes);

app
  .listen(PORT, async () => {
    console.log(`Listening on port ${PORT}...`);
  })
  .on("error", async (err) => {
    console.error(err);
    await ChatWorkerPool.waitTillDone();
    process.exit(1);
  })
  .on("close", async () => {
    console.log("Server closed. Shutting down...");
    await ChatWorkerPool.waitTillDone();
    process.exit(0);
  });

process.on("SIGINT", async () => {
  console.log("\nSIGINT signal received. Shutting down...");
  await ChatWorkerPool.waitTillDone();
  process.exit(0);
});
