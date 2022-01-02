import { debugBinance } from "../../helpers/binance_helpers";
// import Binance from "binance-api-node"; // Alt
const Binance = require("node-binance-api"); // Main

export default async function handler(req, res) {
  const binance = new Binance().options({
    APIKEY: process.env.APIKEY,
    APISECRET: process.env.APISECRET,
  });
  let position_data = await binance.futuresPositionRisk({
    symbol: "1000SHIBUSDT",
  });

  let asset;

  // for (let i in position_data) {
  //   if (position_data[i].symbol == "RAYUSDT") {
  //     asset = position_data[i];
  //   }

  // }

  // position_data = position_data.leverage;
  // console.log(position_data)
  res.status(200).json(position_data);
}

// {"symbol":"RAYUSDT","positionAmt":"0.0","entryPrice":"0.0","markPrice":"0.00000000","unRealizedProfit":"0.00000000","liquidationPrice":"0","leverage":"20","maxNotionalValue":"25000","marginType":"cross","isolatedMargin":"0.00000000","isAutoAddMargin":"false","positionSide":"BOTH","notional":"0","isolatedWallet":"0","updateTime":0},
