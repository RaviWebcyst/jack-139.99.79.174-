import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
const handler = nextConnect();
handler.use(middleware);
handler.get(async (req, res) => {
  let doc = await req.db.collection(`${process.env.DB_SLUG}_slaves`).findOne();
  // console.log(doc);
  res.json(doc);
});
export default handler;
