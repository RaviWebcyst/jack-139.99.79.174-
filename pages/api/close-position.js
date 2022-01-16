// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { closeSlavePosition, closeTrade } from "../../helpers/binance_helpers";

export default function handler(req, res) {
  let body = JSON.parse(req.body);
  closeSlavePosition(body.name, body.symbol);
  res.status(200).json({ name: "John Doe" });
}
