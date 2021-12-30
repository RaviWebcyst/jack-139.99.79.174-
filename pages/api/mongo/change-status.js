import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
const handler = nextConnect();
handler.use(middleware);
handler.get(async (req, res) => {
  let status = await req.db.collection("status").findOne();

  let doc = await req.db
    .collection("status")
    .findOneAndReplace({}, { status: !status.status });

  // console.log(doc);
  res.json(doc);
});
export default handler;
