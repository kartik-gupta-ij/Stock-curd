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

  if (!symbol || !price || !quantity) {
    res.status(400).json({
      status: "failure",
      message: "symbol, price and quantity must be provided",
    });
    return;
  }

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
    console.log(e);
    res
      .status(400)
      .json({ status: "failure", message: "Internal server error" });
  }
};

export const protfolioHandler = async (req: Request, res: Response) => {
  const userid = res.locals.userid;

  try {
    const result = await res.locals.db.all(
      "SELECT * FROM orders where user_id = ?",
      [userid]
    );
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ status: "failure", message: "Internal server error" });
  }
};

const holdings_response = {
  status: "success",
  data: [
    {
      tradingsymbol: "GOLDBEES",
      exchange: "BSE",
      isin: "INF204KB17I5",
      quantity: 2,
      authorised_date: "2021-06-08 00:00:00",
      average_price: 40.67,
      last_price: 42.47,
      close_price: 42.28,
      pnl: 3.5999999999999943,
      day_change: 0.18999999999999773,
      day_change_percentage: 0.44938505203405327,
    },
    {
      tradingsymbol: "IDEA",
      exchange: "NSE",
      isin: "INE669E01016",
      quantity: 5,
      authorised_date: "2021-06-08 00:00:00",
      average_price: 8.466,
      last_price: 10,
      close_price: 10.1,
      pnl: 7.6700000000000035,
      day_change: -0.09999999999999964,
      day_change_percentage: -0.9900990099009866,
    },
  ],
};

export const protfolioStaticHandler = async (req: Request, res: Response) => {
  res.status(200).json(holdings_response);
};
