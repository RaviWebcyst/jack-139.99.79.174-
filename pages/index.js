import {
  getFuturesBalance,
  getSlaves,
  getTickerPrices,
} from "../helpers/binance_helpers";
import Balance from "./../components/Balance";
import ViewSlaves from "./../components/ViewSlaves";
import { getSlaveUSDBalance } from "../helpers/binance_helpers";
export async function getServerSideProps() {
  // Slave Balance Table Start
  let balance_table = [];
  let slaves = await getSlaves();
  let ticker = await getTickerPrices();

  for (let i in slaves) {
    let slave = slaves[i];
    if (i == "_id") continue;

    let bal = await getSlaveUSDBalance(slave.key, slave.secret, ticker);
    balance_table.push({
      name: i,
      balance: bal,
    });
  }
  // Slave Balance Table Stop

  return {
    props: {
      balance: await getFuturesBalance(),
      slaves: balance_table,
    },
  };
}

export default function Home(props) {
  return (
    <div className="main">
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />

      <Balance balance={props.balance} id="master" />
      <ViewSlaves slaves={props.slaves} />
    </div>
  );
}
