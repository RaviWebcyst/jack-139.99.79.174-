// import { debugBinance } from "../../helpers/binance_helpers";
// import {
//   sendTelegramMaster,
//   sendTelegramError,
// } from "../../helpers/telegram_helper";
import {
  getMasterAsset,
  getSlaveAssetBalances,
  getSlaves,
  getSlaveUSDBalance,
  getTickerPrices,
} from "../../helpers/binance_helpers";
import { sendTelegramASAP } from "../../helpers/telegram_helper";
import { debugWorker } from "../../helpers/worker_helper";
// // import Binance from "binance-api-node"; // Alt
// getSlaveAssetBalances
const Binance = require("node-binance-api"); // Main

export default async function handler(req, res) {
  let slaves = await getSlaves();
  let ticker = await getTickerPrices();
  let response = {};

  // for (let i in slaves) {
  //   let slave = slaves[i];
  //   let b = new Binance().options({
  //     APIKEY: slave.key,
  //     APISECRET: slave.secret,
  //   });

  //   response[i] = {};

  //   // response[i].all = await b.futuresAllOrders();
  //   // response[i].open = await b.futuresOpenOrders();
  //   // response[i].risk = await b.futuresPositionRisk();
  //   // response[i].account = await b.futuresAccount();
  //   response[i].balance = await getSlaveUSDBalance(
  //     slave.key,
  //     slave.secret,
  //     ticker
  //   );
  // }

  response.balance = await getMasterAsset("USDT");

  // sendTelegramASAP("Test ASAP");
  res.status(200).json(response.balance);
}

// {"symbol":"RAYUSDT","positionAmt":"0.0","entryPrice":"0.0","markPrice":"0.00000000","unRealizedProfit":"0.00000000","liquidationPrice":"0","leverage":"20","maxNotionalValue":"25000","marginType":"cross","isolatedMargin":"0.00000000","isAutoAddMargin":"false","positionSide":"BOTH","notional":"0","isolatedWallet":"0","updateTime":0},
