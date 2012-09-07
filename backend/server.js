var http = require("http");
var express = require("express");

var app = express();
var BroadcastSchedule = require("./BroadcastSchedule");

// Server name and port. Reference environmental variables when they are set,
// and fall back to sensible defaults.
var serviceLocation = {
    portNumber: process.env.NODE_PORT || 8000,
    hostName: process.env.NODE_HOST || "127.0.0.1"
};

var httpServer = http.createServer(app);
var broadcastSchedule = new BroadcastSchedule();

var auth = require("./auth");
var broadcast = require("./broadcast");
var routes = require("./routes");

auth.initialize(serviceLocation);
broadcast.initialize(httpServer, broadcastSchedule);
routes.initialize(broadcastSchedule);

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.static(__dirname + "/www"));

    auth.attach(app);
    routes.attach(app);
});

httpServer.listen(serviceLocation.portNumber, serviceLocation.hostName);
