import { getCookie, setCookie } from "./../helpers/cookieHandler";

export default function Login() {
  // console.log(getCookie("log"));
  return (
    <div className="w3-container w3-center ">
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />

      <form>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" required />
        <br />
        <label htmlFor="password">password</label>
        <input id="password" name="password" type="password" required />
        <br />
        <input
          type="submit"
          value="login"
          onClick={async (e) => {
            e.preventDefault();
            console.log(e.target.form);
            let username = document.getElementById("username").value;
            let res = await fetch("/api/login", {
              method: "POST",
              body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
              }),
            });

            // res = await res.JSON();
            // console.log(res.status);
            if (res.status == 200) {
              setCookie("log", { status: true });
              window.location.reload();
            }
          }}
        />
      </form>
    </div>
  );
}
