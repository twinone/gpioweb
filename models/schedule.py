from entity import Entity

class Schedule(Entity):
    def __init__(self, relayId, startTime, endTime):
        self.relayId = relayId
        self.startTime = startTime
        self.endTime = endTime