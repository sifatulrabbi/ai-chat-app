import express from "express";
import cors from "cors";
import { apiRoutes } from "./routes";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// TODO: server frontend

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
