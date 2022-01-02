// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getFuturesBalance } from "../../helpers/binance_helpers";

export default async function handler(req, res) {
  res.status(200).json(await getFuturesBalance());
}
