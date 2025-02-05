import express, { Request, Response } from "express";

type OrderResponse = {
  message: string;
  order_id: number;
};

function mapToOrderResponse(id: number): OrderResponse {
  return {
    message: "Order Placed Successfully",
    order_id: id,
  };
}

export const orderHandler = async (req: Request, res: Response) => {
  const userid = res.locals.userid;
  const { symbol, price, quantity } = req.body;

  try {
    const result = await res.locals.db.run(
      "INSERT INTO orders (symbol, price, quantity, user_id) VALUES (?, ?, ?, ?)",
      [symbol, price, quantity, userid]
    );

    if (result.changes && result.changes == 1) {
      res
        .status(200)
        .json({ status: "success", data: mapToOrderResponse(result.lastID) });
    } else {
      res
        .status(400)
        .json({ status: "failure", message: "No rows inserted in db" });
    }
  } catch (e) {
    res
      .status(400)
      .json({ status: "failure", message: "Internal server error" });
  }
};
