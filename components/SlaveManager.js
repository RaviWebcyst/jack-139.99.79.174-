import clearForm from "../helpers/clearForm";
export default function SlaveManager(props) {
  let delete_slave_table = [];

  console.log(props.slaves);
  // Populate Delete Slave Table Start
  for (let i in props.slaves) {
    let slave = props.slaves[i];
    async function deleteSlave(e) {
      e.preventDefault();
      let res = await fetch("/api/mongo/delete-slave", {
        method: "POST",
        body: JSON.stringify({
          name: name,
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

        <input
          name="binance-secret"
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

      <br />
    </div>
  );
}
