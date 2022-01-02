import clearForm from "../helpers/clearForm";

import { useEffect } from "react";
export default function SlaveManager(props) {
  let delete_slave_table = [];
  let edit_slaves = [];

  // Run on window load
  useEffect(async () => {
    // populate forms
    let slave_names = await fetch("/api/mongo/slaves");
    slave_names = await slave_names.json();
    console.log(slave_names);

    for (let i in slave_names) {
      // i == NAME
      let slave = slave_names[i];
      name = i;
      if (i == "_id") continue;

      // Pop
      document.getElementById(`${i}_name`).value = i;
      document.getElementById(`${i}_binance_key`).value = slave.key;
      document.getElementById(`${i}_binance_secret`).value = slave.secret;
      document.getElementById(`${i}_binance_multiplier`).value =
        slave.multiplier;
    }
  }, []);

  // Populate Delete Slave Table Start
  for (let i in props.slaves) {
    let slave = props.slaves[i];
    async function deleteSlave(e) {
      e.preventDefault();
      let res = await fetch("/api/mongo/delete-slave", {
        method: "POST",
        body: JSON.stringify({
          name: slave.name,
        }),
      });

      window.location.reload();
    }
    delete_slave_table.push(
      <tr key={slave.name}>
        <td>{slave.name}</td>
        <td>
          <input type="button" value="X" onClick={deleteSlave} />
        </td>
      </tr>
    );
  }
  // End

  // Populate Edit Slaves Start
  for (let i in props.slaves) {
    let slave = props.slaves[i];
    async function submitNewSlaveForm(e) {
      e.preventDefault();

      let elements = document.getElementById(
        `${slave.name}_edit_slave_form`
      ).elements;
      elements = Array.from(elements);

      let obj = {};

      // remove submit from array
      elements.pop();
      for (let i in elements) {
        let value = elements[i].value;
        let id = elements[i].id;

        // l;
        let substring = slave.name + "_";
        id = id.substring(substring.length);

        obj[id] = value;
      }
      let req = await fetch("/api/mongo/add-slave", {
        method: "POST",
        body: JSON.stringify(obj),
      });

      clearForm(elements);
      window.location.reload();
    }
    edit_slaves.push(
      <form
        id={`${slave.name}_edit_slave_form`}
        className="w3-center w3-border"
      >
        <h1>Edit {slave.name}</h1>
        <label htmlFor="name">Name</label>
        <br />
        <input
          readOnly={true}
          id={slave.name + "_name"}
          name="name"
          className="w3-center w3-input w3-border "
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />
        <label htmlFor="binance_key">Binance API Key</label>
        <br />
        <input
          id={slave.name + "_binance_key"}
          name="binance_key"
          className="w3-input w3-border w3-animate-input"
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />
        <label htmlFor="binance_secret">Binance API Secret</label>
        <br />
        <input
          id={slave.name + "_binance_secret"}
          name="binance_secret"
          className="w3-input w3-border w3-animate-input"
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />

        <label htmlFor="binance_multiplier">Multiplier</label>
        <br />
        <input
          id={slave.name + "_binance_multiplier"}
          name="binance_multiplier"
          className="w3-input w3-border w3-animate-input"
          type="number"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />

        <input
          name="submit"
          className="w3-input w3-border w3-hoverable"
          type="submit"
          style={{ width: "20%", textAlign: "center", display: "inline-block" }}
          onClick={submitNewSlaveForm}
        />
      </form>
    );
  }
  // End
  // Helpers
  async function submitNewSlaveForm(e) {
    e.preventDefault();

    let elements = document.getElementById("new-slave-form").elements;
    elements = Array.from(elements);

    let obj = {};

    // remove submit from array
    elements.pop();
    for (let i in elements) {
      let value = elements[i].value;
      let id = elements[i].id;

      obj[id] = value;
    }
    let req = await fetch("/api/mongo/add-slave", {
      method: "POST",
      body: JSON.stringify(obj),
    });

    clearForm(elements);
    window.location.reload();
  }

  return (
    <div className="w3-container">
      <h1>Slave Manager</h1>

      <form id="new-slave-form" className="w3-center w3-border">
        <h1>New Slave</h1>
        <label htmlFor="name">Name</label>
        <br />
        <input
          id="name"
          name="name"
          className="w3-center w3-input w3-border w3-animate-input "
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />
        <label htmlFor="binance_key">Binance API Key</label>
        <br />
        <input
          id="binance_key"
          name="binance_key"
          className="w3-input w3-border w3-animate-input"
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />
        <label htmlFor="binance_secret">Binance API Secret</label>
        <br />
        <input
          id="binance_secret"
          name="binance_secret"
          className="w3-input w3-border w3-animate-input"
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />

        <label htmlFor="binance_multiplier">Multiplier</label>
        <br />
        <input
          id="binance_multiplier"
          name="binance_multiplier"
          className="w3-input w3-border w3-animate-input"
          type="number"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />

        <input
          className="w3-input w3-border w3-hoverable"
          type="submit"
          style={{ width: "20%", textAlign: "center", display: "inline-block" }}
          onClick={submitNewSlaveForm}
        />
      </form>

      <h1 className="w3-center">Delete Slave </h1>

      <table
        className="w3-table w3-hoverable w3-centered w3-border w3-bordered"
        id="delete_slave_table"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{delete_slave_table}</tbody>
      </table>

      <div id="edit_slaves">{edit_slaves}</div>
      <br />
    </div>
  );
}
