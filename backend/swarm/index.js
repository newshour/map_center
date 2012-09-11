var fs = require("fs");
var io = require("socket.io-client");
var optimist = require("optimist");

var argParser = optimist
    .usage("Usage: $0 -c [num]")
    .describe("c", "Number of clients to spawn")
    .alias("c", "clients")
    .default("c", 1000)
    .describe("h", "Display this message")
    .boolean("h")
    .alias("h", "help")
    .check(function(args) {
        if (typeof args.c !== "number") {
            throw "c must be a number";
        }
    });
var argv = argParser.argv;

var clientCount = argv.c;
var idx;
var connections = [];
var connection;
var timeStamps = {
    firstMsg: 0,
    lastMsg: 0
};
var counters = {
    connected: 0,
    msgReceived: 0
};

// Hack to get client code running on server (evaluate that code in the global
// scope, making sure that the required Socket.io client library is available)
var clientFilePath = __dirname + "/../../shared/livemap_connection.js";
this.io = io;
eval(fs.readFileSync(clientFilePath).toString());

if (argv.h) {
    optimist.showHelp();
    process.exit();
}

console.log("Spawning " + clientCount + " clients...");

var handlers = {
    connect: function() {
        counters.connected++;
    },
    disconnect: function() {
        counters.connected--;
    },
    updateMap: function() {

        counters.msgReceived++;

        if (counters.msgReceived === 1) {
            handlers.firstReceived();
        }

        if (counters.msgReceived === counters.connected) {
            handlers.lastReceived();
        }
    },
    firstReceived: function() {
        timeStamps.firstMsg = new Date().getTime();
    },
    // Not a socket event, but triggered when all currently-connected clients
    // have received the "updateMap" message
    lastReceived: function() {
        var message;
        timeStamps.lastMsg = new Date().getTime();

        // Report the time span over which clients received the message.
        // TODO: Send this message via an HTTP POST request to some endpoint,
        // possibly defined via the command line.
        message = counters.msgReceived +
            " connected clients received message over the course of " +
            (timeStamps.lastMsg - timeStamps.firstMsg) + "ms";
        console.log(message);

        counters.msgReceived = 0;
    }
};


for (idx = 0; idx < clientCount; ++idx) {
    connection = new this.liveMap.Connection();
    connection.connect();
    connection.on("connect", handlers.connect);
    connection.on("disconnect", handlers.disconnect);
    connections.push(connection);
}

// Delay to ensure that all clients have connected and received the latest
// cached message (if any) before monitoring messages
setTimeout(function() {
    for (idx = 0; idx < clientCount; ++idx) {
        connections[idx].on("updateMap", handlers.updateMap);
    }
}, 4000);

setInterval(function() {
    console.log("Connected: " + counters.connected);
    console.log("Received: " + counters.msgReceived);
}, 1000);
