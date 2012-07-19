var portNumber = 8000;
var express = require("express");
var app = express.createServer();
var io = require("socket.io").listen(app);
var fs = require("fs");
var url = require("url");
var _ = require("underscore");
var schedule = {
    file: {
        handle: "backend/schedule.json"
    },
    events: []
};
// Global array containing all known broadcast events
var broadcastSchedule;
var fileEncoding = "utf8";

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
function saveSchedule(newSchedule, callback) {
    fs.writeFile(schedule.file.handle, JSON.stringify(newSchedule), function(err) {
        if (err) {
            throw err;
        }
        broadcastSchedule = newSchedule;

        // Re-schedule all events whenever the broadcast schedule is
        // successfully saved.
        // TODO: Only re-schedule changed events in order to prevent
        // interrupting any currently-active events
        cancelEvents(schedule.events);
        schedule.events = createEvents(broadcastSchedule);
        _.forEach(schedule.events, function(event) {
            event.schedule();
        });

        callback(broadcastSchedule);
    });
}

// Derive the recording file handle from that recording's meta-data
function getRecordingFileHandle(recording) {
    return "backend/recordings/" + recording.id + "-" +
        recording.name.replace(/[\. ]/g, "-") + ".txt";
}

// ----------------------------------------------------------------------------
// --[ setup for scheduling control ]

try {
    schedule.file.stats = fs.lstatSync(schedule.file.handle);
} catch(err) {
    // File does not exist. Create an empty collection in memory
    broadcastSchedule = [];
}

