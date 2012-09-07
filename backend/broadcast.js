var _ = require("underscore");
var socketIo = require("socket.io");
// ----------------------------------------------------------------------------
// --[ broadcast state management ]

var auth = require("./auth");

var socketServer;
var broadcastSchedule;

var noop = function() {};
var socketEventHandlers = {
    updateMap: noop,
    connection: noop
};
var longestEvent = 2*60*60*1000;
var tickInterval = 2*1000;

var handlerGenerators;

// Set handlers for relevant socket events:
// - connection (from all new clients)
// - updateMap (from authenticated broadcaster)
var setHandlers = function(state, broadcast, callback) {

    if (state in handlerGenerators) {
        handlerGenerators[state](broadcast, function(err, handlers) {
            if (err) {
                callback(err);
                return;
            }
            if (handlers.onConnection === null) {
                handlers.onConnection = noop;
            }

            if (handlers.onUpdateMap === null) {
                handlers.onUpdateMap = noop;
            }

            socketEventHandlers.connection = handlers.onConnection;
            socketEventHandlers.updateMap = handlers.onUpdateMap;

            callback();
        });
    } else {
        setTimeout(function() {
            callback("Unrecognized state");
        }, 0);
    }
};

var tick = function() {

    var now = +new Date();

    var findActiveBroadcast = function(err, broadcasts) {
        var activeBroadcast;

        activeBroadcast = _.find(broadcasts, function(broadcast) {
            return broadcast.timeStamp <= now &&
                (broadcast.timeStamp + broadcast.duration) >= now;
        });


        if (!activeBroadcast) {
            setHandlers("offAir", null, function(err) {
                setTimeout(tick, tickInterval);
            });
        } else {

            setHandlers(activeBroadcast.type, activeBroadcast, function(err) {
                setTimeout(tick, activeBroadcast.duration);
            });
        }
    };

    broadcastSchedule.getByTime({
        lowerTimestamp: now - longestEvent,
        // The upper timestamp should be greater than the tick interval to
        // account for the delay in retrieving broadcasts
        upperTimestamp: now + tickInterval*2,
        expandReplays: true
    }, findActiveBroadcast);
};

