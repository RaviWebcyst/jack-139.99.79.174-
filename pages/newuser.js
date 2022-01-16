export default function newUser() {
  async function newUser(e) {
    e.preventDefault();

    let body = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      slug: document.getElementById("slug").value,
    };

    await fetch("/api/newuser", {
      method: "POST",
      body: JSON.stringify(body),
    });

    window.location.reload();
  }

  return (
    <form>
      <input id="username" type={"text"} placeholder="username" />
      <input id="password" type={"password"} placeholder="password" />
      <input id="slug" type={"text"} placeholder="slug" />

      <input type="submit" value={"New User"} onClick={newUser} />
    </form>
  );
}
