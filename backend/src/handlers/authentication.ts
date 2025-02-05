import express, { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

export const registrationHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const result = await res.locals.db.run(
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
};

export const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
  }

  const user = await res.locals.db.get(
    "SELECT * FROM users WHERE user_name = ?",
    [username]
  );

  if (!user) {
    res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.user_name },
    process.env.SECRET_KEY as string,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
};
