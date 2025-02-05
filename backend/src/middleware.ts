import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Middleware to authenticate JWT
export function authenticateToken(req: Request, res: Response, next) {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.SECRET_KEY as string,
    (err, user: any) => {
      if (err || user == undefined) {
        res.status(403).json({ message: "Invalid token" });
        return;
      }
      res.locals.username = user.username;
      res.locals.userid = user.id;
      next();
    }
  );
}
