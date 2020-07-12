export const RelayDirections = {
    IN: 0,
    OUT: 1
}

export const GPIOValues = {
    LOW: 0,
    HIGH: 1
}

export class RelayStatus {
    constructor(status, text, direction, value) {
        this.status = status;
        this.text = text;
        this.direction = direction;
        this.value = value;
    }
};

export const RelayStatuses = {
    ON: new RelayStatus('on', 'Turn off', RelayDirections.OUT, GPIOValues.LOW),
    OFF: new RelayStatus('off', 'Turn on', RelayDirections.IN, GPIOValues.ON)
};

export class Relay {
    constructor(GPIO, value, direction, title) {
        this.GPIO = GPIO;
        this.value = value;
        this.direction = direction;
        this.title = title;
    }

    getStatus() {
        if(this.direction === RelayDirections.IN && this.value === GPIOValues.LOW) {
            return RelayStatuses.ON;
        }

        if(this.direction === RelayDirections.OUT && this.value === GPIOValues.HIGH) {
            return RelayStatuses.OFF;
        }

        return this.direction === RelayDirections.IN ? RelayStatuses.OFF : RelayStatuses.ON;
    };

    turnOn() {
        console.log(`Turn ON: direction = ${RelayStatuses.ON.direction}, value = ${RelayStatuses.ON.value}`);
        this.direction = RelayStatuses.ON.direction;
        this.value = RelayStatuses.ON.value;
    }

    turnOff() {
        console.log(`Turn OFF: direction = ${RelayStatuses.OFF.direction}, value = ${RelayStatuses.OFF.value}`);
        this.direction = RelayStatuses.OFF.direction;
        this.value = RelayStatuses.OFF.value;
    }

    toggle() {
        console.log(`Toggle from ${this.getStatus().status}`);
        if(this.getStatus().status === RelayStatuses.ON.status) {
            this.turnOff();
        } else {
            this.turnOn();
        }
    }
};