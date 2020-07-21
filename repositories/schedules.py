import sys
sys.path.append("..")
import requests
import json
from models.schedule import Schedule

class SchedulesRepository:
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
        "sort": [{"relayId": "asc"}, {"startTime": "asc"}]
        }
        response = requests.post("{}/schedules/_find".format(self.baseUrl), data=json.dumps(selector), headers=headers).text
        entities=json.loads(response)["docs"]
        result = map(lambda e: Schedule(e["relayId"], e["startTime"], e["endTime"]), entities)
        return list(result)