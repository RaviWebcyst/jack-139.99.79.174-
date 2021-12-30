// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  getFuturesBalance,
  getOpenOrders,
} from "../../helpers/binance_helpers";

export default async function handler(req, res) {
  let reqq = await fetch(`${process.env.ROOT_PATH}api/mongo/status`);
  reqq = await reqq.json();

  let startup = reqq.status;

  if (!startup) {
    await fetch(`${process.env.ROOT_PATH}api/mongo/change-status`);
    res.status(200).json("Copier started");
    startup = true;
    // TODO - Add while loop for what happens when status is true

    let i = 0;
    // while (startup) {
    //   console.log("test");
    //   let reqq = await fetch(`${process.env.ROOT_PATH}api/mongo/status`);
    //   reqq = await reqq.json();

    //   startup = reqq.status;

    //   setTimeout(() => {
    //     i++;
    //   }, 6000 * i);
    // }
    // console.log("loop ended");
  } else {
    res.status(200).json("Copier already running");
  }

  //   closeClient();
}
