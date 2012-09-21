#! /bin/sh

# Values to configure the target system. Re-set these as necessary for your
# environment.
NODE_HOST=127.0.0.1
NODE_PORT=8000
NODE_USER=noder

# setup.sh
chmod 700 /root

# Include Debian testing repository in list of available packages
echo "APT::Default-Release \"stable\";" >> /etc/apt/apt.conf
echo "deb http://ftp.us.debian.org/debian/ testing main" >> /ect/apt/sources.lst
echo "deb-src http://ftp.us.debian.org/debian/ testing main" >> /etc/apt/sources.lst

apt-get update

apt-get install git

# Install Redis from Debian testing repository
apt-get install -t testing install redis-server

# Install packages necessary to build Node.js
apt-get install python build-essential pkg-config libssl-dev

# Create a user to run the Node.js server
adduser $NODE_USER

# Create a build directory for Node.js
mkdir -p /opt/joyent/node-0.8
ln -s /opt/joyent/node-0.8/ /opt/joyent/node
chown $NODE_USER:users /opt/joyent/node-0.8

# Add ssh keys
cd ~
mkdir .ssh
chmod 700 .ssh
cd .ssh
touch authorized_keys2
cat ~/import/public-keys/*.pub >> authorized_keys2

# Set environmental variables in .bashrc, where they can be sourced at startup
echo "export NODE_HOST=$NODE_HOST" >> ~/.bashrc
echo "export NODE_PORT=$NODE_PORT" >> ~/.bashrc

# Install Node.js as the Node.js user
su $NODE_USER
cd ~
mkdir builds
cd builds
wget http://nodejs.org/dist/v0.8.8/node-v0.8.8.tar.gz
tar -zxvf node-v0.8.8.tar.gz
cd node-v0.8.8
./configure --prefix=/opt/joyent/node-0.8
make
make install
echo "export PATH=\$PATH:/opt/joyent/node/bin" >> ~/.bashrc
source ~/.bashrc

# Clone and configure project repository
cd ~
git clone https://github.com/newshour/map_center.git
cd map_center
git remote add bocoup https://github.com/bocoup/map_center.git
npm install -g grunt
npm install

# Copy OAuth credentials into place
cp ~/import/oauth/*.json backend/credentials/oauth

# Copy the MapCenter service script (responsible for pulling, building, and
# running the project) into place, and make Debian aware of it so it will run
# at startup
cp ~/import/mapcenter-runner ~
chmod 755 ~/mapcenter-runner
ln -s ~/mapcenter-runner /etc/init.d/mapcenter-runner
insserv -d mapcenter-runner

# Start the service!
~/mapcenter-runner start
