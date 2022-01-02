import Balance from "./Balance";
import { useEffect } from "react";
import { useState } from "react";

export default function SlaveBalance() {
  let [slave_assets, setSlaveAssets] = useState(<div className="loader"></div>);

  useEffect(async () => {
    let res = await fetch("/api/slave-balances");
    res = await res.json();

    let arr = [];
    for (let i in res.slave_assets) {
      let a = res.slave_assets[i];
      arr.push(
        <Balance key={i + "slave"} balance={a} name={res.slaves[i].name} />
      );
    }

    setSlaveAssets(arr);
  }, []);

  return (
    <div>
      <h1>Slave Balance</h1>
      {slave_assets}
    </div>
  );
}
