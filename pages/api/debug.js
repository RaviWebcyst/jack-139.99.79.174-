import { debugBinance } from "../../helpers/binance_helpers";
import {
  sendTelegramMaster,
  sendTelegramError,
} from "../../helpers/telegram_helper";
// import Binance from "binance-api-node"; // Alt
const Binance = require("node-binance-api"); // Main

export default async function handler(req, res) {
  let b = new Binance().options({
    APIKEY: process.env.APIKEY,
    APISECRET: process.env.APISECRET,
  });

  res.status(200).json(await b.futuresBalance());
}

// {"symbol":"RAYUSDT","positionAmt":"0.0","entryPrice":"0.0","markPrice":"0.00000000","unRealizedProfit":"0.00000000","liquidationPrice":"0","leverage":"20","maxNotionalValue":"25000","marginType":"cross","isolatedMargin":"0.00000000","isAutoAddMargin":"false","positionSide":"BOTH","notional":"0","isolatedWallet":"0","updateTime":0},
