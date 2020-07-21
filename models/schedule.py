from entity import Entity

class Schedule(Entity):
    def __init__(self, relayGpio, startTime, endTime):
        self.relayGpio = relayGpio
        self.startTime = startTime
        self.endTime = endTime