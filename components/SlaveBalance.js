import Balance from "./Balance";

export default function SlaveBalance(props) {
  props = props.props.props;

  console.log(props);
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
    <div>
      <h1>Slave Balance</h1>
      {slave_assets}
    </div>
  );
}
