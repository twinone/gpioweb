import RPi.GPIO as GPIO

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
	"auto": 2
}

GPIOS = [3,5,7,8,10,11,12,13,15,16,18,19,21,22,23,24,26,29,31,32,33,35,36,37,38,40]