if (schedule.file.stats && schedule.file.stats.isFile()) {
    broadcastSchedule = JSON.parse(fs.readFileSync(schedule.file.handle, fileEncoding));
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

app.param("recId", function(req, res, next) {
    var recordingEvent = _.find(broadcastSchedule, function(recordingEvent) {
        return recordingEvent.id === req.params.recId;
    });
    if (!recordingEvent) {
        return next(new Error("failed to find recording event"));
    }
    req.recordingEvent = recordingEvent;
    req.recordingEvent.fileHandle = getRecordingFileHandle(req.recordingEvent);
    next();
});

app.get("/recording/:recId?", function(req, res) {

    if (req.recordingEvent) {
        res.json(req.recordingEvent);
    } else {
        res.json(broadcastSchedule);
    }
});

app.post("/recording", function(req, res) {
    var newEvent;
    var newSchedule;

    if (!req.body.name || !req.body.name.trim()) {
        res.statusCode = 400;
        res.end();
        return;
    }

    newEvent = {
        id: ++eventCounter + "",
        name: req.body.name.trim(),
        timeStamp: req.body.timeStamp,
        duration: req.body.duration,
        replayTimestamps: req.body.replayTimestamps || []
    };

    newSchedule = copySchedule(broadcastSchedule);
    newSchedule.push(newEvent);
    saveSchedule(newSchedule, function(savedSchedule) {
        res.json(newEvent);
    });
});
app.put("/recording/:recId", function(req, res) {
    var newSchedule = copySchedule(broadcastSchedule);
    var idx;

    idx = _.chain(newSchedule).pluck("id").indexOf(req.recordingEvent.id).value();

    newSchedule[idx] = {
        id: req.recordingEvent.id,
        name: req.body.name.trim(),
        timeStamp: req.body.timeStamp,
        duration: req.body.duration,
        replayTimestamps: req.body.replayTimestamps || []
    };

    saveSchedule(newSchedule, function(savedSchedule) {
        res.statusCode = 200;
        res.end();
    });
});
app.del("/recording/:recId", function(req, res) {

    var newSchedule;
    var idx;

    if (!req.recordingEvent) {
        res.statusCode = 404;
        res.end();
        return;
    }

    newSchedule = copySchedule(broadcastSchedule);

    idx = _.chain(newSchedule)
        .pluck("id")
        .indexOf(req.recordingEvent.id)
        .value();

    newSchedule.splice(idx, 1);
    saveSchedule(newSchedule, function(savedSchedule) {

        fs.unlink(req.recordingEvent.fileHandle, function(err) {

            // Since the file may not exist yet, ignore any errors
            res.statusCode = 200;
            res.end();
        });
    });
});

// Return a JSON-formatted file describing all the map events that took place
// over the corse of the recording specified. Optionally filter out map events
// according to the following parameters:
// - startTime <number>: remove events that occurred before this number of
//   milliseconds (relative to the beginning of the recording)
// - endTime <number>: remove events that occurred before this number of
//   milliseconds (relative to the beginning of the recording)
app.get("/recordingjson/:recId", function(req, res) {

    var fileHandle = req.recordingEvent.fileHandle;
    var jsonFileHandle = fileHandle.replace(/\..{2,4}$/, ".json");

    fs.readFile(fileHandle, fileEncoding, function(err, fileContents) {

        // The recorded contents are not JSON formatted
        var mapEvents;
        var recordingStartTime = req.recordingEvent.timeStamp;

        if (err) {
            res.statusCode = 404;
            res.end();
            return;
        }

        mapEvents = JSON.parse("[" + fileContents.replace(/,\s*$/, "") + "]");

        if (req.query.endTime) {
            mapEvents = _.filter(mapEvents, function(mapEvent) {
                return mapEvent.timeStamp < req.query.endTime;
            });
        }

        if (req.query.startTime) {
            // Normalize the mapEvent timestamps to be relative to the
            // requested startTime
            _.forEach(mapEvents, function(mapEvent) {
                mapEvent.timeStamp -= parseInt(req.query.startTime, 10);
            });

            // Remove any mapEvents that occurred before the requested
            // startTime
            mapEvents = _.filter(mapEvents, function(mapEvent) {
                return mapEvent.timeStamp >= 0;
            });
        }

        res.attachment(jsonFileHandle);
        res.contentType("application/json");
        res.send(mapEvents);
    });
});

app.listen(portNumber);

// ----------------------------------------------------------------------------
// --[ broadcast state management ]

function cancelEvents(events) {
    _.forEach(events, function(event) {
        event.cancel();
    });
}
function createEvents(schedule) {

    var events = [];

    _.forEach(schedule, function(eventData) {

        events.push(new Event(_.extend({}, eventData, {
            type: "record"
        })));

        _.forEach(eventData.replayTimestamps, function(replayTimestamp) {

            events.push(new Event(_.extend({}, eventData, {
                timeStamp: replayTimestamp,
                type: "replay"
            })));
        });

    });

    return events;
}

/* Event
 * A class to control the state of the server as it changes over time. Each
 * instance describes either a "record" state (where incoming 'changeVotes'
 * socket events are logged to disk and broadcasted to all listeners) or a
 * 'replay' state (where `changeVotes` events are read from a previously-
 * created log file and pushed to all clients)
 */
function Event(options) {
    this.isActive = false;
    this.id = options.id;
    this.name = options.name;
    this.type = options.type;
    this.timeStamp = options.timeStamp;
    this.duration = options.duration;
};
Event.prototype = {
    getFileName: function() {
        return "backend/recordings/" + this.id + "-" + this.name.replace(/[\. ]/g, "-")
            + ".txt";
    },
    schedule: function() {

        var now = +new Date();
        // The number of milliseconds before scheduling the start of this event
        var tMinus = this.timeStamp - now;

        // Do not schedule events that have already taken place.
        // TODO: Extend to allow for scheduling events that should have started
        // but not finished yet, i.e.
        //     if (tMinus < 0 && tMinus + this.duration < 0)
        if (tMinus < 0) {
            return;
        }

        this.setupId = setTimeout(this.start.bind(this), tMinus);
        this.teardownId = setTimeout(this.cancel.bind(this), tMinus + this.duration);
    },
    start: function() {
        this.isActive = true;

        if (this.type === "record") {
            this._startRecording();
        } else {
            this._startReplaying();
        }
    },
    cancel: function() {
        if (this.isActive) {
            if(this.type === "record") {
                this._stopRecording();
            } else {
                this._stopReplaying();
            }
        }
        if (typeof this.setupId === "number") {
            clearTimeout(this.setupId);
        }
        if (typeof this.teardownId === "number") {
            clearTimeout(this.teardownId);
        }
        this.isActive = false;
    },
    _startRecording: function() {

        // Reference to the most recent state of the map. Used to bring new
        // clients up to speed before a new state is pushed
        var currentMapState;
        var self = this;
        // Store a reference to the file stream so it can be closed when this
        // event ends (or is cancelled)
        this.fileStream = fs.createWriteStream(getRecordingFileHandle(this), {
            flags: "w",
            encoding: fileEncoding,
        });

        function handleChangeVotes(data) {

            var changeEventStr;

            // Update the "current" map state to be sent to newly-connected
            // clients
            currentMapState = data;

            io.sockets.emit("changeVotes", data);

            changeEventStr = JSON.stringify({
                // Map event timestamps are relative to the start of the
                // recording event
                timeStamp: +new Date() - self.timeStamp,
                mapState: data
            }) + ",\n";

            self.fileStream.write(changeEventStr);
        }
        function handleConnection(socket) {
            if (currentMapState) {
                socket.emit("changeVotes", currentMapState);
            }
        }

        socketEventHandlers.changeVotes = handleChangeVotes;
        socketEventHandlers.connection = handleConnection;
    },
    _stopRecording: function() {

        this.fileStream.end();
        socketEventHandlers.changeVotes = noop;
        socketEventHandlers.connection = noop;
    },
    _startReplaying: function() {

        // Reference to the most recent state of the map. Used to bring new
        // clients up to speed before a new state is pushed
        var currentMapState;
        var fileHandle = getRecordingFileHandle(this);
        var data = fs.readFileSync(fileHandle, fileEncoding);
        var changeEvents = JSON.parse("[" + data.replace(/,\s*$/g, "") + "]");
        var timeoutIds = this.timeoutIds = [];
        var firstEvent = _.first(changeEvents);

        _.forEach(changeEvents, function(changeEvent, idx) {
            var timeoutId = setTimeout(function() {
                io.sockets.emit("changeVotes", changeEvent.mapState);
            }, changeEvent.timeStamp);
            timeoutIds.push(timeoutId);
        }, this);

    },
    _stopReplaying: function() {

        _.forEach(this.timeoutIds, function(timeoutId) {
            clearTimeout(timeoutId);
        });
    }
};
var noop = function() {};
var socketEventHandlers = {
    changeVotes: noop,
    connection: noop
};

/* socket.io does not support ad-hoc binding to all currently-connected clients
 * (**see below). This effects the approach to dynamically assigning event
 * handlers. Instead of running the following code:
 *
 *     io.sockets.on("changeVotes", newChangeVotesHandler);
 *
 *  ...each socket must be individually assigned a handler when it connects.
 *  This handler can invoke a global method, and this method may be dynamically
 *  modified.
 *
 *  ** The socket.io documentation is somewhat lacking, making it difficult to
 *  confirm this deficiency.
 */
io.sockets.on("connection", function(socket) {
    var args = Array.prototype.slice.call(arguments);
    socketEventHandlers.connection.apply(socket, args);

    socket.on("changeVotes", function() {
        var args = Array.prototype.slice.call(arguments);
        socketEventHandlers.changeVotes.apply(socket, args);
    });
});
cancelEvents(schedule.events);
schedule.events = createEvents(broadcastSchedule);
_.forEach(schedule.events, function(event) {
    event.schedule();
});
