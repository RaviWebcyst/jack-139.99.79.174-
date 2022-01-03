import { debugBinance } from "../../helpers/binance_helpers";
import {
  sendTelegramMaster,
  sendTelegramError,
} from "../../helpers/telegram_helper";
// import Binance from "binance-api-node"; // Alt
// const Binance = require("node-binance-api"); // Main

export default async function handler(req, res) {
  let precision = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  //

  precision = await precision.json();

  console.log(precision.symbols);
  var results = precision.symbols.filter(function (entry) {
    return entry.symbol === "1000SHIBUSDT";
  });

  // if ((results = [])) {
  //   for (let i in precision.symbols) {
  //     let symbol = precision.symbols[i];

  //     if (symbol.symbol == "ICXUSDT") {
  //       results = symbol;
  //     }
  //   }
  // }

  // console.log("1000SHIB");
  console.log(results);
  console.log(results[0].filters);

  // console.log(order.symbol);
  // console.log(results);
  // console.log(results[0].filters);
  // return;
  console.log(results[0].filters);
  let stepSize = results[0].filters[2].stepSize;

  Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
  };

  stepSize = parseFloat(stepSize);

  // console.log(stepSize.countDecimals());

  res.status(200).json(stepSize);
}

// {"symbol":"RAYUSDT","positionAmt":"0.0","entryPrice":"0.0","markPrice":"0.00000000","unRealizedProfit":"0.00000000","liquidationPrice":"0","leverage":"20","maxNotionalValue":"25000","marginType":"cross","isolatedMargin":"0.00000000","isAutoAddMargin":"false","positionSide":"BOTH","notional":"0","isolatedWallet":"0","updateTime":0},
