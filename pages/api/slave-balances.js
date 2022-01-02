// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getFuturesBalance } from "../../helpers/binance_helpers";

import {
  getSlaveAssetBalances,
  getSlaves,
  getTickerPrices,
  getSlaveUSDBalance,
} from "../../helpers/binance_helpers";
export default async function handler(req, res) {
  // Slave Balance Table Start
  let balance_table = [];
  let slaves = await getSlaves();
  let ticker = await getTickerPrices();
  let slave_assets = [];

  for (let i in slaves) {
    let slave = slaves[i];
    if (i == "_id") continue;

    let bal = await getSlaveUSDBalance(slave.key, slave.secret, ticker);
    balance_table.push({
      name: i,
      balance: bal,
    });

    // Slave Indvidual Balance Table Start
    let asset_balance = await getSlaveAssetBalances(slave.key, slave.secret);
    // asset_balance.name = i;
    slave_assets.push(asset_balance);
    // Slave Indvidual Balance Table Stop
  }
  // Slave Balance Table Stop
  res.status(200).json({
    slaves: balance_table,
    slave_assets: slave_assets,
  });
}
