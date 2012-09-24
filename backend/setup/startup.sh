#! /bin/bash

# Ensure that environmental variables NODE_HOST and NODE_PATH are set as
# intended
source ~/env-vars.sh
cd $PROJECT_DIR

# Retrieve the latest version of the project source
git pull origin master
# Fetch new dependencies, if any
npm install
# Build the project
grunt

cd backend
node server.js
