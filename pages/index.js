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
import { getServerSideCookie } from "../helpers/cookieHandler";
import Login from "../components/Login";
import CopierStatus from "../components/CopierStatus";
export async function getServerSideProps({ req, res }) {
  let logged;

  try {
    logged = getServerSideCookie({ req, res }, "log");
  } catch (error) {
    logged = { status: false };
  }
  console.log(logged);

  if (logged.status) {
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

    let copier_status;
    copier_status = await fetch(`${process.env.ROOT_PATH}api/mongo/status`);
    copier_status = await copier_status.json();

    // console.log(slave_assets);
    return {
      props: {
        balance: await getFuturesBalance(),
        slaves: balance_table,
        slave_assets: slave_assets,
        status: true,
        copier_status: copier_status,
      },
    };
  } else {
    return { props: { status: false } };
  }
}

export default function Home(props) {
  if (!props.status) {
    return <Login />;
  }
  // Set up a list of assets from each client
  // TODO - Switch this over to reference from button click to reduce initial load times
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
      <CopierStatus status={props.copier_status} />
      <Balance balance={props.balance} name="master" />
      <ViewSlaves slaves={props.slaves} />

      {slave_assets}
    </div>
  );
}
