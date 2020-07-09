#!/usr/bin/env python3

import RPi.GPIO as GPIO
from flask import Flask, jsonify, abort, send_from_directory, redirect
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

GPIOS = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,29,31,32,33,35,36,37,38,40]

DEVS = []

for gpio in GPIOS:
	DEVS.append({'GPIO': gpio, 'direction':GPIO.OUT, 'value':GPIO.LOW})


PIN_MODES = {
	"out": GPIO.OUT,
	"in": GPIO.IN,
}

DIGITAL_VALUES = {
	"high": GPIO.HIGH,
	"low": GPIO.LOW,
}

RELAY_VALUES = {
	"on": GPIO.HIGH,
	"off": GPIO.LOW,
}

def is_pin_valid(pin):
	for dev in DEVS:
		if dev["GPIO"] == pin:
			return True

	return False

@app.route('/')
def index():
    return redirect("/static/index.html", code=302)

@app.route('/status')
def handle_status():
	for dev in DEVS:
		dev["value"] = GPIO.input(dev["GPIO"])

	return jsonify({'status':'ok','devs':DEVS})

@app.route('/setup/<int:pin>/<mode>')
def handle_setup(pin, mode):
	mode = mode.lower()
	if mode not in PIN_MODES.keys() or pin not in GPIOS:
		return abort(400)
	GPIO.setup(pin, PIN_MODES[mode])
	for dev in DEVS:
		if dev["GPIO"] == pin:
			dev["direction"] = PIN_MODES[mode]

		dev["value"] = GPIO.input(dev["GPIO"])

	return jsonify({'status':'ok','devs':DEVS})


@app.route('/out/<int:pin>/<value>')
def handle_output(pin, value):
	value = value.lower()
	if value not in DIGITAL_VALUES.keys():
		return app.response_class(response=json.dumps({'status':'fail', 'reason':'invalid pin specified (' + pin + ')'}), status=400, mimetype='application/json')

	if not is_pin_valid(pin):
		return jsonify({'status':'fail', 'reason': 'invalid pin specified (' + pin + ')'}), 400

	GPIO.setup(pin, GPIO.OUT)
	GPIO.output(pin, DIGITAL_VALUES[value])
	for dev in DEVS:
		if dev["GPIO"] == pin:
			dev["direction"] = GPIO.OUT
			dev["value"] = DIGITAL_VALUES[value]

		dev["value"] = GPIO.input(dev["GPIO"])

	return jsonify({'status':'ok', 'devs':DEVS}), 200

@app.route('/relay/<int:pin>/<value>')
def handle_rely(pin, value):
	value = value.lower()
	if value not in RELAY_VALUES.keys():
 		return abort(400)

	if not is_pin_valid(pin):
		return jsonify({'status':'fail', 'reason': 'invalid pin specified (' + pin + ')'}), 400
	if value == 'on':
		GPIO.setup(pin, GPIO.OUT)
		GPIO.setup(pin, GPIO.LOW)
	else:
		GPIO.setup(pin, GPIO.IN)

	for dev in DEVS:
		if dev["GPIO"] == pin:
			if value == 'on':
				dev["direction"] = GPIO.OUT
				dev["value"] = GPIO.LOW
			else:
				dev["direction"] = GPIO.IN

		dev["value"] = GPIO.input(dev["GPIO"])

	return jsonify({'status':'ok', 'devs':DEVS}), 200

@app.route('/static/<path:path>')
def handle_static(path):
	send_from_directory('static', path)

def setupGPIO():
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BOARD)
	for dev in DEVS:
		GPIO.setup(dev["GPIO"], GPIO.IN)



if __name__ == '__main__':
	setupGPIO()
	app.run(debug=True, host='0.0.0.0')
