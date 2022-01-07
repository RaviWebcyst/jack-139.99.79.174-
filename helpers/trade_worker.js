import {
  getMasterUSDBalance,
  getTickerPrices,
  getSlaveUSDBalance,
  getMasterUSDBalance,
  sendTelegramError,
  makeSlaveTrade,
} from "./binance_helpers";

addEventListener("message", (e) => {
  // postMessage(e.data); // Echo Response
  const MULTIPLIER = slave.multiplier; // TODO - PULL multiplier from database

  // Calculate order quantity
  // Asset == symbol - USDT
  let asset = order.symbol.slice(0, -4);

  let ticker = await getTickerPrices();
  let slave_balance = await getSlaveUSDBalance(slave.key, slave.secret, ticker);
  let master_balance = await getMasterUSDBalance(ticker);

  let rate = slave_balance / master_balance;

  let qty = rate * order.originalQuantity;
  let data = {
    side: order.side,
    symbol: order.symbol,
    quantity: qty * MULTIPLIER, // Asset balance of slave multiplied by order percentage of master
    name: i,
  };

  // Dynamically Assign Precision
  let precision = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  //

  precision = await precision.json();

  console.log(precision.symbols);
  var results = precision.symbols.filter(function (entry) {
    return entry.symbol === order.symbol;
  });

  // if ((results = [])) {
  //   for (let i in precision.symbols) {
  //     let symbol = precision.symbols[i];

  //     if (symbol.symbol == order.symbol) {
  //       results = symbol;
  //     }
  //   }
  // }

  let stepSize;

  try {
    stepSize = results.filters[2].stepSize;

    Number.prototype.countDecimals = function () {
      if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
      return this.toString().split(".")[1].length || 0;
    };

    stepSize = parseFloat(stepSize);

    data.quantity = data.quantity.toFixed(stepSize.countDecimals()); // TODO - Test
  } catch (error) {
    data.quantity = Math.round(data.quantity);
    // sendTelegramError(`${data.symbol} precision data not found`);
  }

  // if

  // Execute Order

  // Check to make sure balance is valid
  let slave_assets = await getSlaveAssetBalance(slave.key, slave.secret);
  for (let i in slave_assets) {
    let asset_local = slave_assets[i];
    if (asset_local.asset == asset) {
      if (asset_local.availableBalance > data.quantity) {
        data.quantity = Math.round(asset_local.availableBalance);
      }
    }
  }

  try {
    await makeSlaveTrade(slave.key, slave.secret, data); // TODO - Add notifications to telegram and dom via this action
  } catch (error) {
    console.log("TRADE FAILED");
    console.log(error);
    sendTelegramError(error);
  }
});
