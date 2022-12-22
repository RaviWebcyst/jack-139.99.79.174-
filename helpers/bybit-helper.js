import WebSocket, { WebSocketServer } from "ws";
import { sendTelegramError, sendTelegramMaster } from "./telegram_helper";
import { placeWorkerTradeOrder } from "./worker_helper";


var crypto = require('crypto');

const API_KEY = process.env.APIKEY;
const PRIVATE_KEY = process.env.APISECRET;

// var cron = require('node-cron');

// var ab = 0;
// cron.schedule('* * * * *', () => {
//   console.log(ab);
//   ab++;
//   console.log('running a task every one minute updated');
// });

export async function testWorker(){
//start
console.log('test');
}
const wss = new WebSocket('wss://stream.bybit.com/realtime_private');

wss.on('open', function open() {
  console.log('"open" event!');
	console.log('WebSocket Client Connected');
	const expires = new Date().getTime() + 10000;
	const signature = crypto.createHmac("sha256", PRIVATE_KEY).update("GET/realtime" + expires).digest("hex");
// console.log("signature",signature);
  const payload={
		op: "auth",
		args: [API_KEY, expires.toFixed(0), signature],
	}
  wss.send(JSON.stringify(payload));
  setInterval(()=>{wss.ping()}, 30000);
	wss.ping();
  wss.send('{"op": "subscribe", "args": ["order"]}');
});

wss.on('message', function message(data) {
  console.log('jjdfkdjf: %s', data);
});
wss.on('ping', function (data) {
	console.log("ping received:%s",data);
});
wss.on('pong', function (data) {
	console.log("pong received:%s",data);
});




