export default function CopierStatus(props) {
  console.log(props);
  let status = props.status.status;

  if (status) {
    return (
      <div className="w3-center w3-container">
        <h1>Copier Status</h1>
        <p>On</p>
        <input
          type="button"
          value="Turn Off"
          onClick={async () => {
            await fetch("/api/stop");
            window.location.reload();
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="w3-center w3-container">
        <h1>Copier Status</h1>
        <p>Off</p>
        <input
          type="button"
          value="Turn ON"
          onClick={async () => {
            await fetch("/api/start");
            window.location.reload();
          }}
        />
        <br />

        <label htmlFor="slave_levergage">Leverage</label>
        <input type="number" />

        <br />
        <h2>Trade Logs</h2>
        <div
          id="trade_logs"
          className="w3-container w3-centered w3-border"
          style={{
            width: "50%",
            textAlign: "center",
            display: "inline-block",
            height: "100px",
          }}
        ></div>
      </div>
    );
  }
}
