#!/usr/bin/env python3
import RPi.GPIO as GPIO
from app import app, socketio
from routing import DEVS

def setupGPIO():
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BOARD)
	for dev in DEVS:
		GPIO.setup(dev['GPIO'], GPIO.IN)

if __name__ == '__main__':
	setupGPIO()
	socketio.run(app, port=5000, host='0.0.0.0')