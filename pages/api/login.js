// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { checkPassword } from "../../helpers/handleLogin";

export default async function handler(req, res) {
  let response = { number: 201, status: false };
  let body = JSON.parse(req.body);
  // console.log(body);

  let user = await fetch(`${process.env.ROOT_PATH}api/mongo/get-user`);
  console.log(user);
  user = await user.json();

  let current = false;

  try {
    current = user[body.username];
  } catch (error) {}

  // console.log(current);
  if (current) {
    response.status = await checkPassword(current.password, body.password);
    if (response.status) response.number = 200;
  }
  // console.log(response);
  res.status(response.number).json(response);
}
