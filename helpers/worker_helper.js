import Worker from "web-worker";

export function debugWorker() {
  const url = new URL("./worker.js", import.meta.url);
  const worker = new Worker(url);

  worker.addEventListener("message", (e) => {
    console.log(e.data); // "hiya!"
  });

  worker.postMessage({ message: "test me" });
}

export function placeWorkerTradeOrder(data) {
  const url = new URL("./trade_worker.js", import.meta.url);
  const worker = new Worker(url);

  worker.addEventListener("message", (e) => {
    console.log(e.data); // "hiya!"
  });

  worker.postMessage(data);
}
