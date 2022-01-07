import WebSocket, { WebSocketServer } from "ws";
import { sendTelegramError, sendTelegramMaster } from "./telegram_helper";

// Prelim setup

const Binance = require("node-binance-api");

const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
  useServerTime: true,
});

// Master Helpers
export async function getFuturesBalance() {
  // Balance start
  return await binance.futuresBalance();
  // Balance stop
}

export async function getOpenFutureOrders() {
  let obj = {};

  // console.log(await binance.futuresOpenOrders());
  obj.master = await binance.futuresOpenOrders();
  obj.slaves = [];

  let s = await getSlaves();

  // console.log(s);
  let x = 0;
  for (let i in s) {
    // console.log(s[i]);
    const s_b = new Binance().options({
      APIKEY: s[i].key,
      APISECRET: s[i].secret,
      useServerTime: true,
    });

    let order = await s_b.futuresOpenOrders();
    // order.name = i;
    // console.log(order);
    for (let x in order) {
      order[x].name = i;
    }
    // console.log(i);
    obj.slaves.push(order);
    // console.log(typeof order);
    // obj.slaves[x].name = i;
    x++;
  }

  // console.log(obj);

  return obj;
}

export async function getMasterUSDBalance(ticker) {
  let balance = await binance.futuresBalance();

  let total = 0;

  // let ticker = await getTickerPrices();
  for (let i in balance) {
    let token = balance[i];
    let asset = token.asset + "USDT";

    if (
      token.asset == "USD" ||
      token.asset == "USDT" ||
      token.asset == "USDC" ||
      token.asset == "BUSD"
    ) {
      total += token.balance;
      continue;
    }

    let ticker_price = ticker[asset];
    if (ticker_price == undefined) {
      asset = token.asset + "USDC";
      ticker_price = ticker[asset];
    }

    if (ticker_price == undefined) {
      asset = token.asset + "USD";
      ticker_price = ticker[asset];
    }

    if (ticker_price == undefined) {
      asset = token.asset + "BUSD";
      ticker_price = ticker[asset];
    }

    let amt = token.balance * ticker_price;
    // console.log(amt);
    // total += token.balance * ticker_price;
  }

  return parseFloat(total).toFixed(2);
}

export async function getOpenOrders() {
  binance.openOrders(false, (error, openOrders) => {
    console.info("openOrders()", openOrders);
  });
}

