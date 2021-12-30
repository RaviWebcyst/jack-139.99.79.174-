export default function ViewSlaves(props) {
  let balance_table = [];

  for (let i in props.slaves) {
    let slave = props.slaves[i];

    balance_table.push(
      <tr key={slave.name}>
        <td>{slave.name}</td>
        <td>{slave.balance}</td>
      </tr>
    );
  }
  return (
    <div className="w3-container">
      <h1 className="w3-center">slave table</h1>
      <table
        className="w3-table w3-hoverable w3-centered w3-border w3-bordered"
        id="slave_table"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>USD Balance</th>
          </tr>
        </thead>
        <tbody>{balance_table}</tbody>
      </table>
    </div>
  );
}
