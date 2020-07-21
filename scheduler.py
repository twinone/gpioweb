import threading
import time
import datetime
import json

from config import Config
from repositories.relays import RelaysRepository
from repositories.schedules import SchedulesRepository

from libraries.datetimeutils import stringToTime

class Scheduler(threading.Thread):
    def __init__(self, databaseUrl):
        threading.Thread.__init__(self)
        self.exitFlag = False
        self.databaseUrl = databaseUrl
        self.relays = []
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
                    if stringToTime(schedule.startTime) < now and stringToTime(schedule.endTime) > now:
                        relay.turnOn()
                    else:
                        relay.turnOff()

scheduler = Scheduler(Config["databaseUrl"])