import couchdb
import time
import datetime
import json
from config import Config

class Logger:
    def __init__(self):
        try:
            couch = couchdb.Server(self.getUrl())
            db = couch.create('logs')
        except:
            pass

    def getDb(self):
        couch = couchdb.Server(self.getUrl())
        return couch['logs']

    def getUrl(self):
        return Config['databaseUrl']

    def log(self, message, level):
        document = {
            'Timestamp': datetime.datetime.now().isoformat(),
            'Level': level,
            'Message': message
        }
        self.getDb().save(document)

    def trace(self, message):
        self.log(message, 'TRACE')
        
    def debug(self, message):
        self.log(message, 'DEBUG')

    def info(self, message):
        self.log(message, 'INFO')

    def warn(self, message):
        self.log(message, 'WARN')

    def error(self, message):
        self.log(message, 'ERROR')

    def fatal(self, message):
        self.log(message, 'FATAL')