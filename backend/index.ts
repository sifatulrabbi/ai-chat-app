import express from "express";
import cors from "cors";
import { apiRoutes } from "./routes";
import { ChatWorkerPool } from "./chatWorker";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// TODO: server frontend

app.use("/api", apiRoutes);

app
  .listen(port, () => {
    console.log(`Listening on port ${port}...`);
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
  console.log("SIGINT signal received. Shutting down...");
  await ChatWorkerPool.waitTillDone();
  process.exit(0);
});
