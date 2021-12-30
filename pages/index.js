import { getFuturesBalance } from "../helpers/binance_helpers";
import Balance from "./../components/Balance";

export async function getServerSideProps() {
  return { props: { balance: await getFuturesBalance() } };
}

export default function Home(props) {
  return (
    <div className="main">
      <Balance balance={props.balance} />
    </div>
  );
}
