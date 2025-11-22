import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import pool from "./config/db.js";
console.log("DB PASS =>", JSON.stringify(process.env.DB_PASS));
console.log("DB PASS RAW:", process.env.DB_PASS);
console.log("DB PASS LENGTH:", process.env.DB_PASS?.length);
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("PostgreSQL connection error:", err));
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
export default app;