// handlerGenerators
// Create socket event handlers for the provided state and broadcast. Valid
// states:
// - offAir
// - recording
// - replay
handlerGenerators = exports.handlerGenerators = {
    offAir: function(_, callback) {
        setTimeout(function() {
            callback(null, {
                onUpdateMap: null,
                onConnection: null
            });
        }, 0);
    },
    recording: function(broadcast, callback) {
        var currentMapState;

        var handleUpdateMap = function(mapState) {
            var changeEvent;
            // Update the "current" map state to be sent to newly-connected
            // clients
            currentMapState = mapState;

            socketServer.sockets.emit("updateMap", mapState);

            changeEvent = {
                // Map event timestamps are relative to the start of the
                // recording event
                timeStamp: +new Date() - broadcast.timeStamp,
                mapState: mapState
            };

            broadcastSchedule.addRecordingEvent(broadcast.id, changeEvent);
        };
        var handleConnection = function(socket) {
            if (currentMapState) {
                socket.emit("updateMap", currentMapState);
            }
        };
        setTimeout(function() {
            callback(null, {
                onUpdateMap: handleUpdateMap,
                onConnection: handleConnection
            });
        }, 0);
    },
    // The following implementation of replay broadcast is no longer supported.
    // This code simulates change events and re-broadcasts them in real-time to
    // all connected clients.  This means that the backend will have to bear
    // the same load under live broadcasts and replays alike. The new approach
    // (described below) avoids this, but this optimization may not be
    // necessary, in which case the original approach should be re-implemented
    // due to its simplicity.
    __replay: function(broadcast, callback) {

        broadcastSchedule.getRecordingEvent(broadcast.recordingID, {}, function(err, recording) {

            var timeDelta;

            if (err) {
                callback(err);
                return;
            }

            // Due to possible delays in database requests (and the imprecise
            // nature of the event loop), the current time may differ from the
            // scheduled time. Calculate this difference so map change events can
            // be scheduled accordingly.
            timeDelta = +new Date() - broadcast.timeStamp;

            _.forEach(recording, function(changeEvent) {
                setTimeout(function() {
                    socketServer.sockets.emit("updateMap", changeEvent.mapState);
                }, changeEvent.timeStamp - timeDelta);
            });

            callback(null, {
                onUpdateMap: null,
                onConnection: null
            });
        });
    },
    replay: function(broadcast, callback) {

        broadcastSchedule.getRecordingEvent(broadcast.recordingID, {}, function(err, recording) {

            if (err) {
                callback(err);
                return;
            }

            // Retrieve any other replays of the current recording so that
            // clients can mimick re-broadcasting without needing to
            // refresh (especially relevant for clients who connect at the
            // end of one rebroadcast expecting to view the following
            // rebroadcast)
            broadcastSchedule.getReplaysByRecordingID(
                broadcast.recordingID,
                function(err, allReplays) {

                    var now, upcomingReplays, emitReplay, handleConnection;


                    if (err) {
                        callback(err);
                        return;
                    }

                    now = +new Date();
                    upcomingReplays = _.filter(allReplays, function(replay) {
                        return replay.timeStamp >= now ||
                            // Due to delays caused by the program event loop
                            // and database queries, the active replay's start
                            // time may be slightly earlier than the current
                            // time. This condition ensures that in such cases,
                            // the active replay is broadcast to all clients.
                            replay.id === broadcast.id;
                    });

                    emitReplay = function(socket) {
                        socket.emit("replay", {
                            currentTime: +new Date(),
                            startTimes: _.pluck(upcomingReplays, "timeStamp"),
                            recording: recording
                        });
                    };
                    handleConnection = function(socket) {
                        emitReplay(socket);
                        // Clients that connect during a rebroadcast can be
                        // disconnected in order to minimize overhead
                        socket.disconnect();
                    };

                    // Immediately emit the replay event to any
                    // already-connected clients in order to support clients
                    // that connected at the end of a broadcast expecting to
                    // view the re-broadcast
                    emitReplay(socketServer.sockets);

                    callback(null, {
                        onConnection: handleConnection,
                        onUpdateMap: null
                    });

                });
        });
    }
};

exports.initialize = function(httpServer, newBroadcastSchedule) {
    broadcastSchedule = newBroadcastSchedule;
    socketServer = socketIo.listen(httpServer);
    /* socket.io does not support ad-hoc binding to all currently-connected clients
     * (**see below). This effects the approach to dynamically assigning event
     * handlers. Instead of running the following code:
     *
     *     socketServer.sockets.on("updateMap", newUpdateMapHandler);
     *
     *  ...each socket must be individually assigned a handler when it connects.
     *  This handler can invoke a global method, and this method may be dynamically
     *  modified.
     *
     *  ** The socket.io documentation is somewhat lacking, making it difficult to
     *  confirm this deficiency.
     */
    socketServer.sockets.on("connection", function(socket) {
        socketEventHandlers.connection.apply(socket, arguments);
    });

    // Only clients that have authenticated through OAuth should be allowed to
    // join the "broadcaster" channel. Authentication can be confirmed by locating
    // the client's session ID in the Redis-connect datastore.
    socketServer.of("/broadcaster").authorization(function(handshakeData, callback) {

        auth.checkAuthorization(handshakeData.headers.cookie, function(err, isAuthorized) {

            if (err) {
                callback(err);
                return;
            }
            callback(null, isAuthorized);
        });
    }).on("connection", function(socket) {

        socket.on("updateMap", function() {
            var args = Array.prototype.slice.call(arguments);
            socketEventHandlers.updateMap.apply(socket, args);
        });
    });

    tick();
};
