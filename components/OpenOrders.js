import { useEffect, useState } from "react";
import $ from "jquery";

// import { getDatasv } from "./../helpers/binance_helpers";


export default function OpenOrders() {
  let [open, setOpen] = useState(<div className="loader"></div>);
  let [positions, setPositions] = useState(<div className="loader"></div>);

  async function refreshOrder() {
    
    // Set Open Orders
    console.log("order working");

    let res = await fetch("/api/futures-open-orders");
    res = await res.json();

    let master_open_order = res['master']['order'];
    let slave_open_order = res['slaves'];

    let res_pos = await fetch("/api/futures-open-positions");
    res_pos = await res_pos.json();

    
    var master_order = res_pos['master']['order'];
    
    let slave_order = res_pos['slaves'];
    // let res_pos1 = await fetch(`${process.env.ROOT_PATH}/api/test`);
    // res_pos1= await res_pos1.json();

    // let slav = res_pos1;
    // for (let i in slav.slaves) {
    //   let dat = slav.slaves[i];
    //   if (parseFloat(dat.positionAmt) > 0 ) {
    //     console.log(dat.positionAmt);
    //     sendTelegramMaster("position_amount"+dat.positionAmt);
    //   }
    //   i++;
    // }

    // console.log("res");
    // console.log(res_pos);


    // console.log("all positions"+res_pos);

    // for (let i in res_pos.slaves) {
    //   let slave = res_pos.slaves[i];

    //   for (let j in slave) {
    //     let data = slave[j];
    //     if (parseFloat(data.positionAmt) > 0) {
    //       console.log("positionamt");
    //       console.log(data);
    //       // slave_positions.push(data);
    //     }
    //   }
    // }

    // console.log("Open Orders:");
    // console.log(res);

    // let arr = [];

    // // Orders
    // // set master orders
    // for (let i in res.master) {
    //   let order = res.master[i];
    //   console.log(order);

    //   async function closeTrade(e) {
    //     // console.log("working click");
    //     e.preventDefault();
    //     // console.log("working click");
    //     // console.log(e.target.id);

    //     masterCloseOrder(order.symbol, order.orderId, e.target.name);
    //   }

    //   arr.push(
    //     <tr id={i + "_open_order"} key={i + "_open_order"}>
    //       <td>Master</td>
    //       <td>{order.symbol}</td>
    //       <td>{order.side}</td>
    //       {/* <td>{order.stopPrice}</td> */}
    //       <td>{order.type}</td>
    //       {/* <td>{order.origQty}</td> */}
    //       <td>
    //         <input
    //           name="master"
    //           type="button"
    //           value="Close Trade"
    //           onClick={closeTrade}
    //         />{" "}
    //       </td>
    //     </tr>
    //   );
    // }

    // // set slaves orders
    // for (let i in res.slaves) {
    //   let a = res.slaves[i];

    //   for (let x in a) {
    //     let order = a[x];

    //     async function closeTrade(e) {
    //       e.preventDefault();
    //       // console.log(e.target.name);
    //       masterCloseOrder(order.symbol, order.orderId, e.target.name);
    //     }
    //     arr.push(
    //       <tr>
    //         <td>{order.name}</td>
    //         <td>{order.symbol}</td>
    //         <td>{order.side}</td>
    //         {/* <td>{order.stopPrice}</td> */}
    //         <td>{order.type}</td>
    //         {/* <td>{order.origQty}</td> */}
    //         <td>
    //           <input
    //             name={order.name}
    //             type="button"
    //             value="Close Trade"
    //             onClick={closeTrade}
    //           />{" "}
    //         </td>
    //       </tr>
    //     );
    //   }
    // }

    // setOpen(arr);

    // Positions

    let master_positions = [];
    let slave_positions = [];
    for (let i in master_order) {
      master_positions.push(master_order[i]);
      
    }


    for (let i in slave_order) {
      let slave = slave_order[i];
      let slaves =slave;
      

      for (let x in slaves) {
        let chunk = slaves[x];
        slave_positions.push(chunk);
      }
    }
    

    let arr2 = [];
    // console.log("master positions");
    // console.log(master_positions);
    for (let i in master_positions) {
      // console.log("order112");
      // console.log(master_positions[i]);
      let order = master_positions[i];
      // console.log(order);
      
      localStorage.setItem("master_side_"+i,order.side);
      localStorage.setItem("master_id_"+i,i);
      localStorage.setItem("master_symbol_"+i,order.symbol);
      localStorage.setItem("master_pmt_"+i,order.size);
      localStorage.setItem("master_api_"+i,order.api);
      localStorage.setItem("master_secret_"+i,order.secret);
      // let

        let conn = new WebSocket('wss://stream.bybit.com/realtime_public');
        $("#"+order.symbol).text();
        conn.onopen = function(e) {
            console.log("Connection established!");
            conn.send('{"op": "subscribe", "args": ["instrument_info.100ms.'+order.symbol+'"]}');
          };
        conn.onmessage = function(e) {
          var datas = JSON.parse(e.data);
          
            if(typeof datas.data !== "undefined" ){
            // console.log("data"+JSON.stringify(datas.data));
            var data = datas.data.update;
              for(let i in data){
                let val  = data[i];
                var mark_price = val.mark_price;
                
                if(mark_price > 0 && typeof mark_price !== "undefined"){
                var pnl = (order.size * 1 * ((1/mark_price)-(1/order.entry_price)));
                pnl = pnl.toFixed(5);
                if(pnl > 0){
                    pnl = "+"+pnl;
                }
               console.log("pnl");
               console.log(pnl);
               $("#"+order.symbol).text(pnl);
               $("#"+order.side).text(mark_price);
              }
            }
            }
        };

      arr2.push(
        <tr id={i + "_open_position"} key={i + "_open_position"}>
          <td>Master</td>
          <td>{order.symbol}</td>
          <td>{order.side}</td>
          <td>{order.size}</td>
          {/* <td id={order.symbol}></td>
          <td id={order.side}></td> */}
          <td>
            <input
              value={"Close Position"}
              type={"button"}
              id={i+"mid"}
              onClick={() => {
                // masterClosePosition("master_"+i,"master");
                masterClosePosition("master_id_"+i,"master_symbol_"+i,"master_secret_"+i,"master_api_"+i,"master_pmt_"+i,"master_side_"+i,"master"); 
              }
              }
            ></input>
          </td>
        </tr>
      );  
    }
    console.log(slave_order);

    for (let i in slave_order) {
      let name = slave_order[i].name;
      let orders = slave_order[i].order;
      let api = slave_order[i].key;
      let secret = slave_order[i].secret;

      for( let k in orders){
        let order = orders[k];
      
      localStorage.setItem("slave_side_"+i,order.side);
      localStorage.setItem("slave_id_"+i,i);
      localStorage.setItem("slave_symbol_"+i,order.symbol);
      localStorage.setItem("slave_pmt_"+i,order.size);
      localStorage.setItem("slave_api_"+i,api);
      localStorage.setItem("slave_secret_"+i,secret);
      console.log("order");
      console.log(order);

      let profit = 0;
      let conn = new WebSocket('wss://stream.bybit.com/realtime_public');
      conn.onopen = function(e) {
          console.log("Connection established!");
          conn.send('{"op": "subscribe", "args": ["instrument_info.100ms.'+order.symbol+'"]}');
        };
      conn.onmessage = function(e) {
          var datas = JSON.parse(e.data);
          // console.log("data1"+JSON.stringify(datas));
          if(typeof datas.data !== "undefined" ){
          var data = datas.data.update;
         
            for(let i in data){
              let val  = data[i];
              var mark_price = val.mark_price;
              if(mark_price > 0 ){
              var pnl = (order.size * 1 * (order.price - mark_price));
              
              pnl = pnl.toFixed(5);
              if(pnl > 0){
                  pnl = "+"+pnl;
              }
              console.log("pnl1");
                console.log(pnl);
              profit = pnl;
            }
          }
        }
      };

      arr2.push(
        <tr id={i + "_open_slave_position"} key={i + "_open_slave_position"}>
          <td>{name}</td>
          <td>{order.symbol}</td>
          <td>{order.side}</td>
          <td id={'id_'+i}>{order.size}</td>
          <td>
            <input
              value={"Close Position"}
              type={"button"}
              id={i+"bid"}
              onClick={() => 
               { 
                //  masterClosePosition("slave_"+i,order.name); 
                 masterClosePosition("slave_id_"+i,"slave_symbol_"+i,"slave_secret_"+i,"slave_api_"+i,"slave_pmt_"+i,"slave_side_"+i,name); 
                }
              }
            ></input>
          </td>
        </tr>
      );
    
    }
  }

    // console.log(master_positions);
    // console.log(slave_positions);
    setPositions(arr2);
  }

  function refreshPage() {}
  useEffect(() => {
    (async () => {
      refreshOrder();
    })();
    let timer;

    timer = setInterval(async () => {
      // console.log("This will run after 10 second!");
      refreshOrder();
    }, 15000);
    return () => clearTimeout(timer);
  }, 
  []);
  return (
    <div className="w3-container w3-center w3-border w3-padding-16 " >
      {/* <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      /> */}

      {/* <h1 className="w3-center">Open Orders</h1> */}
      {/* <div
        class="fa fa-refresh"
        style="font-size:36px;"
        onClick={refreshOrder}
      ></div> */}

      {/* <table className="w3-table w3-hoverable w3-centered w3-border w3-bordered">
        <thead>
          <tr>
            <th>Account</th>
            <th>Symbol</th>
            <th>Side</th> */}
            {/* <th>Price</th> */}
            {/* <th>Type</th> */}
            {/* <th>Qty</th> */}
            {/* <th>Close</th>
          </tr>
        </thead>
        <tbody>{open}</tbody>
      </table> */}

      <h1 className="w3-center">Open Positions</h1>

      <table className="w3-table w3-hoverable w3-centered w3-border w3-bordered mb-5">
        <thead>
          <tr>
            <th>Account</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Amount</th>
            {/* <th>Profit</th>
            <th>Mark Price</th> */}
            <th>Close</th>
          </tr>
        </thead>
        <tbody>{positions}</tbody>
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

// async function masterCloseOrder(symbol, id) {
//   if (confirm("Are you sure you want to delete the order 2222?")) {
//     await fetch("/api/close-trade", {
//       method: "POST",
//       body: JSON.stringify({
//         symbol: symbol,
//         id: id,
//       }),
//     });
//   } else {
//     console.log("Dont do it!");
//   }
// }

async function masterClosePosition(id,symbol,secret,api,quantiy,side,name) {
  
  if (confirm("Are you sure you want to delete the order?")) {
    console.log("name");
    console.log(name);
    
    let idd = localStorage.getItem(id);
    console.log("id");
    console.log(idd);
    // console.log(localStorage.getItem(i));
    let sym = localStorage.getItem(symbol);
    console.log("symbol");
    console.log(sym);
    let sec = localStorage.getItem(secret);
    console.log("secret");
    console.log(sec);
    let apii = localStorage.getItem(api);
    console.log("api");
    console.log(apii);
    let pmt = localStorage.getItem(quantiy);
    console.log("quantity");
    console.log(pmt);
    let siide = localStorage.getItem(side);
    console.log("side");
    console.log(siide);
    

    localStorage.removeItem(id);
    localStorage.removeItem(symbol);
    localStorage.removeItem(secret);
    localStorage.removeItem(api);
    localStorage.removeItem(quantiy);
    localStorage.removeItem(side);

     
    await fetch("/api/close-position", {
      method: "POST",
      body: JSON.stringify({
        side:siide,
        api:apii,
        secret:sec,
        symbol: sym,
        quantity:pmt,
        name: name,
        id:idd
      }),
    });
  } else {
    console.log("Dont do it!");
  }

}
