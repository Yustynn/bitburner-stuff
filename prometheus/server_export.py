import os
import json
from prometheus_client import start_http_server, Gauge
from time import sleep
from random import random
import traceback

PORT = 8923
INPUT_FILEPATH = "data.json"
TIMEOUT = 0.5

# Create a metric to track time spent and requests made.
host_info = Gauge("host_info", "Description of Guage", labelnames=["host", "metric"])
player_info = Gauge("player_info", "Description of Guage", labelnames=["category", "metric"])
stocks_info = Gauge("stocks_info", "Description of Guage", labelnames=["symbol", "value"])

# Decorate function with metric.
def process_request():
    if os.path.exists(INPUT_FILEPATH):
        try:
            with open(INPUT_FILEPATH) as f:
                data = json.load(f)
                for host, metrics in data['hostInfo'].items():
                    for metric, value in metrics.items():
                        host_info.labels(host, metric).set(value)

                for category, metrics in data['playerInfo'].items():
                    for metric, value in metrics.items():
                        player_info.labels(category, metric).set(value)

                for symbol, info in data['stocksPositionInfo'].items():
                    for value_name, value in info.items():
                        stocks_info.labels(symbol, value_name).set(value)

                print(f"Data processed successfully. Random number: {random()} | Net worth: {data['playerInfo']['money']['netWorth']} | Num Hosts: {len(data['hostInfo'])}")
        except:
            print("Error processing data")
            traceback.print_exc()
        finally:
            os.remove(INPUT_FILEPATH)
    sleep(0.5)

if __name__ == '__main__':
    # Start up the server to expose the metrics.
    start_http_server(PORT)
    print(f"Started server on port {PORT}")

    while True:
        process_request()
