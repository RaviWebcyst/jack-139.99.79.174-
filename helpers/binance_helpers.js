import WebSocket, { WebSocketServer } from "ws";

const Binance = require("node-binance-api");

const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
});

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
