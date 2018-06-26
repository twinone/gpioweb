#!/usr/bin/env python3

import RPi.GPIO as GPIO
from flask import Flask, jsonify, abort, send_from_directory

app = Flask(__name__)

GPIOS = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,29,31,32,33,35,36,37,38,40]
PIN_MODES = {
	"out": GPIO.OUT,
	"in": GPIO.IN,
}

DIGITAL_VALUES = {
	"high": GPIO.HIGH,
	"low": GPIO.LOW,
}

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/setup/<int:pin>/<mode>')
def handle_setup(pin, mode):
	mode = mode.lower()
	if mode not in PIN_MODES.keys() or pin not in GPIOS:
		return abort(400)
	GPIO.setup(pin, PIN_MODES[mode])
	return jsonify({'status':'ok'})


@app.route('/out/<int:pin>/<value>')
def handle_output(pin, value):
	value = value.lower()
	if value not in DIGITAL_VALUES.keys() or pin not in GPIOS:
		return abort(400)
	GPIO.setup(pin, GPIO.OUT)
	GPIO.output(pin, DIGITAL_VALUES[value])
	return jsonify({'status':'ok'})


@app.route('/static/<path:path>')
def handle_static(path):
	send_from_directory('static', path)

def setupGPIO():
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BOARD)
	GPIO.setup(11, GPIO.OUT)



if __name__ == '__main__':
	setupGPIO()
	app.run(debug=True, host='0.0.0.0')