export async function getTrades() {
  function balance_update(data) {
    console.log("BALANCE UPDATE DEBUG START");
    console.log(data);
    console.log("BALANCE UPDATE DEBUG END");
    console.log("Balance Update");
    for (let obj of data.B) {
      let { a: asset, f: available, l: onOrder } = obj;
      if (available == "0.00000000") continue;
      console.log(
        asset + "\tavailable: " + available + " (" + onOrder + " on order)"
      );
    }
  }
  function execution_update(data) {
    console.log("ORDER START");
    console.log(data);
    console.log("balances");
    console.log(data.updateData.balances);
    console.log("positions");
    console.log(data.updateData.positions);
    console.log("ORDER END");

    let {
      x: executionType,
      s: symbol,
      p: price,
      q: quantity,
      S: side,
      o: orderType,
      i: orderId,
      X: orderStatus,
    } = data;
    if (executionType == "NEW") {
      if (orderStatus == "REJECTED") {
        console.log("Order Failed! Reason: " + data.r);
      }
      console.log(
        symbol +
          " " +
          side +
          " " +
          orderType +
          " ORDER #" +
          orderId +
          " (" +
          orderStatus +
          ")"
      );

      // console.log("..price: " + price + ", quantity: " + quantity);
      return;
    }
    //NEW, CANCELED, REPLACED, REJECTED, TRADE, EXPIRED
    console.log(
      symbol +
        "\t" +
        side +
        " " +
        executionType +
        " " +
        orderType +
        " ORDER #" +
        orderId
    );
  }

  async function orderUpdateHandler(data) {
    console.log("ORDER UPDATE HANDLER START");
    console.log(data);
    console.log("ORDER UPDATE HANDLER STOP");
    let order = data.order;
    if (order.orderStatus == "NEW") {
      // New order to be placed
      let slaves = await getSlaves();

      // console.log(order);

      console.log(
        `Master Trade: ${order.side} ${order.originalQuantity} of ${order.symbol} `
      );
      for (let i in slaves) {
        let slave = slaves[i];
        if (i == "_id") continue;

        // let bal = await getSlaveUSDBalance(slave.key, slave.secret, ticker);
        // let asset_balance = await getSlaveAssetBalances(
        //   slave.key,
        //   slave.secret
        // );

        const MULTIPLIER = slave.multiplier; // TODO - PULL multiplier from database

        // Calculate order quantity
        // Asset == symbol - USDT
        let asset = order.symbol.slice(0, -4);

        let ticker = await getTickerPrices();
        let slave_balance = await getSlaveUSDBalance(
          slave.key,
          slave.secret,
          ticker
        );
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
        let precision = await fetch(
          "https://api.binance.com/api/v3/exchangeInfo"
        );
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
          let asset = slave_assets[i];
          if (asset.asset == asset) {
            if (asset.availableBalance > data.quantity) {
              data.quantity = Math.round(asset.availableBalance);
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

        // TODO - Optimize optimize optimize
      }
    }
  }
  binance.websockets.userFutureData(
    balance_update,
    execution_update,
    orderUpdateHandler
  );
  // console.info(await binance.futuresAccount());
  // console.log(binance.websockets);
}

export async function validateApiKey() {
  let res = await binance.withdraw("BTC", "***", 0);

  // console.log(res);
}

export async function terminateBinanceSocket() {
  binance.websockets.terminate();

  try {
    let subs = await binance.futuresSubscriptions();
    console.log(subs);
    for (let i in subs) {
      binance.futuresTerminate(subs[i]);
    }
  } catch (error) {
    console.log("No sockets");
    sendTelegramError(error);
  }
}

export async function getTickerPrices() {
  return await binance.prices();
}

// Slave Helpers
export async function getSlaves() {
  let res = await fetch(`${process.env.ROOT_PATH}api/mongo/slaves`);
  res = await res.json();

  delete res._id;
  return res;
}

export async function getSlaveUSDBalance(key, secret, ticker) {
  let slave_binance = new Binance().options({
    APIKEY: key,
    APISECRET: secret,
    useServerTime: true,
  });

  let balance = await slave_binance.futuresBalance();

  let total = 0;

  for (let i in balance) {
    let token = balance[i];
    let asset = token.asset + "USDT";

    if (
      token.asset == "USD" ||
      token.asset == "USDT" ||
      token.asset == "USDC" ||
      token.asset == "BUSD"
    ) {
      total += token.balance;
      continue;
    }

    let ticker_price = ticker[asset];
    if (ticker_price == undefined) {
      asset = token.asset + "USDC";
      ticker_price = ticker[asset];
    }

    if (ticker_price == undefined) {
      asset = token.asset + "USD";
      ticker_price = ticker[asset];
    }

    if (ticker_price == undefined) {
      asset = token.asset + "BUSD";
      ticker_price = ticker[asset];
    }

    let amt = token.balance * ticker_price;
    // console.log(amt);
    // total += token.balance * ticker_price;
  }

  return parseFloat(total).toFixed(2);
}

export async function getSlaveAssetBalances(key, secret) {
  let slave_binance = new Binance().options({
    APIKEY: key,
    APISECRET: secret,
    useServerTime: true,
  });

  let balance = await slave_binance.futuresBalance();

  return balance;
}

let orders = 0;

let trades = {};

export async function makeSlaveTrade(key, secret, data) {
  let copier_status;
  copier_status = await fetch(`${process.env.ROOT_PATH}api/mongo/status`);
  copier_status = await copier_status.json();

  if (copier_status) {
    let slave_binance = new Binance().options({
      APIKEY: key,
      APISECRET: secret,
      useServerTime: true,
    });

    // Get leverae from master
    let position_data = await binance.futuresPositionRisk({
      symbol: data.symbol,
    });

    await slave_binance.futuresLeverage(data.symbol, position_data[0].leverage); // Set leverage on slave

    if (data.side == "BUY") {
      // Buy
      let debug = await slave_binance.futuresMarketBuy(
        data.symbol,
        data.quantity
      );
      console.log(
        `New order made: Buy ${data.quantity} of ${data.symbol} for ${data.name}`
      );
      sendTelegramMaster(
        `New order made: Buy ${data.quantity} of ${data.symbol} for ${data.name}`
      );
      console.log(debug);

      if (debug.msg) {
        sendTelegramError(
          `Error on purchase for ${data.name} on ${data.symbol} for ${data.quantity}`
        );
        sendTelegramError(JSON.stringify(debug.msg));
      }
    } else if (data.side == "SELL") {
      // If sell check to see if amount selling is more than amount that you have

      // Sell
      let debug = await slave_binance.futuresMarketSell(
        data.symbol,
        data.quantity
      );
      console.log(
        `New order made: Sell ${data.quantity} of ${data.symbol} for ${data.name} `
      );
      sendTelegramMaster(
        `New order made: Sell ${data.quantity} of ${data.symbol} for ${data.name} `
      );
      console.log(debug);

      if (debug.msg) {
        sendTelegramError(
          `Error on purchase for ${data.name} on ${data.symbol} for ${data.quantity}`
        );
        sendTelegramError(JSON.stringify(debug.msg));
      }
    }

    // Send Notifications to front end systems
    orders++;
    console.log("Orders placed this copy: " + orders);
    // sendTelegramMaster("Orders placed this instance: " + orders);
  }
}

// Debug helpers
export async function debugBinance() {
  // let data = await binance.futuresBalance();
  let data = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  data = await data.json();
  console.log(data[0].filters);
  // userData: [Function: userData],
  // userMarginData: [Function: userMarginData],
  // userFutureData: [Function: userFutureData],
  // userDeliveryData: [Function: userDeliveryData],
  // subscribe: [Function: subscribe],
  // subscribeCombined: [Function: subscribeCombined],
  // subscriptions: [Function: subscriptions],
  // terminate: [Function: terminate],
  // clearDepthCache: [Function: clearDepthCache],
  // depthCacheStaggered: [Function: depthCacheStaggered],
  // aggTrades: [Function: trades],
  // trades: [Function: trades],
  // chart: [Function: chart],
  // candlesticks: [Function: candlesticks],
  // miniTicker: [Function: miniTicker],
  // bookTickers: [Function: bookTickerStream],
  // prevDay: [Function: prevDay]
}
