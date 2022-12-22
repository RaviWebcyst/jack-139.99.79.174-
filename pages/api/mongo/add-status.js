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
    .collection(`${process.env.DB_SLUG}_orders`)
    .findOne();

  

  if (req.method === "POST") {
    
    parentContent = {
      order_id: body.order_id,
    //   qty:body.qty,
    //   symbol:body.symbol,
    //   side:body.side,
    //   api:body.api
    };
  
    let updateDoc = await req.db
      .collection(`${process.env.DB_SLUG}_orders`)
      .replaceOne({}, parentContent, { upsert: true });

    res.status(200).json({ status: "Deleted" });
  } else {
    // Handle any other HTTP method
    console.log("POST REQUESTS ONLY");
    res.status(200).json({ status: negRes });
  }
});

export default handler;
