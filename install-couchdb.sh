# update packages & OS
cd
sudo apt-get update
sudo apt-get upgrade

# You can check the OS version
cat /etc/os-release 

# add Erlang Solutions repository and public key
wget http://packages.erlang-solutions.com/debian/erlang_solutions.asc
sudo apt-key add erlang_solutions.asc
sudo apt-get update

# install all build dependencies - note mutiple lines
sudo apt-get --no-install-recommends -y install \
build-essential pkg-config erlang libicu-dev \
libmozjs185-dev libcurl4-openssl-dev

#add couchdb user and home
sudo useradd -d /home/couchdb couchdb
sudo mkdir /home/couchdb
sudo chown couchdb:couchdb /home/couchdb

# Get source - need URL for mirror (see post instructions, above)
wget http://apache.cs.utah.edu/couchdb/source/2.3.1/apache-couchdb-2.3.1.tar.gz

# extract source and enter source directory
tar zxvf apache-couchdb-2.3.1.tar.gz 
cd apache-couchdb-2.3.1/

# configure build and make executable(s)
./configure
make release

#copy built release to couchdb user home directory
cd ./rel/couchdb/
sudo cp -Rp * /home/couchdb
sudo chown -R couchdb:couchdb /home/couchdb
cd /home/couchdb/etc

# need to edit IP address to allow external access
# Change this line:
#  #bind_address = 127.0.0.1
# to:
# bind_address = 0.0.0.0
sudo nano local.ini

sudo cp /usr/local/gpioweb/couchdb.service /home/couchdb/
sudo ln -s /home/couchdb/couchdb.service /etc/systemd/system/
# Auto-start at boot
sudo systemctl enable couchdb
# Actually start the service
sudo systemctl start couchdb
