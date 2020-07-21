#!/usr/bin/env python3

import threading
import requests
import json
import RPi.GPIO as GPIO
from flask import Flask, jsonify, abort, send_from_directory, redirect
from flask_cors import CORS
from flask_socketio import SocketIO
from config import Config
from models.relay import Relay

from repositories.relays import RelaysRepository
from repositories.schedules import SchedulesRepository

from scheduler import scheduler

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

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

GPIOS = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,29,31,32,33,35,36,37,38,40]

# Relays = [
# 	{'title': 'Lights 1', 'GPIO': 36, 'status':'off'},
# 	{'title': 'Lights 2', 'GPIO': 38, 'status':'off'},
# 	{'title': 'Heat', 'GPIO': 40, 'status':'off'}
# ]

relaysRepository = RelaysRepository(Config["databaseUrl"])
Relays = relaysRepository.all()

scheduler.addRelays(Relays)
scheduler.start()

DEVS = []
for gpio in GPIOS:
	DEVS.append({'title': gpio, 'GPIO': gpio, 'direction':GPIO.OUT, 'value':GPIO.LOW})

def is_pin_valid(pin):
	for dev in DEVS:
		if dev.gpio == pin:
			return True

	return False

def is_relay_valid(pin):
	for relay in Relays:
		if relay.gpio == pin:
			return True

	return False

@app.route('/')
def index():
    return redirect("/static/index.html", code=302)

@app.route('/status')
def handle_status():
	for dev in DEVS:
		dev["value"] = GPIO.input(dev.gpio)

	return jsonify({'status':'ok','devs':DEVS})

@app.route('/setup/<int:pin>/<mode>')
def handle_setup(pin, mode):
	mode = mode.lower()
	if mode not in PIN_MODES.keys() or pin not in GPIOS:
		return abort(400)
	GPIO.setup(pin, PIN_MODES[mode])
	for dev in DEVS:
		if dev.gpio == pin:
			dev["direction"] = PIN_MODES[mode]
			dev["value"] = GPIO.input(dev.gpio)

	return jsonify({'status':'ok'})


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
		if dev.gpio == pin:
			dev["direction"] = GPIO.OUT
			dev["value"] = DIGITAL_VALUES[value]

	return jsonify({'status':'ok'}), 200

@app.route('/relay')
def handle_get_relays_statuses():
	return jsonify([relay.toDict() for relay in Relays]), 200

@app.route('/relay/<int:pin>', methods=['GET'])
def handle_get_relay_status():
	if not is_relay_valid(pin):
		return jsonify({'status':'fail', 'reason': 'invalid pin specified (' + pin + ')'}), 400
	
	for relay in Relays:
		if relay.gpio == pin:
			return jsonify(relay)
	
	return jsonify({'status':'fail', 'reason': 'invalid pin specified (' + pin + ')'}), 400

@app.route('/relay/<int:pin>/<value>', methods=['POST'])
def handle_set_relay(pin, value):
	value = value.lower()
	if value not in RELAY_VALUES.keys():
 		return abort(400)

	if not is_relay_valid(pin):
		return jsonify({'status':'fail', 'reason': 'invalid pin specified (' + pin + ')'}), 400
	
	if value == 'on':
		GPIO.setup(pin, GPIO.OUT)
		GPIO.output(pin, GPIO.LOW)
	else:
		GPIO.setup(pin, GPIO.IN)

	for relay in Relays:
		if relay.gpio == pin:
			relay.status = value
			socketio.emit('relay_changed', json.dumps([relay.toDict() for relay in Relays]), callback=messageReceived)

	return jsonify({'status':'ok'}), 200

@app.route('/static/<path:path>', methods=['GET'])
def handle_static(path):
	send_from_directory('static', path)

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('relay_changed')
def handle_my_custom_event(relay, methods=['GET', 'POST']):
	print('###### received relay_changed: ' + str(relay))
	if relay.status == 'on':
		GPIO.setup(relay.gpio, GPIO.OUT)
		GPIO.output(relay.gpio, GPIO.LOW)
	else:
		GPIO.setup(relay.gpio, GPIO.IN)

	for r in Relays:
		if r.gpio == relay.gpio:
			r.status = relay.status
			socketio.emit('relay_changed', json.dumps([relay.toDict() for relay in Relays]), callback=messageReceived)

def setupGPIO():
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BOARD)
	for dev in DEVS:
		GPIO.setup(dev['GPIO'], GPIO.IN)

def runApp():
	app.run(debug=True, host='0.0.0.0')

if __name__ == '__main__':
	setupGPIO()
	socketio.run(app, port=5000, host='0.0.0.0')
