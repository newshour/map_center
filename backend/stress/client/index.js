/*jshint evil:true */
var express = require("express");
var fs = require("fs");
var io = require("socket.io-client");
var optimist = require("optimist");

var app = express();
var argParser = optimist
    .usage("Usage: $0 -c [num]")
    .describe("c", "Number of clients to spawn")
    .alias("c", "clients")
    .default("c", 1000)
    .describe("p", "Port to listen for commands")
    .alias("p", "port")
    .default("p", 9001)
    .describe("h", "Display this message")
    .boolean("h")
    .alias("h", "help")
    .describe("v", "Periodically print connection status")
    .boolean("v")
    .alias("v", "verbose")
    .describe("t", "Transport mechanism")
    .alias("t", "transport")
    .default("t", "websocket")
    .check(function(args) {
        if (typeof args.c !== "number") {
            throw "c must be a number";
        }
        if (typeof args.p !== "number") {
            throw "p must be a number";
        }
        if (!~["websocket", "xhr-polling"].indexOf(args.t)) {
            throw "unrecognized transport";
        }
    });
var argv = argParser.argv;

var clientCount = argv.c;
// The interval that clients send "heartbeat" messages to the server
var heartbeatInterval = 120*1000;
var idx;
var Connection;
var connection;
var trialDelays = {};
var counters = {
    connected: 0,
    msgReceived: 0
};

// Hack to get client code running on server (evaluate that code in the global
// scope, making sure that the required Socket.io client library is available)
var clientFilePath = __dirname + "/../../www/scripts/shared/livemap_connection.js";
var clientFileContents;
this.io = io;
try {
  clientFileContents = fs.readFileSync(clientFilePath).toString();
} catch(err) {
  console.error("Unable to open client connection file at '" + clientFilePath +
    "'. Please verify that the project has been built.");
  console.error(err.toString());
  process.exit();
}
eval(clientFileContents);

Connection = this.liveMap.Connection;

if (argv.h) {
    optimist.showHelp();
    process.exit();
}

app.listen(argv.p, "127.0.0.1");

app.get("/dump", function(req, res) {

    var attr;

    res.send(JSON.stringify(trialDelays));

    for (attr in trialDelays) {
        delete trialDelays[attr];
    }
});

if (argv.v) {
    console.log("Spawning " + clientCount + " clients...");
}

var handlers = {
    connect: function() {

        // Defer attaching the "updateMap" handler to ensure that all clients
        // have received the latest cached message (if any) before monitoring
        // future messages.
        if (!this.hasConnected) {
            this.hasConnected = true;

            setTimeout(function() {
                this.on("updateMap", handlers.updateMap);
            }.bind(this), 1000);
        }

        counters.connected++;
    },
    disconnect: function() {
        counters.connected--;
    },
    updateMap: function(msg) {

        var delays = trialDelays[msg.timeStamp];
        if (!delays) {
            delays = trialDelays[msg.timeStamp] = [];
        }

        delays.push(new Date().getTime() - msg.timeStamp);

        if (delays.length === counters.connected) {
            handlers.lastReceived(msg);
        }
    },
    // Not a socket event, but triggered when all currently-connected clients
    // have received the "updateMap" message
    lastReceived: function(msg) {

        var delays = trialDelays[msg.timeStamp];
        var avgDelay;

        if (argv.v) {
            avgDelay = delays
                .reduce(function(prev, current) {
                    return prev + current;
                }) / delays.length;

            console.log("Trial '" + msg.timeStamp + "' complete.\n" +
                "  # Clients:\t" + delays.length + "\n" +
                "  Avg. Delay:\t" + avgDelay + "ms\n");
        }

    }
};

for (idx = 0; idx < clientCount; ++idx) {

    // Disperse connections across the heartbeat interval in order to avoid
    // synchronizing client heartbeats
    setTimeout(function() {
        connection = new Connection();
        // WARNING
        // This method of forcing the socket's transport is undocumented and
        // may not function in future versions of Socket.io. It is necessary
        // because the server's supported transports will be given priority
        // over those declared by the client, so the supported method (i.e.
        // specifying the transports in the socket's construtor) will result in
        // clients using WebSockets regardless.
        connection._socket.transports = [argv.t];
        connection.connect();
        connection.on("connect", handlers.connect.bind(connection));
        connection.on("disconnect", handlers.disconnect.bind(connection));
    }, heartbeatInterval*(idx/clientCount));
}

if (argv.v) {
    setInterval(function() {
        console.log("Connected: " + counters.connected);
        console.log("Outstanding trials: " + Object.keys(trialDelays).length);
    }, 1000);
}
