import { debugBinance } from "../../helpers/binance_helpers";

export default async function handler(req, res) {
  debugBinance();
  //   console.log(data);
  res.status(200).json("debug");
}
