import { useEffect, useState } from "react";
import { getCookie } from "../helpers/cookieHandler";

// Component Import Start
import CopierStatus from "./CopierStatus";
import MasterDash from "./MasterDash";
import SlaveBalance from "./SlaveBalance";
import SlaveManager from "./SlaveManager";
import Settings from "./Settings";
import OpenOrders from "./OpenOrders";
// Component Import Stop

export default function Parent(props) {
  let appWrapper = {
    CopierStatus: CopierStatus,
    MasterDash: MasterDash,
    SlaveBalance: SlaveBalance,
    SlaveManager: SlaveManager,
    Settings: Settings,
  };
  let DefaultApp = appWrapper[getCookie("DefaultApp")] || (
    <CopierStatus status={props.props.copier_status} slug={props.props.slug} />
  );

  //   DefaultApp = <DefaultApp />;
  let [app, setApp] = useState(DefaultApp);

  // Helper Functions

  function copierStatusButton(e) {
    e.preventDefault();
    setApp(
      <CopierStatus
        status={props.props.copier_status}
        slug={props.props.slug}
      />
    );
  }

  function masterDashButton(e) {
    e.preventDefault();
    setApp(<MasterDash key="master-dash" balance={props.props.balance} />);
  }

  function slaveBalanceButton(e) {
    e.preventDefault();
    setApp(<SlaveBalance key="slave-balance" props={props} />);
  }

  function slaveManagerButton(e) {
    e.preventDefault();
    setApp(<SlaveManager slaves={props.props.slaves} />);
  }

  function openOrdersButton(e) {
    e.preventDefault();
    setApp(<OpenOrders />);
  }

  // console.log(DefaultApp);
  return (
    <div>
      <input type="button" value="Copier Status" onClick={copierStatusButton} />
      <input type="button" value="Balance" onClick={masterDashButton} />
      <input type="button" value="Slave Balance" onClick={slaveBalanceButton} />
      <input type="button" value="Slave Manager" onClick={slaveManagerButton} />
      <input type="button" value="Open" onClick={openOrdersButton} />

      <div className="app_parent">{app}</div>

      <br />
    </div>
  );
}
