from config import Config
from repositories.relays import RelaysRepository
from repositories.schedules import SchedulesRepository

class Scheduler:
    def __init__(self, databaseUrl):
        self.databaseUrl = databaseUrl
        self.relays = RelaysRepository(databaseUrl).all()
        self.schedules = SchedulesRepository(databaseUrl).all()

scheduler = Scheduler(Config["databaseUrl"])