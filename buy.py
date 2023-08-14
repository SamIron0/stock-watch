from tradingview_ta import TA_Handler, Interval, Exchange
import sys

currentPrice = 12.75
entry = 12.50
gainPercent = entry * 0.05
lossPercent = entry * 0.025
sl = entry - (lossPercent)
tp = entry + (gainPercent)


# if sl is hit, sell stock
if currentPrice <= sl:
    print("Selling stock at " + currentPrice)

else:
    # print("Hello, World!")
    handler = TA_Handler(
        symbol="TSLA",
        screener="america",
        exchange="NASDAQ",
        interval=Interval.INTERVAL_1_DAY,
    )

    handler.add_indicators(["VWAP"])

    # print(handler.get_analysis().indicators["open"])
    print(handler.get_analysis().indicators["VWAP"])


# args_array = sys.argv[1:-1]  # Array arguments
ticker = sys.argv[-1]  # Last argument is ticker

#print("Array arguments:", args_array)
#print("Number argument:", number_arg)


# before buying, check first candle to break new high
# bonus if it breaks major resistance spot
# consider whole dollars as maor points
#
# check the high of previous candle

# If we've broken through the high, keep going else loop back

# use a trailing sl, so if price goes up 5%, move stop loss up 5%
