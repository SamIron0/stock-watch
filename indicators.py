import json
from tradingview_ta import TA_Handler, Interval
import sys
import yfinance as yf

ticker_symbol = sys.argv[-1]

ticker = yf.Ticker(ticker_symbol)
stock_info = ticker.info
exchange = stock_info['exchange']

# print("Hello, World!")
handler = TA_Handler(
    symbol="TSLA",
    screener="america",
    exchange="NASDAQ",
    interval=Interval.INTERVAL_1_MINUTE,
)

handler.add_indicators(["VWAP"])

result = {
    "vwap": handler.get_analysis().indicators["VWAP"],
    "ema200": handler.get_analysis().indicators["EMA200"],
    "ema10": handler.get_analysis().indicators["EMA10"]
}

# Get exchange of Apple Inc.
#print(handler.get_analysis().indicators["VWAP"])
print(json.dumps(result))
