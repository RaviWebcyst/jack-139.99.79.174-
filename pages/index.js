import { getServerSideCookie } from "../helpers/cookieHandler";
import Login from "../components/Login";
import Parent from "../components/Parent";
import { debugWorker } from "../helpers/worker_helper";

export async function getServerSideProps({ req, res }) {
  let logged;

  // Check to see if logged in.
  try {
    logged = getServerSideCookie({ req, res }, "log");
  } catch (error) {
    logged = { status: false };
  }
  // console.log(logged);

  // If logged in, fetch proper data as needed.
  if (logged.status) {
    return {
      props: {
        status: true,
        slug: process.env.DB_SLUG,
      },
    };
  } else {
    return { props: { status: false } };
  }
}

// Main Deployment
export default function Home(props) {

  // debugWorker();
  if (!props.status) {
    return <Login />;
  }

  return (
    <div className="main">
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
      <Parent props={props} />
    </div>
  );
}



