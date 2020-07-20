import requests
import json

def getRelaysFromCouchDb(baseUrl):
    headers = {"Content-type": "application/json", "Accept": "text/plain"}

    selector = {
    "selector": {
        "_id": {
            "$gt": ""
        }
    },
    "sort": [{"gpio": "asc"}]
    }
    response = requests.post("{}/relays/_find".format(baseUrl), data=json.dumps(selector), headers=headers)
    relaysJson = response.text
    relays=json.loads(relaysJson)["docs"]
    result = map(lambda r: {"GPIO": r["gpio"], "text": r["text"], "status": "off"}, relays)
    return list(result)

print(getRelaysFromCouchDb("http://192.168.1.4:5984"))