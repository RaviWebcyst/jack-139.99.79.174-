import { debugBinance } from "../../helpers/binance_helpers";
// import Binance from "binance-api-node"; // Alt
const Binance = require("node-binance-api"); // Main

export default async function handler(req, res) {
  const binance = new Binance().options({
    APIKEY: process.env.APIKEY,
    APISECRET: process.env.APISECRET,
    // verbose: true,
  });

  // let bod = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  // bod = await bod.json();
  // let bod = await binance.futuresAccount();

  // console.log(binance);

  // console.log(bod);
  res.status(200).json(await binance.futuresOpenOrders());
}

// {"symbol":"RAYUSDT","positionAmt":"0.0","entryPrice":"0.0","markPrice":"0.00000000","unRealizedProfit":"0.00000000","liquidationPrice":"0","leverage":"20","maxNotionalValue":"25000","marginType":"cross","isolatedMargin":"0.00000000","isAutoAddMargin":"false","positionSide":"BOTH","notional":"0","isolatedWallet":"0","updateTime":0},
