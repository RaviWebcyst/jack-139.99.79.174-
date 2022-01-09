// import {
//   getMasterUSDBalance,
//   getTickerPrices,
//   getSlaveUSDBalance,
//   getMasterUSDBalance,
//   sendTelegramError,
//   sendTelegramMaster,
//   makeSlaveTrade,
//   balances,
// } from "./binance_helpers";

// addEventListener("message", async (e) => {
//   let slave = e.data.slave;
//   let order = e.data.order;
//   // if (i == "_id") continue;

//   // if (i !== "Iengka") continue; // ANCHOR - DEBUG SELECT IENGKA

//   // let bal = await getSlaveUSDBalance(slave.key, slave.secret, ticker);
//   // let asset_balance = await getSlaveAssetBalances(
//   //   slave.key,
//   //   slave.secret
//   // );

//   const MULTIPLIER = slave.multiplier; // TODO - PULL multiplier from database

//   // Calculate order quantity
//   // Asset == symbol - USDT
//   let asset = order.symbol.slice(0, -4);

//   let ticker = await getTickerPrices();
//   let slave_balance = await getSlaveUSDBalance(slave.key, slave.secret, ticker);
//   let master_balance = await getMasterUSDBalance(ticker);

//   let rate = slave_balance / master_balance;

//   let qty = rate * order.originalQuantity;
//   let data = {
//     side: order.side,
//     symbol: order.symbol,
//     quantity: qty * MULTIPLIER, // Asset balance of slave multiplied by order percentage of master
//     name: i,
//   };

//   // Dynamically Assign Precision
//   let precision = await fetch("https://api.binance.com/api/v3/exchangeInfo");
//   //

//   precision = await precision.json();

//   // console.log(precision.symbols);
//   var results = precision.symbols.filter(function (entry) {
//     return entry.symbol === order.symbol;
//   });

//   // if ((results = [])) {
//   //   for (let i in precision.symbols) {
//   //     let symbol = precision.symbols[i];

//   //     if (symbol.symbol == order.symbol) {
//   //       results = symbol;
//   //     }
//   //   }
//   // }

//   let stepSize;

//   try {
//     stepSize = results.filters[2].stepSize;

//     Number.prototype.countDecimals = function () {
//       if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
//       return this.toString().split(".")[1].length || 0;
//     };

//     stepSize = parseFloat(stepSize);

//     data.quantity = data.quantity.toFixed(stepSize.countDecimals()); // TODO - Test
//   } catch (error) {
//     data.quantity = Math.round(data.quantity);
//     // sendTelegramError(`${data.symbol} precision data not found`);
//   }

//   // if

//   // Execute Order

//   // Check to make sure balance is valid

//   console.log(`Master qty ${data.side} for ${data.name}: ${data.quantity}`);
//   console.log(`Master asset: ${asset}`);
//   let slave_assets = await getSlaveAssetBalances(slave.key, slave.secret);
//   for (let y in slave_assets) {
//     let asset_local = slave_assets[y];
//     // console.log(`DEBUG: ${asset_local.asset}`);
//     if (asset_local.asset == asset) {
//       console.log(
//         `Available quanity for ${data.name}: ${asset_local.availableBalance}`
//       );
//       if (asset_local.availableBalance < data.quantity) {
//         data.quantity = Math.round(asset_local.availableBalance);
//       }
//     }
//   }

//   // Check again
//   if (data.side == "BUY") {
//     if (balances[i].hasOwnProperty(data.symbol)) {
//       balances[i][data.symbol] += data.quantity;
//     } else {
//       balances[i][data.symbol] = data.quantity;
//     }
//   } else if (data.side == "SELL") {
//     if (balances[i].hasOwnProperty(data.symbol)) {
//       // balances[i][data.symbol] += data.quantity;

//       if (data.quantity !== balances[i][data.symbol]) {
//         let dif = balances[i][data.symbol] - data.quantity;

//         console.log(`The difference between order amount and dict is ${dif}`);
//       }
//       data.quantity = balances[i][data.symbol];
//       balances[i][data.symbol] -= data.quantity;

//       // if ()
//     } else {
//       // if (dif < 0) {
//       //   data.quantity = data.quantity + dif;
//       //   // data.quantity
//       //   console.log("Dif changed");
//       // }
//     }
//   }
//   console.log(balances);

//   try {
//     await makeSlaveTrade(slave.key, slave.secret, data); // TODO - Add notifications to telegram and dom via this action
//     // if ()
//   } catch (error) {
//     console.log("TRADE FAILED");
//     console.log(error);
//     sendTelegramError(error);
//   }

//   // TODO - Optimize optimize optimize
// });
