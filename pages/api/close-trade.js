// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { closeTrade } from "../../helpers/binance_helpers";

export default function handler(req, res) {
  let body = JSON.parse(req.body);
  closeTrade(body.symbol, body.id);
  res.status(200).json({ name: "John Doe" });
}
