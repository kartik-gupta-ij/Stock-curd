import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import { create_order_table, create_user_table } from "./db.ts";
import bodyParser from "body-parser";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "./middleware.ts";
import {
  loginHandler,
  registrationHandler,
} from "./handlers/authentication.ts";
import { profileHandler } from "./handlers/user.ts";
import { historicalPricesHandler } from "./handlers/prices.ts";
import { orderHandler, protfolioHandler, protfolioStaticHandler } from "./handlers/holding.ts";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://kartik-assignment.vercel.app"],
  })
);

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const db = await open({
  filename: process.env.DB || "./db/database.db", 
  driver: sqlite3.Database,
});

await db.exec(create_user_table);
await db.exec(create_order_table);

app.use((req, res, next) => {
  res.locals.db = db;
  next();
});

app.post("/register", asyncHandler(registrationHandler));
app.post("/login", asyncHandler(loginHandler));
app.get("/profile", authenticateToken, asyncHandler(profileHandler));
app.post("/order/place_order", authenticateToken, asyncHandler(orderHandler));
app.get(
  "/portfolio/user_holdings",
  authenticateToken,
  asyncHandler(protfolioHandler)
);
app.get(
  "/portfolio/holdings",
  authenticateToken,
  asyncHandler(protfolioStaticHandler)
);
app.get("/historical-data", historicalPricesHandler);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
