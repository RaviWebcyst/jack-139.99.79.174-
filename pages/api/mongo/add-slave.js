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
  parentContent = await req.db.collection("slaves").findOne();

  if (req.method === "POST") {
    // Process a POST request

    // console.log("body");
    // console.log(body);
    parentContent[body.name] = {
      key: body.binance_key,
      secret: body.binance_secret,
      multiplier: body.binance_multiplier,
      active: parentContent[body.name].active,
    };

    // console.log("parent content");
    // console.log(parentContent);
    let updateDoc = await req.db
      .collection("slaves")
      .replaceOne({}, parentContent, { upsert: true });

    res.status(200).json({ status: "Deleted" });
  } else {
    // Handle any other HTTP method
    console.log("POST REQUESTS ONLY");
    res.status(200).json({ status: negRes });
  }
});

export default handler;
