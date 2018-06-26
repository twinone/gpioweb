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
sudo git clone https://github.com/twinone/gpioweb /usr/local/gpioweb
# Create a systemd script to auto start the service
sudo ln -s /usr/local/gpioweb/gpioweb.service /etc/systemd/system/
# Start the service
sudo service gpioweb start
```
