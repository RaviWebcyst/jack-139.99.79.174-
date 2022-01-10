import { useEffect, useState } from "react";

export default function OpenOrders() {
  let [open, setOpen] = useState(<div className="loader"></div>);

  async function refreshOrder() {
    // Set Open Orders
    let res = await fetch("/api/futures-open-orders");
    res = await res.json();

    console.log("Open Orders:");
    console.log(res);

    let arr = [];

    // set master
    for (let i in res.master) {
      let order = res.master[i];

      async function closeTrade(e) {
        e.preventDefault();
        masterCloseOrder(order.symbol, order.orderId);
      }

      arr.push(
        <tr id={i + "_open_order"} key={i + "_open_order"}>
          <td>Master</td>
          <td>{order.symbol}</td>
          <td>{order.side}</td>
          <td>{order.stopPrice}</td>
          <td>{order.type}</td>
          <td>{order.origQty}</td>
          <td>
            <input type="button" value="Close Trade" onClick={closeTrade} />{" "}
          </td>
        </tr>
      );
    }

    // set slaves
    for (let i in res.slaves) {
      let a = res.slaves[i];

      for (let x in a) {
        let order = a[x];

        async function closeTrade(e) {
          e.preventDefault();
          masterCloseOrder(order.symbol, order.orderId);
        }
        arr.push(
          <tr>
            <td>{order.name}</td>
            <td>{order.symbol}</td>
            <td>{order.side}</td>
            <td>{order.stopPrice}</td>
            <td>{order.type}</td>
            <td>{order.origQty}</td>
            <td>
              <input type="button" value="Close Trade" onClick={closeTrade} />{" "}
            </td>
          </tr>
        );
      }
    }

    setOpen(arr);
  }
  useEffect(() => {
    (async () => {
      refreshOrder();
    })();
  }, []);
  return (
    <div className="w3-container w3-center w3-border">
      {/* <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      /> */}

      <h1 className="w3-center">Open Orders</h1>
      {/* <div
        class="fa fa-refresh"
        style="font-size:36px;"
        onClick={refreshOrder}
      ></div> */}

      <table className="w3-table w3-hoverable w3-centered w3-border w3-bordered">
        <thead>
          <tr>
            <th>Account</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Price</th>
            <th>Type</th>
            <th>Qty</th>
            <td>Close</td>
          </tr>
        </thead>
        <tbody>{open}</tbody>
      </table>
    </div>
  );
}

// avgPrice: "0"
// clientOrderId: "web_dILRzVkXrGASK2ZwHGei"
// closePosition: true
// cumQuote: "0"
// executedQty: "0"
// orderId: 1804777211
// origQty: "0"
// origType: "TAKE_PROFIT_MARKET"
// positionSide: "BOTH"
// price: "0"
// priceProtect: false
// reduceOnly: true
// side: "SELL"
// status: "NEW"
// stopPrice: "0.8522"
// symbol: "CHRUSDT"
// time: 1641185338115
// timeInForce: "GTE_GTC"
// type: "TAKE_PROFIT_MARKET"
// updateTime: 1641185338115
// workingType: "MARK_PRICE"
// [[Prototype]]: Object

async function masterCloseOrder(symbol, id) {
  if (confirm("Are you sure you want to delete the order?")) {
    await fetch("/api/close-trade", {
      method: "POST",
      body: JSON.stringify({
        symbol: symbol,
        id: id,
      }),
    });
  } else {
    console.log("Dont do it!");
  }
}
