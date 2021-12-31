import { useEffect, useState } from "react";

export default function Balance(props) {
  let balance_table = [];
  for (let i in props.balance) {
    let row = props.balance[i];
    if (row.balance > 0) {
      balance_table.push(
        <tr key={row.accountAlias + row.asset}>
          <td>{row.asset}</td>
          <td>{row.balance}</td>
        </tr>
      );
    }
  }

  let table_name = props.name + "_balance_table";

  // console.log(props);
  return (
    <div className="w3-container">
      <h1 className="w3-center">{props.name} table</h1>

      <table
        className="w3-table w3-hoverable w3-centered w3-border w3-bordered"
        id={table_name}
      >
        <thead>
          <tr>
            <th>Asset</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>{balance_table}</tbody>
      </table>
    </div>
  );
}
