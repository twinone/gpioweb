import sys
sys.path.append("..")
import requests
import json
from models.relay import Relay

class RelaysRepository:
    def __init__(self, baseUrl):
        self.baseUrl = baseUrl

    def create(self, relay):
        url = "{}/relays".format(self.baseUrl)
        headers = {"Content-type": "application/json", "Accept": "text/plain"}
        newRelay = {
            gpio: relay["gpio"],
            text: relay["text"]
            }

        return requests.post(url, data=newRelay, headers=headers)

    def update(self, relay):
        url = "{}/relays".format(self.baseUrl)
        headers = {"Content-type": "application/json", "Accept": "text/plain"}
        newRelay = {
            _id: relay["_id"],
            _rev: relay["_rev"],
            gpio: relay["gpio"],
            text: relay["text"]
            }

        return requests.put(url, data=newRelay, headers=headers)

    def delete(self, relayId, rev):
        url = "{}/relays/{}?rev={}".format(self.baseUrl, relayId, rev)
        headers = {"Content-type": "application/json", "Accept": "text/plain"}
        return requests.delete(url, headers=headers)

    def all(self):
        url = "{}/relays/_find".format(self.baseUrl)
        headers = {"Content-type": "application/json", "Accept": "text/plain"}

        selector = {
        "selector": {
            "_id": {
                "$gt": ""
            }
        },
        "sort": [{"gpio": "asc"}]
        }
        
        response = requests.post(url, data=json.dumps(selector), headers=headers)
        relaysJson = response.text
        relays=json.loads(relaysJson)["docs"]
        result = map(lambda r: Relay(r["gpio"], r["text"]), relays)
        return list(result)