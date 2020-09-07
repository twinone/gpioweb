import uuid
import RPi.GPIO as GPIO
from entity import Entity

class Relay(Entity):
    def __init__(self, gpio, title):
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BOARD)
        self._id = str(uuid.uuid4())
        self._rev = ''
        self.gpio = gpio
        self.title = title
        self.status = 'off'
        self.manual = False

    def turnOn(self):
        self.status = 'on'
        GPIO.setup(self.gpio, GPIO.OUT)
        GPIO.output(self.gpio, GPIO.LOW)

    def turnOff(self):
        GPIO.setup(self.gpio, GPIO.IN)
        self.status = 'off'

    def setAutomatic(self):
        self.manual = False
    
    def setManual(self):
        self.manual = True
