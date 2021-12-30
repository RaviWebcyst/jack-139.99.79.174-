import {
  getFuturesBalance,
  getSlaveAssetBalances,
  // getSlaveAssetBalances,
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
  let slave_assets = [];

  for (let i in slaves) {
    let slave = slaves[i];
    if (i == "_id") continue;

    let bal = await getSlaveUSDBalance(slave.key, slave.secret, ticker);
    balance_table.push({
      name: i,
      balance: bal,
    });

    // Slave Indvidual Balance Table Start
    let asset_balance = await getSlaveAssetBalances(slave.key, slave.secret);
    // asset_balance.name = i;
    slave_assets.push(asset_balance);
    // Slave Indvidual Balance Table Stop
  }
  // Slave Balance Table Stop

  // console.log(slave_assets);
  return {
    props: {
      balance: await getFuturesBalance(),
      slaves: balance_table,
      slave_assets: slave_assets,
    },
  };
}

export default function Home(props) {
  let slave_assets = [];
  for (let i in props.slave_assets) {
    let a = props.slave_assets[i];
    slave_assets.push(
      <Balance key={i + "slave"} balance={a} name={props.slaves[i].name} />
    );
  }
  return (
    <div className="main">
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />

      <Balance balance={props.balance} name="master" />
      <ViewSlaves slaves={props.slaves} />

      {slave_assets}
    </div>
  );
}
