import WebSocket, { WebSocketServer } from "ws";

// Prelim setup

const Binance = require("node-binance-api");

const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
});

// Master Helpers
export async function getFuturesBalance() {
  // Balance start
  return await binance.futuresBalance();
  // Balance stop
}

export async function getOpenOrders() {
  binance.openOrders(false, (error, openOrders) => {
    console.info("openOrders()", openOrders);
  });
}

export async function getTrades() {
  function balance_update(data) {
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
    console.log(data);
    console.log(data.updateData.balances);
    console.log(data.updateData.positions);

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

      console.log("..price: " + price + ", quantity: " + quantity);
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
  binance.websockets.userFutureData(balance_update, execution_update);
  // console.info(await binance.futuresAccount());
  // console.log(binance.websockets);
}

export async function validateApiKey() {
  let res = await binance.withdraw(
    "BTC",
    "14DY9NBGSh3LYTqsHupWTuUULrmfG7e2kn",
    0
  );

  // console.log(res);
}

export async function terminateBinanceSocket() {
  binance.websockets.terminate();
}

export async function getTickerPrices() {
  return await binance.prices();
}

// Slave Helpers
export async function getSlaves() {
  let res = await fetch(`${process.env.ROOT_PATH}api/mongo/slaves`);
  res = await res.json();

  return res;
}

export async function getSlaveUSDBalance(key, secret, ticker) {
  let slave_binance = new Binance().options({
    APIKEY: key,
    APISECRET: secret,
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

// Debug helpers
export async function debugBinance() {
  let data = binance.websockets.terminate();
  console.log(data);
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
