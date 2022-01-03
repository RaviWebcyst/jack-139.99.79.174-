// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  getFuturesBalance,
  getOpenOrders,
  getTrades,
} from "../../helpers/binance_helpers";
import { sendTelegramMaster } from "../../helpers/telegram_helper";

export default async function handler(req, res) {
  let reqq = await fetch(`${process.env.ROOT_PATH}api/mongo/status`);
  reqq = await reqq.json();

  let startup = reqq.status;

  if (!startup) {
    await fetch(`${process.env.ROOT_PATH}api/mongo/change-status`);
    sendTelegramMaster("Copier started");
    res.status(200).json("Copier started");
    startup = true;
    // TODO - Add while loop for what happens when status is true

    getTrades();
  } else {
    res.status(200).json("Copier already running");
  }

  //   closeClient();
}
