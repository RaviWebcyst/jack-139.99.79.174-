// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getFuturesBalance } from "../../helpers/binance_helpers";

import {
  getSlaveAssetBalances,
  getSlaves,
  getTickerPrices,
  getSlaveUSDBalance,
  getBybitSlavesBalance
} from "../../helpers/binance_helpers";
export default async function handler(req, res) {
  // Slave Balance Table Start
  let balance_table = [];
  let slaves = await getSlaves();
  // let ticker = await getTickerPrices();
  let slave_assets = [];

  for (let i in slaves) {
    let slave = slaves[i];
    if (i == "_id") continue;
    console.log("slaves");
    console.log(slave.key);

    let bal = await getBybitSlavesBalance(slave.key, slave.secret);
    console.log("balance");
    console.log(bal);
    slave_assets.push({
      name: i,
      balance: bal,
    });
    console.log("slave assets");
    console.log(slave_assets);

    // Slave Indvidual Balance Table Start
    // let asset_balance = await getSlaveAssetBalances(slave.key, slave.secret);
    // // asset_balance.name = i;
    // slave_assets.push(asset_balance);
    // Slave Indvidual Balance Table Stop
  }
  // Slave Balance Table Stop
  res.status(200).json({
    // slaves: balance_table,
    slave_assets: slave_assets,
  });
}
