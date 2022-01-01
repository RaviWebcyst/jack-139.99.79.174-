import Balance from "./Balance";

export default function MasterDash(props) {
  return (
    <div>
      <h1>Master Dash</h1>
      <Balance balance={props.balance} name="master" />
    </div>
  );
}
