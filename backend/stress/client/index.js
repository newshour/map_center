/*jshint evil:true */
var fs = require("fs");
var io = require("socket.io-client");
var optimist = require("optimist");

var argParser = optimist
    .usage("Usage: $0 -c [num]")
    .describe("c", "Number of clients to spawn")
    .alias("c", "clients")
    .default("c", 1000)
    .describe("o", "Output file")
    .alias("o", "output")
    .describe("h", "Display this message")
    .boolean("h")
    .alias("h", "help")
    .describe("v", "Periodically print connection status")
    .boolean("v")
    .alias("v", "verbose")
    .check(function(args) {
        if (typeof args.c !== "number") {
            throw "c must be a number";
        }
    });
var argv = argParser.argv;

var clientCount = argv.c;
var idx;
var connection;
var timeStamps = [];
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

if (argv.h) {
    optimist.showHelp();
    process.exit();
}

if (argv.o) {
    // Clear the results file if it exists
    try {
        fs.writeFileSync(argv.o, "");
    } catch(err) {
        console.error("Unable to open output file at '" + argv.o + "'");
        console.error(err.toString());
        process.exit();
    }
}

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
    updateMap: function() {

        timeStamps.push(new Date().getTime());

        if (timeStamps.length === counters.connected) {
            handlers.lastReceived();
        }
    },
    // Not a socket event, but triggered when all currently-connected clients
    // have received the "updateMap" message
    lastReceived: function() {
        var message;
        var first = timeStamps.shift();
        var offsets = timeStamps.map(function(timeStamp) {
            return timeStamp - first;
        });

        // Calculate statistics
        var stats = {
            clientCount: timeStamps.length + 1,
            timeSpan: timeStamps[timeStamps.length-1] - first,
            timeStamp: new Date().getTime()
        };
        stats.avg = offsets.reduce(function(prev, curr) {
                return prev + curr;
            }) / offsets.length;
        stats.stdDev = Math.pow(
            offsets.reduce(function(prev, curr) {
                return prev + Math.pow(curr - stats.avg, 2);
            }) / offsets.length, 0.5);

        if (argv.o) {
            fs.appendFile(argv.o, JSON.stringify(stats));
        }

        if (argv.v) {
            console.log("All connected clients received message.\n" +
                "  # Clients:\t" + stats.clientCount + "\n" +
                "  Time Span:\t" + stats.timeSpan + "ms\n" +
                "  Avgerage:\t" + stats.avg + "ms\n" +
                "  Std dev:\t" + stats.stdDev + "ms\n");
        }

        timeStamps.length = 0;
    }
};


for (idx = 0; idx < clientCount; ++idx) {
    connection = new this.liveMap.Connection();
    connection.connect();
    connection.on("connect", handlers.connect.bind(connection));
    connection.on("disconnect", handlers.disconnect.bind(connection));
}

if (argv.v) {
    setInterval(function() {
        console.log("Connected: " + counters.connected);
        console.log("Received: " + timeStamps.length);
    }, 1000);
}
