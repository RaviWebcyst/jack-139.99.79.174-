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
      </div>
    );
  }
}
