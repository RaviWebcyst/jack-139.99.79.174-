const Binance = require("node-binance-api");
const binance = new Binance().options({});

(async () => {
  console.log(await binance.futuresBalance());
  console.log("end");
})();
