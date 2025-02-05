import express, { Request, Response } from "express";

const query = `
            SELECT date, price FROM prices
            WHERE instrument_name = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC;
        `;

export const historicalPricesHandler = (req: Request, res: Response) => {
  const { symbol, from_date, to_date } = req.query;
  // Validate query parameters
  if (!symbol || !from_date || !to_date) {
    res.status(400).json({
      error: "Missing required query parameters: symbol, from_date, to_date",
    });
    return;
  }
  try {
    res.locals.db
      .all(query, [symbol, from_date, to_date])
      .then((data) => res.json(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
};
