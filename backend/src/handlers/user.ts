import express, { Request, Response } from "express";

type User = {
  user_id: number;
  user_name: string;
  user_type: string;
  email: string;
  broker: string;
};

function mapToUser(input: { [key: string]: any }): User {
  const { id, user_name, user_type, email, broker } = input;
  return { user_id: id, user_name, user_type, email, broker };
}

export const profileHandler = async (req: Request, res: Response) => {
  const userid = res.locals.userid;
  const user = await res.locals.db.get("SELECT * FROM users WHERE id = ?", [
    userid,
  ]);

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  res.json({
    status: "success",
    data: mapToUser(user),
  });
};
