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
var broadcastSchedule;

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

// Create a "deep" copy of the schedule that may be modified without effecting
// the in-memory instance (this version should not be updated until the
// schedule has successfully been stored in the persistence layer)
function copySchedule(schedule) {
    return _.map(schedule, function(event) {
        return _.clone(event);
    });
}

// Save the schedule to a persistence layer (in this case, a flat fire)
function saveSchedule(schedule, callback) {
    fs.writeFile(scheduleFile.handle, JSON.stringify(schedule), function(err) {
        if (err) {
            throw err;
        }
        broadcastSchedule = schedule;
        callback(broadcastSchedule);
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
    broadcastSchedule = [];
}

if (scheduleFile.stats && scheduleFile.stats.isFile()) {
    broadcastSchedule = JSON.parse(fs.readFileSync(scheduleFile.handle));
}

var latestEvent = _.chain(broadcastSchedule)
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
    var broadcastEvent = _.find(broadcastSchedule, function(broadcastEvent) {
        return broadcastEvent.id === req.params.eventId;
    });
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
        res.json(broadcastSchedule);
    }
});
app.post("/broadcastevent", function(req, res) {
    var newEvent;
    var newSchedule;
    var toReplay;
    var validationError = false;

    if (!req.body.type || (req.body.type !== "record" && req.body.type !=="replay")) {
        validationError = true;
    }

    if (req.body.type === "record") {
        if (!req.body.name || !req.body.name.trim()) {
            validationError = true;
        }
    } else {

        toReplay = _.find(broadcastSchedule, function(event) {
            return event.type === "record" && event.id === req.body.replayId;
        });

        if (!toReplay) {
            validationError = true;
        }
    }

    if (validationError) {
        res.statusCode = 400;
        res.end();
        return;
    }

    newEvent = {
        id: ++eventCounter + "",
        name: req.body.name.trim(),
        start: req.body.start,
        duration: req.body.duration,
        type: req.body.type
    };

    newSchedule = copySchedule(broadcastSchedule);
    newSchedule.push(newEvent);
    saveSchedule(newSchedule, function(savedSchedule) {
        res.json(savedSchedule);
    });
});
app.put("/broadcastevent/:eventId", function(req, res) {
    var newSchedule = copySchedule(broadcastSchedule);
    var newEvent = {
        id: ++eventCounter + ""
    };
    newSchedule.push(newEvent);
    saveSchedule(newSchedule, function(savedSchedule) {
        res.json(newEvent);
    });
});
app.del("/broadcastevent/:eventId", function(req, res) {

    var newSchedule;
    var idx;

    if (!req.broadcastEvent) {
        res.statusCode = 404;
        res.end();
    }

    newSchedule = copySchedule(broadcastSchedule);
    idx = _.chain(newSchedule)
        .pluck("id")
        .indexOf(req.broadcastEvent.id)
        .value();

    newSchedule.splice(idx, 1);
    saveSchedule(newSchedule, function(savedSchedule) {

        res.statusCode = 200;
        res.end();
    });
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
