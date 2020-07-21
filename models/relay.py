from entity import Entity

class Relay(Entity):
    def __init__(self, gpio, title):
        self.gpio = gpio
        self.title = title
        self.status = 'off'
