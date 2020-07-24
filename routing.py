import json
import threading
import RPi.GPIO as GPIO
from flask import jsonify, redirect
from config import Config
from models.relay import Relay

from repositories.relays import RelaysRepository
from repositories.schedules import SchedulesRepository

import libraries

from scheduler import scheduler

from app import app, socketio

relaysRepository = RelaysRepository(Config["databaseUrl"])
Relays = relaysRepository.all()

def sendRelays():
	socketio.emit('relay_changed', json.dumps([relay.toDict() for relay in Relays]), callback=messageReceived)

def notifyRelayChangedByScheduler(relay):
	print('relay changed by schduler')
	print(json.dumps(relay.toDict()))
	#thr = threading.Thread(target=sendRelays, args=(), kwargs={})
	#thr.start()
	#thr.join()

scheduler.addRelays(Relays)
scheduler.setOnRelayChange(notifyRelayChangedByScheduler)
scheduler.start()

DEVS = []
for gpio in libraries.constants.GPIOS:
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
	if mode not in libraries.constants.PIN_MODES.keys() or pin not in GPIOS:
		return abort(400)
	GPIO.setup(pin, libraries.constants.PIN_MODES[mode])
	for dev in DEVS:
		if dev.gpio == pin:
			dev["direction"] = libraries.constants.PIN_MODES[mode]
			dev["value"] = GPIO.input(dev.gpio)

	return jsonify({'status':'ok'})


@app.route('/out/<int:pin>/<value>')
def handle_output(pin, value):
	value = value.lower()
	if value not in libraries.constants.DIGITAL_VALUES.keys():
		return app.response_class(response=json.dumps({'status':'fail', 'reason':'invalid pin specified (' + pin + ')'}), status=400, mimetype='application/json')

	if not is_pin_valid(pin):
		return jsonify({'status':'fail', 'reason': 'invalid pin specified (' + pin + ')'}), 400

	GPIO.setup(pin, GPIO.OUT)
	GPIO.output(pin, libraries.constants.DIGITAL_VALUES[value])
	for dev in DEVS:
		if dev.gpio == pin:
			dev["direction"] = GPIO.OUT
			dev["value"] = libraries.constants.DIGITAL_VALUES[value]

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
	if value not in libraries.constants.RELAY_VALUES.keys():
 		return abort(400)

	if not is_relay_valid(pin):
		return jsonify({'status':'fail', 'reason': 'invalid pin specified (' + pin + ')'}), 400
	
	if value == 'on':
		GPIO.setup(pin, GPIO.OUT)
		GPIO.output(pin, GPIO.LOW)
	elif value == 'off':
		GPIO.setup(pin, GPIO.IN)

	for relay in Relays:
		if relay.gpio == pin:
			if value == 'auto':
				relay.manual = False
			else:
				relay.manual = True
				relay.status = value

			sendRelays()

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
			sendRelays()
