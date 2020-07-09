# gpioweb
Expose your Raspberry Pi's GPIO as a REST service. Auto-starts at boot.

# Requirements
```
sudo apt-get install python3-pip
pip3 install RPi.GPIO
pip3 install Flask
```

# Installation
```
sudo git clone https://github.com/marians20/gpioweb.git /usr/local/gpioweb
# Create a systemd script to auto start the service
sudo ln -s /usr/local/gpioweb/gpioweb.service /etc/systemd/system/
# Auto-start at boot
sudo systemctl enable gpioweb
# Actually start the service
sudo systemctl start gpioweb
```


# Usage

Visit http://raspberrypi.local:5000/ to see the example running
