var fs = require("fs");
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var _ = require("underscore");

var BroadcastSchedule = require("./broadcastSchedule");

// Server name and port. Reference environmental variables when they are set,
// and fall back to sensible defaults.
var serviceLocation = {
    portNumber: process.env.NODE_PORT || 8000,
    hostName: process.env.NODE_HOST || "127.0.0.1"
};

// Credentials, stored in non-version-controlled files
var CREDS = {
    oauth: {
        twitter: require("./credentials/oauth/twitter.json"),
        google: require("./credentials/oauth/google.json")
    }
};

var broadcastSchedule = new BroadcastSchedule();

var auth = require("./auth");
var broadcast = require("./broadcast");
var routes = require("./routes");

// ----------------------------------------------------------------------------
// --[ scheduling control HTTP endpoints ]

auth.initialize(CREDS, serviceLocation);
broadcast.initialize(server, broadcastSchedule);
routes.initialize(broadcastSchedule);

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.static(__dirname + "/www"));

    auth.initializeApp(app);
    routes.attach(app);
});

server.listen(serviceLocation.portNumber, serviceLocation.hostName);
