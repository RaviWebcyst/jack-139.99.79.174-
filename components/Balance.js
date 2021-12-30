import { useEffect, useState } from "react";

export default function Balance(props) {
  let balance_table = [];
  for (let i in props.balance) {
    let row = props.balance[i];
    balance_table.push(
      <tr key={row.accountAlias + row.asset}>
        <td>{row.asset}</td>
        <td>{row.balance}</td>
      </tr>
    );
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>{balance_table}</tbody>
    </table>
  );
}
