export default function SlaveManager() {
  return (
    <div className="w3-container">
      <h1>Slave Manager</h1>

      <form id="new-slave-form" className="w3-center w3-border">
        <h1>New Slave</h1>
        <label htmlFor="name">Name</label>
        <br />
        <input
          name="name"
          className="w3-center w3-input w3-border w3-animate-input "
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />
        <label htmlFor="binance-key">Binance API Key</label>
        <br />
        <input
          name="binance-key"
          className="w3-input w3-border w3-animate-input"
          type="text"
          style={{ width: "50%", textAlign: "center", display: "inline-block" }}
        />
        <br />
        <label htmlFor="binance-secret">Binance API Secret</label>
        <br />
        <input
          name="binance-secret"
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
        />
      </form>

      <br />
    </div>
  );
}
