Next.js Trade copier

- Deployment on server instructions

# Prep

Make copy of .env.template with proper API keys passed through.
Ensure mongoDB is live and working with proper schema

```shell
cd Binance-API-Trade-Copier
npm install // (If new package is required)
npm run build
```

# Pre-Deployment Check

```shell
pm2 ps // (Check to see if server is online )
pm2 delete 0 // (Should be instance 0, if other index sub 0)

```

# Deployment

```shell
pm2 --name Copier start npm -- start
```

# Post Deployment Checks

Navigate to website and check copier status.
If copier status is on, turn off and then back on for proper init.
Copier will be confirmed running when telegram message is sent.

Once running, leave on. If you need to stop the copier, for the time being restart the entire node server and start again from the #prep instruction block.

Devlogs:

10:08 AM MST 5/7/2021: Alpha 1.0 Release: Current build runs without errors on current copy. The program watches the main account for any market trades, and then places those trades on the copier (placeholder == johnClient). It will place the same trade the main account does, unless the balance is not adequate to make trade. In that case the copier will place a percentage based trade. Sends updates to discord to notify copiers.

12:10 AM MST 5/3/2021: Uploading optmized code to run in persistence on server.

1:39 AM MST 4/24/2021: Uploading initial commit to Github. Project still in early testing stages. By running gui.py, a terminal will show up with the primary client's estimated balance based off of average price from the last 5 minutes. A script will run via 'threading' in paralell with one thread dedicated to the Websocket runtime, one socket dedicated to the balance, and one socket dedicated to monitoring for any new trades. Whenever a new trade is detected by the websocket, it will update a list with a new order to be checked. If a transaction["executed"] == false, the client will evaluate the trade to see the comperable percentage to be applied to the copier list, and upon verifcation of price minimum and available balance, the trade will be executed. Current issues are running into capping the websocket timer so that limits will not be exceeded.

Questions? Email aram.devdocs@gmail.com
