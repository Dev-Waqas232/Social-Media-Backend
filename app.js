import express from "express";
import cors from "cors";
import { config } from "dotenv";

import { dbConnect } from "./utils/dbConnect.js";
import { authRouter } from "./routes/auth.js";
import setupSwagger from "./swagger/swagger.js";

config();

const app = express();
app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, dbConnect);
