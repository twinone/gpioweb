export class Relay {
    constructor(GPIO, title, status) {
        this.GPIO = GPIO;
        this.title = title;
        this.status = status;
    }

    turnOn() {
        this.status = 'on';
    }

    turnOff() {
        this.status = 'off';
    }

    toggle() {
        if(this.status === 'on') {
            this.turnOff();
        } else {
            this.turnOn();
        }
    }
};