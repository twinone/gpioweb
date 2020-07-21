import sys
sys.path.append("..")
import requests
import json
from models.relay import Relay

class RelaysRepository:
    def __init__(self, baseUrl):
        self.baseUrl = baseUrl

    def all(self):
        headers = {"Content-type": "application/json", "Accept": "text/plain"}

        selector = {
        "selector": {
            "_id": {
                "$gt": ""
            }
        },
        "sort": [{"gpio": "asc"}]
        }
        response = requests.post("{}/relays/_find".format(self.baseUrl), data=json.dumps(selector), headers=headers)
        relaysJson = response.text
        relays=json.loads(relaysJson)["docs"]
        result = map(lambda r: Relay(r["gpio"], r["text"]), relays)
        return list(result)