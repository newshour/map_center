#! /bin/sh

# Values to configure the target system. Re-set these as necessary for your
# environment.
NODE_HOST=127.0.0.1
NODE_PORT=8000
NODE_USER=noder
PROJECT_REPO=https://github.com/newshour/map_center.git

NODE_HOME=/home/$NODE_USER
PROJECT_DIR=$NODE_HOME/map_center

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

mv ~/import/startup.sh $NODE_HOME
chown $NODER_USER:users $NODE_HOME/startup.sh

# Add ssh keys
cd ~
mkdir .ssh
chmod 700 .ssh
cd .ssh
touch authorized_keys
cat ~/import/public-keys/*.pub >> authorized_keys

su $NODE_USER
cd ~

# Set environmental variables in a source-able file
touch ~/env-vars.sh
echo "#! /bin/sh

export NODE_HOST=$NODE_HOST
export NODE_PORT=$NODE_PORT
export PROJECT_DIR=$PROJECT_DIR
export PATH=\$PATH:/opt/joyent/node/bin
" > ~/env-vars.sh

# Install Node.js as the Node.js user
mkdir builds
cd builds
wget http://nodejs.org/dist/v0.8.8/node-v0.8.8.tar.gz
tar -zxvf node-v0.8.8.tar.gz
cd node-v0.8.8
./configure --prefix=/opt/joyent/node-0.8
make
make install
source ~/.bashrc

# Clone and configure project repository
cd ~
git clone $PROJECT_REPO $PROJECT_DIR
cd $PROJECT_DIR
git remote add bocoup https://github.com/bocoup/map_center.git
npm install -g grunt
npm install

# Return to root user
exit

# Copy OAuth credentials into place
cp ~/import/oauth/*.json $PROJECT_DIR/backend/credentials/oauth

# Copy the MapCenter service script (responsible for pulling, building, and
# running the project) into place, and make system aware of it so the script
# will be run at startup
cp ~/import/mapcenter-runner ~
chmod 755 ~/mapcenter-runner
ln -s ~/mapcenter-runner /etc/init.d/mapcenter-runner
insserv -d mapcenter-runner

# Start the service!
~/mapcenter-runner start
