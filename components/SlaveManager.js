import clearForm from "../helpers/clearForm";

import { useEffect, useState } from "react";
export default function SlaveManager(props) {
  let [delete_slave_table, setDeleteSlaveTable] = useState(
    <div className="loader"></div>
  );
  let [edit_slaves, setEditSlaves] = useState(<div className="loader"></div>);

  // Run on window load
  useEffect(() => {
    (async () => {
      // let slaves = await fetch("/api/mongo/slaves");
      // slaves = await slaves.json();

      let slave_names = await fetch("/api/mongo/slaves");
      slave_names = await slave_names.json();

      let slaves = [];
      for (let i in slave_names) {
        if (i !== "_id")
          slaves.push({ name: i, active: slave_names[i].active });
        // console.log(slave_names[i]);
      }

      // Populate Delete Slave Table Start
      let arr = [];

      for (let i in slaves) {
        let slave = slaves[i];
        async function deleteSlave(e) {
          e.preventDefault();
          // console.log(e);
          let res = await fetch("/api/mongo/delete-slave", {
            method: "POST",
            body: JSON.stringify({
              name: e.target.parentElement.id,
            }),
          });
          window.location.reload();
        }

        let active = [];

        if (slave.active) {
          active.push(
            <input
              type="checkbox"
              defaultChecked
              onChange={(e) => {
                console.log(e.target.parentElement.id);
                let status = e.target.checked;

                fetch("/api/mongo/change-slave-status", {
                  method: "POST",
                  body: JSON.stringify({
                    name: e.target.parentElement.id,
                    active: status,
                  }),
                });
              }}
            />
          );
        } else {
          active.push(
            <input
              type="checkbox"
              onChange={(e) => {
                console.log(e.target.parentElement.id);
                let status = e.target.checked;

                fetch("/api/mongo/change-slave-status", {
                  method: "POST",
                  body: JSON.stringify({
                    name: e.target.parentElement.id,
                    active: status,
                  }),
                });
              }}
            />
          );
        }
        // console.log(slave);
        arr.push(
          <tr
            // key={slave.name + "_edit_delete"}
            className="w3-animate-bottom"
            key={slave.name}
          >
            <td>{slave.name}</td>
            <td id={slave.name}>
              <input type="button" value="X" onClick={deleteSlave} />
            </td>
            <td id={slave.name}>{active}</td>
          </tr>
        );
      }
      setDeleteSlaveTable(arr);

      // End

      // Populate Edit Slaves Start
      let arr2 = [];

      for (let i in slaves) {
        let slave = slaves[i];
        // console.log(slave);
        async function submitEditSlaveForm(e) {}
        arr2.push(
          <form
            key={slave.name + "_key"}
            id={`${slave.name}_edit_slave_form`}
            className="w3-center w3-border w3-animate-bottom"
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
              style={{
                width: "50%",
                textAlign: "center",
                display: "inline-block",
              }}
            />
            <br />
            <label htmlFor="binance_key">Binance API Key</label>
            <br />
            <input
              id={slave.name + "_binance_key"}
              name="binance_key"
              className="w3-input w3-border w3-animate-input"
              type="text"
              style={{
                width: "50%",
                textAlign: "center",
                display: "inline-block",
              }}
              required={true}
            />
            <br />
            <label htmlFor="binance_secret">Binance API Secret</label>
            <br />
            <input
              id={slave.name + "_binance_secret"}
              name="binance_secret"
              className="w3-input w3-border w3-animate-input"
              type="text"
              style={{
                width: "50%",
                textAlign: "center",
                display: "inline-block",
              }}
              required={true}
            />
            <br />

            <label htmlFor="binance_multiplier">Multiplier</label>
            <br />
            <input
              id={slave.name + "_binance_multiplier"}
              name="binance_multiplier"
              className="w3-input w3-border w3-animate-input"
              type="number"
              style={{
                width: "50%",
                textAlign: "center",
                display: "inline-block",
              }}
              required={true}
            />
            <br />

            <input
              name={slave.name}
              className="w3-input w3-border w3-hoverable"
              type="submit"
              style={{
                width: "20%",
                textAlign: "center",
                display: "inline-block",
              }}
              onClick={async (e) => {
                e.preventDefault();

                // console.log(e.target.name);
                slave.name = e.target.name;
                // return;
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

                // console.log(obj);
                let req = await fetch("/api/mongo/add-slave", {
                  method: "POST",
                  body: JSON.stringify(obj),
                });

                clearForm(elements);
                window.location.reload();
              }}
            />
          </form>
        );
      }

      // console.log(arr2);
      setEditSlaves(arr2);

      // End

      // populate forms
      // let slave_names = await fetch("/api/mongo/slaves");
      // slave_names = await slave_names.json();
      // console.log(slave_names);

      for (let i in slave_names) {
        // i == NAME
        let slave = slave_names[i];
        // name = i;
        if (i == "_id") continue;

        // Pop
        document.getElementById(`${i}_name`).value = i;
        document.getElementById(`${i}_binance_key`).value = slave.key;
        document.getElementById(`${i}_binance_secret`).value = slave.secret;
        document.getElementById(`${i}_binance_multiplier`).value =
          slave.multiplier;
      }
    })();
  }, []);

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

      <form
        id="new-slave-form"
        className="w3-center w3-border w3-animate-bottom"
      >
        <h1>New Slave</h1>
        <label htmlFor="name">Name</label>
        <br />
        <input
          required={true}
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
          required={true}
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
          required={true}
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
          required={true}
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
            <th>Active</th>
          </tr>
        </thead>
        <tbody>{delete_slave_table}</tbody>
      </table>

      <div id="edit_slaves">{edit_slaves}</div>
      <br />
    </div>
  );
}
