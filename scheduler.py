import threading
import time
import datetime
import json

from config import Config
from repositories.relays import RelaysRepository
from repositories.schedules import SchedulesRepository

from libraries import Logger

class Scheduler(threading.Thread):
    def __init__(self, databaseUrl):
        threading.Thread.__init__(self)
        self.logger = Logger()
        self.exitFlag = False
        self.databaseUrl = databaseUrl
        self.relays = []
        self.schedules = SchedulesRepository(databaseUrl).all()

    def addRelays(self, relays):
        self.relays = relays

    def setOnRelayChange(self, func):
        self.callback = func

    def schedule(self):
        self.logger.debug('Scheduler started')
        while not self.exitFlag:
            try:
                self.setRelays()
            except Error as err:
                logger.error('SetRelays Exception: {}'.format(err))
            finally:
                time.sleep(1)

    def run(self):
        self.schedule()

    def stop():
        self.exitFlag = True

    def setRelays(self):
        self.schedules = SchedulesRepository(self.databaseUrl).all()
        now = datetime.datetime.now().time()

        for relay in self.relays:

            if not self.isRelayScheduled(relay) or relay.manual:
                continue
            
            if self.isRelayActive(relay):
                if relay.status == 'off':
                    relay.turnOn()
                    self.logger.info('SCHEDULER | Relay {} changed to on'.format(relay.gpio))
                    self.callback(relay)
            else:
                if relay.status == 'on':
                    relay.turnOff()
                    self.logger.info('SCHEDULER | Relay {} changed to off'.format(relay.gpio))
                    self.callback(relay)

    def isRelayActive(self, relay):
        for schedule in self.schedules:
            if schedule.relayGpio == relay.gpio and not relay.manual:
                if schedule.isActive():
                    return True
        return False

    def isRelayScheduled(self, relay):
        for schedule in self.schedules:
            if relay.gpio == schedule.relayGpio:
                return True

        return False

scheduler = Scheduler(Config["databaseUrl"])