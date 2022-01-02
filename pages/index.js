import { getServerSideCookie } from "../helpers/cookieHandler";
import Login from "../components/Login";
import Parent from "../components/Parent";
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
      },
    };
  } else {
    return { props: { status: false } };
  }
}

// Main Deployment
export default function Home(props) {
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
