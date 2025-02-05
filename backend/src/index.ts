import express, { Request, Response } from "express";
import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import * as dbm from "./db.ts";

// Create a new express application instance
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ethneen.vercel.app"],
  })
);

// Set the network port
const port = process.env.PORT || 3000;

const db = await open({
  filename: process.env.DB || "./db/database.db", // Path to your SQLite file
  driver: sqlite3.Database,
});

db.exec(dbm.create_user_table);

// GET /historical-data API
app.get("/historical-data", (req: Request, res: Response) => {
  const { symbol, from_date, to_date } = req.query;
  // Validate query parameters
  if (!symbol || !from_date || !to_date) {
    res
      .status(400)
      .json({
        error: "Missing required query parameters: symbol, from_date, to_date",
      });
    return;
  }
  try {
    db.all(dbm.query, [symbol, from_date, to_date]).then((data) =>
      res.json(data)
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
