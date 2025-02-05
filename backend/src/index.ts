import express, { Request, Response } from "express";
import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import * as dbm from "./db.ts";
import { hash, compare } from "bcrypt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const SECRET_KEY = "your_secret_key";

// Create a new express application instance
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ethneen.vercel.app"],
  })
);

app.use(bodyParser.json());

// Set the network port
const port = process.env.PORT || 3000;

const db = await open({
  filename: process.env.DB || "./db/database.db", // Path to your SQLite file
  driver: sqlite3.Database,
});

await db.exec(dbm.create_user_table);

// Middleware to authenticate JWT
function authenticateToken(req: Request, res: Response, next) {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, user: any) => {
    if (err || user == undefined) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    res.locals.username = user.username;
    res.locals.userid = user.id;
    next();
  });
}

// Register user
app.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
    }
    try {
      const hashedPassword = await hash(password, 10);
      const result = await db.run(
        'INSERT OR IGNORE INTO users (user_name, password, user_type, email, broker) VALUES (?, ?, "individual", "e@gmail.com", "ZERODHA")',
        [username, hashedPassword]
      );
      if (result.changes && result.changes == 1) {
        res.status(201).json({ message: "User registered successfully" });
      } else {
        res.status(400).json({ message: "User already exists" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

// Login user
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
    }

    const user = await db.get("SELECT * FROM users WHERE user_name = ?", [
      username,
    ]);

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.user_name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  })
);

type User = {
  user_name: string;
  user_type: string;
  email: string;
  broker: string;
};

function mapToUser(input: { [key: string]: any }): User {
  const { user_name, user_type, email, broker } = input;
  return { user_name, user_type, email, broker };
}

// Login user
app.get(
  "/profile",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userid = res.locals.userid;
    const user = await db.get("SELECT * FROM users WHERE id = ?", [userid]);

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.json(mapToUser(user));
  })
);

// GET /historical-data API
app.get("/historical-data", (req: Request, res: Response) => {
  const { symbol, from_date, to_date } = req.query;
  // Validate query parameters
  if (!symbol || !from_date || !to_date) {
    res.status(400).json({
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

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
