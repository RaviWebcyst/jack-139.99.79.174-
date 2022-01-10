// const Binance = require("node-binance-api"); // Main
// const Binance = require("binance-api-node");

// import Binance from "binance-api-node";

// console.log(
//   await alt_binance.futuresLeverageBracket({
//     symbol: "ETHBTC", // Optional
//   })
// );
(async () => {
  // Dynamically Assign Precision
  let precision = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  //

  precision = await precision.json();

  // console.log(precision.symbols);
  var results = precision.symbols.filter(function (entry) {
    return entry.symbol === order.symbol;
  });

  console.log(results);
})();
