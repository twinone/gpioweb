import time
import datetime
from libraries.datetimeutils import stringToTime
from entity import Entity

class Schedule(Entity):
    def __init__(self, relayGpio, startTime, endTime):
        self.relayGpio = relayGpio
        self.startTime = startTime
        self.endTime = endTime

    def isActive(self):
        now = datetime.datetime.now().time()
        return stringToTime(self.startTime) <= now and stringToTime(self.endTime) > now