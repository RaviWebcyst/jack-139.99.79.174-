// Next// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  getFuturesBalance,
  getOpenOrders,
  terminateBinanceSocket,
} from "../../helpers/binance_helpers";

export default async function handler(req, res) {
  let reqq = await fetch(`${process.env.ROOT_PATH}api/mongo/status`);
  reqq = await reqq.json();

  let startup = reqq.status;

  console.log(startup);

  if (startup) {
    await fetch(`${process.env.ROOT_PATH}api/mongo/change-status`);
    terminateBinanceSocket();
    res.status(200).json("Copier stopped");
  } else {
    res.status(200).json("Copier already stopped");
  }

  //   closeClient();
}
