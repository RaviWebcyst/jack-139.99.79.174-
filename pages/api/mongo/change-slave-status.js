import fs from "fs";
import nextConnect from "next-connect";
import middleware from "./../../../middleware/database";

// Globals
let parentContent;
const handler = nextConnect();
handler.use(middleware);

// API Handler
handler.post(async (req, res) => {
  // console.log('test connection')
  let body = JSON.parse(req.body);

  // Get content collection
  parentContent = await req.db
    .collection(`${process.env.DB_SLUG}_slaves`)
    .findOne();

  if (req.method === "POST") {
    // Process a POST request

    // console.log("body");
    // console.log(body);
    parentContent[body.name].active = body.active;

    // console.log("parent content");
    // console.log(parentContent);
    let updateDoc = await req.db
      .collection(`${process.env.DB_SLUG}_slaves`)
      .replaceOne({}, parentContent, { upsert: true });

    res.status(200).json({ status: "Deleted" });
  } else {
    // Handle any other HTTP method
    console.log("POST REQUESTS ONLY");
    res.status(200).json({ status: negRes });
  }
});

export default handler;
