var express = require("express");
var app = express.createServer();
var io = require("socket.io").listen(app);
var _ = require("underscore");

var BroadcastSchedule = require("./broadcastSchedule");

// Server name and port. Reference environmental variables when they are set,
// and fall back to sensible defaults.
var serviceLocation = {
    portNumber: process.env.NODE_PORT || 8000,
    hostName: process.env.NODE_HOST || "127.0.0.1"
};

var broadcastSchedule = new BroadcastSchedule();

// ----------------------------------------------------------------------------
// --[ scheduling control HTTP endpoints ]

app.use(express.bodyParser());
app.use(express.static(__dirname + "/www"));

app.param("recId", function(req, res, next) {

    broadcastSchedule.get(req.params.recId, function(err, data) {

        if (err) {
            return next(err);
        }

        if (!data) {
            return next("resource not found");
        }

        req.recordingEvent = data;
        next();
    });
});

app.get("/recording/:recId?", function(req, res) {

    if (req.recordingEvent) {
        res.json(req.recordingEvent);
    } else {
        // TODO: Extend API to allow pagination by date
        broadcastSchedule.getByTime(null, function(err, broadcasts) {

            var semaphore;

            broadcasts = _.filter(broadcasts, function(broadcast) {
                return broadcast.type ==="recording";
            });

            semaphore = broadcasts.length;

            _.forEach(broadcasts, function(broadcast) {
                broadcastSchedule.getReplaysByRecordingID(broadcast.id, function(err, replays) {
                    broadcast.replays = replays;
                    semaphore--;
                    if (!semaphore) {
                        res.json(broadcasts);
                    }

                });
            });
        });
    }
});

app.post("/recording", function(req, res) {

    var eventData;

    // TODO: set up a `/replay` endpoint and infer type based on endpoint
    if (req.body.type === "recording") {

        // TODO: Share validation logic between client & server
        if(!req.body.name || !req.body.name.trim()) {
            res.statusCode = 400;
            res.end();
            return;
        }
        eventData = {
            name: req.body.name.trim(),
            timeStamp: req.body.timeStamp,
            duration: req.body.duration,
            type: req.body.type
        };
    } else {
        eventData = {
            recordingID: req.body.recordingID,
            timeStamp: req.body.timeStamp,
            type: req.body.type
        };
    }

    broadcastSchedule.create(eventData, function(err, newEvent) {
        res.json(newEvent);
    });
});
app.put("/recording/:recId", function(req, res) {

    var newEvent = {
        name: req.body.name.trim(),
        timeStamp: req.body.timeStamp,
        duration: req.body.duration
    };

    broadcastSchedule.update(req.recordingEvent.id, newEvent, function(err) {
        if (err) {
            res.statusCode = 500;
        } else {
            res.statusCode = 200;
        }
        res.end();
    });

});
app.del("/recording/:recId", function(req, res) {

    broadcastSchedule.del(req.recordingEvent.id, function(err) {
        if (err) {
            res.statusCode = 500;
        } else {
            res.statusCode = 200;
        }
        res.end();
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

    var options = {};
    var fileName;

    fileName = req.recordingEvent.id + "-";
    fileName += req.recordingEvent.name.replace(/\s+/g, "-");
    fileName += ".json";

    if (req.query.startTime) {
        options.startTime = parseInt(req.query.startTime, 10);
    }

    if (req.query.endTime) {
        options.endTime = parseInt(req.query.endTime, 10);
    }

    broadcastSchedule.getRecordingEvent(req.recordingEvent.id,
        options,
        function(err, recording) {
            res.attachment(fileName);
            res.contentType("application/json");
            res.send(recording);
        });
});

app.listen(serviceLocation.portNumber, serviceLocation.hostName);

// ----------------------------------------------------------------------------
// --[ broadcast state management ]

var noop = function() {};
var socketEventHandlers = {
    changeVotes: noop,
    connection: noop
};
var longestEvent = 2*60*60*1000;
var tickInterval = 2*1000;
var tick = function() {

    var now = +new Date();

    var findActiveBroadcast = function(err, broadcasts) {
        var activeBroadcast;

        activeBroadcast = _.find(broadcasts, function(broadcast) {
            return broadcast.timeStamp <= now &&
                (broadcast.timeStamp + broadcast.duration) >= now;
        });


        if (!activeBroadcast) {
            setState("offAir");
            setTimeout(tick, tickInterval);
            return;
        }

        setState(activeBroadcast.type, activeBroadcast);
        setTimeout(tick, activeBroadcast.duration);
    };

    broadcastSchedule.getByTime({
        lowerTimestamp: now - longestEvent,
        // The upper timestamp should be greater than the tick interval to
        // account for the delay in retrieving broadcasts
        upperTimestamp: now + tickInterval*2,
        expandReplays: true
    }, findActiveBroadcast);
};

var setState = function(state, broadcast) {

    var bindings = {
        offAir: function() {
            socketEventHandlers.changeVotes = noop;
            socketEventHandlers.connection = noop;
        },
        recording: function(broadcast) {

            var currentMapState;

            var handleChangeVotes = function(data) {
                var changeEvent;
                // Update the "current" map state to be sent to newly-connected
                // clients
                currentMapState = data;

                io.sockets.emit("changeVotes", data);

                changeEvent = {
                    // Map event timestamps are relative to the start of the
                    // recording event
                    timeStamp: +new Date() - broadcast.timeStamp,
                    mapState: data
                };

                broadcastSchedule.addRecordingEvent(broadcast.id, changeEvent);
            };
            var handleConnection = function(socket) {
                if (currentMapState) {
                    socket.emit(currentMapState);
                }
            };
            socketEventHandlers.changeVotes = handleChangeVotes;
            socketEventHandlers.connection = handleConnection;
        },
        replay: function(broadcast) {

            broadcastSchedule.getRecordingEvent(broadcast.recordingID, {}, function(err, recording) {

                // Due to possible delays in database requests (and the
                // imprecise nature of the event loop), the current time may
                // differ from the scheduled time. Calculate this difference
                // so map change events can be scheduled accordingly.
                var timeDelta = +new Date() - broadcast.timeStamp;

                _.forEach(recording, function(changeEvent) {
                    setTimeout(function() {
                        io.sockets.emit("changeVotes", changeEvent.mapState);
                    }, changeEvent.timeStamp - timeDelta);
                });

            });
        }
    };

    if (state in bindings) {
        bindings[state](broadcast);
    }
};

tick();

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
