export async function compareTrades(trade, clients) {
  if (trade.balanceChange !== 0) {
    // let clients = []; // TODO - Populate from database

    for (let i in clients) {
      // Set up binance instance
      let client = clients[i];
      const Binance = require("node-binance-api");
      const binance = new Binance().options({
        APIKEY: client.key,
        APISECRET: client.secret,
      });

      // Calculate rate
      let newRate = client.rate * trade.balanceChange;
      // Transaction made
      if (trade.balanceChange > 0) {
        console.info(await binance.futuresMarketSell(trade.asset, newRate));
      } else {
        console.info(await binance.futuresMarketBuy(trade.asset, newRate));
      }
    }

    //
  }
}
