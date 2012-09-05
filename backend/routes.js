var _ = require("underscore");
var auth = require("./auth");

var broadcastSchedule;

exports.initialize = function(newBroadcastSchedule) {
    broadcastSchedule = newBroadcastSchedule;
};

// attach
// Declare the routes needed for the web server
exports.attach = function(app) {

    // Set up endpoints for any OAuth routes declared in auth.js
    _.forEach(auth.getRouteHandlers(), function(handlers) {
        app.get("/auth/" + handlers.serviceName, handlers.request);
        app.get("/auth/" + handlers.serviceName + "/callback", handlers.callback);
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
};
