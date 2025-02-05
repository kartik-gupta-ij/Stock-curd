import express, { Request, Response } from "express";
import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import { create_user_table } from "./db.ts";
import bodyParser from "body-parser";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "./middleware.ts";
import {
  loginHandler,
  registrationHandler,
} from "./handlers/authentication.ts";
import { profileHandler } from "./handlers/user.ts";
import { historicalPricesHandler } from "./handlers/prices.ts";

// Create a new express application instance
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(bodyParser.json());

// Set the network port
const port = process.env.PORT || 3000;

const db = await open({
  filename: process.env.DB || "./db/database.db", // Path to your SQLite file
  driver: sqlite3.Database,
});

await db.exec(create_user_table);

app.use((req, res, next) => {
  res.locals.db = db;
  next();
});

app.post("/register", asyncHandler(registrationHandler));
app.post("/login", asyncHandler(loginHandler));
app.get("/profile", authenticateToken, asyncHandler(profileHandler));
app.get("/historical-data", historicalPricesHandler);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
