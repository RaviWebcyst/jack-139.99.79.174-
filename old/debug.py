# Init values
from binance.client import Client
# from binance.websockets import BinanceSocketManager
from binance import *
import binance.client as bc
from pprint import pprint
import tkinter
import time
import os
# from twisted.internet import reactor
import json
import math

import pandas as pd


with open("key.json") as json_data_file:
    key = json.load(json_data_file)


APIKEY = key["copier"]["APIKEY"]
APISECRET = key["copier"]["APISECRET"]
client = Client(APIKEY, APISECRET, {"verify": True, "timeout": 10000})
# info = client.get_account()


# df = pd.DataFrame(info["balances"])
# df["free"] = df["free"].astype(float).round(4)
# df = df[df["free"] > 0]
# print(df)

futures = client.futures_account_balance()

pprint(futures)