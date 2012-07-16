var portNumber = 8000;
var express = require("express");
var app = express.createServer();
var io = require("socket.io").listen(app);
var fs = require("fs");
var url = require("url");
var _ = require("underscore");
// Reference to the most recent state of the map. Used to bring new clients up
// to speed before a new state is pushed
var currentMapState;
var scheduleFile = {
    handle: "backend/schedule.json"
};
// Global array containing all known broadcast events
var broadcastEvents;

function serveStaticFile(req, res) {
    var resourceName = url.parse(req.url).path;

    if (resourceName === "/") {
        resourceName = "/index.html";
    }

    fs.readFile(__dirname + "/www" + resourceName,
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading '" + resourceName + "'.");
            }

            res.writeHead(200);
            res.end(data);
        });
}

function generateRecordingFileName() {
    return "backend/recordings/" + Number(new Date()) + ".txt";
}

// Write the given map state to a file
function logMapState(fd, mapState) {
    fs.write(fd, JSON.stringify({
        timeStamp: +new Date(),
        mapState: mapState
    }) + "\n");
}

// ----------------------------------------------------------------------------
// --[ setup for scheduling control ]

try {
    scheduleFile.stats = fs.lstatSync(scheduleFile.handle);
} catch(err) {
    // File does not exist. Create an empty collection in memory
    broadcastEvents = [];
}

if (scheduleFile.stats && scheduleFile.stats.isFile()) {
    broadcastEvents = JSON.parse(fs.readFileSync(scheduleFile.handle));
}

var latestEvent = _.chain(broadcastEvents)
    .sortBy(function(event) { return event.id; })
    .last().value();
var eventCounter = 0;
if (latestEvent) {
    eventCounter = parseInt(latestEvent.id, 10);
}

// ----------------------------------------------------------------------------
// --[ scheduling control HTTP endpoints ]

app.use(express.bodyParser());
app.get("/", serveStaticFile);
app.get("/index.html", serveStaticFile);
app.get("/static/*", serveStaticFile);

app.param("eventId", function(req, res, next) {
    var broadcastEvent = _.find(broadcastEvents, function(broadcastEvent) {
        return broadcastEvent.id === req.params.eventId;
    });
    console.log(broadcastEvent, broadcastEvents);
    if (!broadcastEvent) {
        return next(new Error("failed to find broadcast event"));
    }
    req.broadcastEvent = broadcastEvent;
    next();
});
app.get("/broadcastevent/:eventId?", function(req, res) {

    if (req.broadcastEvent) {
        res.json(req.broadcastEvent);
    } else {
        res.json( broadcastEvents );
    }
});
app.post("/broadcastevent", function(req, res) {
    var newEvent = {
        id: ++eventCounter + "",
        name: req.body.name
    };
    broadcastEvents.push(newEvent);
    res.json(newEvent);
});
app.put("/broadcastevent/:eventId", function(req, res) {
    broadcastEvents.push({
        id: ++eventCounter + ""
    });
});
app.del("/broadcastevent/:eventId", function(req, res) {

    var idx;

    if (req.broadcastEvent) {

        idx = _.indexOf(broadcastEvents, req.broadcastEvent);

        broadcastEvents.splice(idx, 1);
        res.statusCode = 200;
    } else {
        res.statusCode = 404;
    }

    res.end();
});

app.listen(portNumber);

// ----------------------------------------------------------------------------
// --[ distributed map synchronization ]

io.sockets.on("connection", function (socket) {
    // If a client connects after the map's state has been changed at least
    // once, immediately send that state to the client
    if (currentMapState) {
        socket.emit("changeVotes", currentMapState);
    }

    socket.on("changeVotes", function (data) {
        currentMapState = data;
        io.sockets.emit("changeVotes", data);
    });
});
