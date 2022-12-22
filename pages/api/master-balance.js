// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getBybitBalance } from "../../helpers/binance_helpers";

export default async function handler(req, res) {
  // res.status(200).json(await getFuturesBalance());
  res.status(200).json(await getBybitBalance());
}
