// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
    getTrades,
    testBalance
} from "../../helpers/binance_helpers";

export default function handler(req, res) {

    console.log("get trades handler");
    testBalance();
    //   getTrades();
}
