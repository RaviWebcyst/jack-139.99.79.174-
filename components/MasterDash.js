import Balance from "./Balance";
import { useEffect, useState } from "react";

export default function MasterDash(props) {
  let [balance, setBalance] = useState(<div className="loader"></div>);

  function set(res) {
    setBalance(<Balance balance={res} name="master" />);
  }

  useEffect(() => {
    (async () => {
      let res = await fetch("/api/master-balance");
      res = await res.json();

      // console.log(res);

      set(res);
    })();
  }, []);
  return (
    <div>
      <h1>Master Dash</h1>
      {/* <Balance balance={props.balance} name="master" />
       */}

      {balance}
    </div>
  );
}
