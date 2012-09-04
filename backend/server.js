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
    },
    ssl: {
        key: fs.readFileSync("./credentials/ssl/privatekey.pem").toString(),
        cert: fs.readFileSync("./credentials/ssl/certificate.pem").toString()
    }
};

var broadcastSchedule = new BroadcastSchedule();

var auth = require("./auth");
var broadcast = require("./broadcast");

// ----------------------------------------------------------------------------
// --[ scheduling control HTTP endpoints ]

auth.initialize(CREDS);
broadcast.initialize(server, broadcastSchedule);

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.static(__dirname + "/www"));

    auth.initializeApp(app);
});

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
// - offset <number>: shift events the occurred in the interval by this number
//   of milliseconds
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

    if (req.query.offset) {
        options.offset = parseInt(req.query.offset, 10);
    }

    broadcastSchedule.getRecordingEvent(req.recordingEvent.id,
        options,
        function(err, recording) {
            res.attachment(fileName);
            res.contentType("application/json");
            res.send(recording);
        });
});

server.listen(serviceLocation.portNumber, serviceLocation.hostName);
