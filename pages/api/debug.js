// import { debugBinance } from "../../helpers/binance_helpers";
// import {
//   sendTelegramMaster,
//   sendTelegramError,
// } from "../../helpers/telegram_helper";
import { getSlaveAssetBalances } from "../../helpers/binance_helpers";
import { debugWorker } from "../../helpers/worker_helper";
// // import Binance from "binance-api-node"; // Alt
// getSlaveAssetBalances
const Binance = require("node-binance-api"); // Main

export default async function handler(req, res) {
  // let b = new Binance().options({
  //   APIKEY: process.env.APIKEY,
  //   APISECRET: process.env.APISECRET,
  // });

  // let qty = 10;
  // let asset = "USDT";
  // let response;
  // let slave_assets = await getSlaveAssetBalances(
  //   process.env.APIKEY,
  //   process.env.APISECRET
  // );
  // for (let i in slave_assets) {
  //   let asset_local = slave_assets[i];
  //   if (asset_local.asset == asset) {
  //     response = asset_local.availableBalance;
  //     // if (asset_local.availableBalance > qty) {
  //     //   // qty = Math.round(asset_local.availableBalance);

  //     // }
  //   }
  // }

  // qty;
  // Dynamically Assign Precision
  let precision = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  //

  precision = await precision.json();

  // console.log(precision.symbols);
  var results = precision.symbols.filter(function (entry) {
    return entry.symbol === "ETHUSDT";
  });

  // let stepSize = results;

  Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
  };

  let stepSize = results[0].filters[2].stepSize;

  stepSize = parseFloat(stepSize);

  res.status(200).json(stepSize.countDecimals());
}

// {"symbol":"RAYUSDT","positionAmt":"0.0","entryPrice":"0.0","markPrice":"0.00000000","unRealizedProfit":"0.00000000","liquidationPrice":"0","leverage":"20","maxNotionalValue":"25000","marginType":"cross","isolatedMargin":"0.00000000","isAutoAddMargin":"false","positionSide":"BOTH","notional":"0","isolatedWallet":"0","updateTime":0},
