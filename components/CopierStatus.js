import { useEffect, useState } from "react";

export default function CopierStatus() {
  // console.log(props);
  // let status = props.status.status;

  let [status, setStatus] = useState(<div class="loader"></div>);

  useEffect(async () => {
    //
    // Set Open Orders
    let res = await fetch("/api/futures-open-orders");
    res = await res.json();

    console.log("Open Orders:");
    console.log(res);

    let copier_status;
    copier_status = await fetch(`/api/mongo/status`);
    copier_status = await copier_status.json();

    if (copier_status) {
      setStatus([
        <div key="closed" className="w3-center w3-container w3-animate-bottom">
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
          >
            TODO: Add socket to maintain GUI updates
          </div>
        </div>,
      ]);
    } else {
      setStatus([
        <div key="closed" className="w3-center w3-container w3-animate-bottom">
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
          <input type="number" readOnly={true} />
        </div>,
      ]);
    }
  }, []);

  return (
    <div>
      <h1>Copier Status</h1>
      {status}
    </div>
  );
}
