import threading
import time
import datetime
import json

from config import Config
from repositories.relays import RelaysRepository
from repositories.schedules import SchedulesRepository

class Scheduler(threading.Thread):
    def __init__(self, databaseUrl):
        threading.Thread.__init__(self)
        self.exitFlag = False
        self.databaseUrl = databaseUrl
        self.relays = []
        #self.relays = RelaysRepository(databaseUrl).all()
        self.schedules = SchedulesRepository(databaseUrl).all()

    def addRelays(self, relays):
        self.relays = relays

    def schedule(self):
        while not self.exitFlag:
            self.setRelays()
            time.sleep(1)

    def run(self):
        self.schedule()

    def stop():
        self.exitFlag = True

    def setRelays(self):
        self.schedules = SchedulesRepository(self.databaseUrl).all()
        now = datetime.datetime.now().time()
        for schedule in self.schedules:
            for relay in self.relays:
                if schedule.relayGpio == relay.gpio:
                    if self.stringToTime(schedule.startTime) < now and self.stringToTime(schedule.endTime) > now:
                        relay.turnOn()
                    else:
                        relay.turnOff()

    def stringToTime(self, timeString):
        elements = timeString.split(':')
        hour = elements[0]
        if len(elements) > 0:
            hour = int(elements[0])
            if len(elements) > 1:
                min = int(elements[1])
                if len(elements) > 2:
                    sec = int(elements[2])
                else:
                    sec = 0
            else:
                min = 0
                sec = 0
        else:
            hour = 0
            min = 0
            sec = 0
        
        return datetime.time(hour, min, sec)

scheduler = Scheduler(Config["databaseUrl"])