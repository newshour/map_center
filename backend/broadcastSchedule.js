var redis = require("redis");
var _ = require("underscore");

// BroadcastSchedule
// A CRUD datastore for broadcasts, which can be classified as either
// - recordings
// - replays
// Implemented as a Redis NoSQL database:
// - broadcastCounter <integer> - Maintained to generate broadcast IDs
// - broadcasts:byID <hash> - Contains meta data for recordings, encoded in JSON
// - broadcastIDs:byTimestamp <sorted set>
// - replayIDs:byRecordingID <sorted set>
var BroadcastSchedule = function(opts) {
    this._client = redis.createClient();
    this._schedule = [];
};
BroadcastSchedule.prototype = {
    create: function(params, callback) {

        var self = this;

        if (params.type === "replay" && !("recordingID" in params)) {
            callback("No recording ID specified for replay");
            return;
        }

        this._client.incr("broadcastCounter", function(err, newId) {

            var operations = self._client.multi();
            var json;

            // Store ID with data so it may be used on the client
            params.id = newId;

            json = JSON.stringify(params);

            operations.hset("broadcasts:byID", newId, json);
            operations.zadd("broadcastIDs:byTimestamp", params.timeStamp, newId);

            if (params.type === "replay") {
                operations.zadd("replayIDs:byRecordingID", params.recordingID, newId);
            }

            operations.exec(function(err) {
                if (_.isFunction(callback)) {
                    callback(err, params);
                }
            });
        });
    },
    get: function(id, userCallback) {

        if (!_.isFunction(userCallback)) {
            return;
        }

        this._client.hget("broadcasts:byID", id, function(err, broadcastStr) {
            var broadcastObj = JSON.parse(broadcastStr);

            userCallback(err, broadcastObj);
        });
    },
    getReplaysByRecordingID: function(id, userCallback) {
        var self = this;
        this._client.zrevrangebyscore("replayIDs:byRecordingID", id, id, function(err, ids) {
            var args, callback;

            if (err) {
                userCallback(err);
                return;
            }

            if (!ids.length) {
                userCallback();
                return;
            }

            callback = function(err, broadcastStrs) {
                var broadcastObjs;

                if (!err) {
                    broadcastObjs = _.map(broadcastStrs, function(broadcastStr) {
                        return JSON.parse(broadcastStr);
                    });
                }
                userCallback(err, broadcastObjs);
            };

            args = ["broadcasts:byID"].concat(ids, callback);

            self._client.hmget.apply(self._client, args);
        });
    },
    getByTime: function(options, userCallback) {

        var self = this;

        options = options || {};

        if (!("lowerTimestamp" in options)) {
            options.lowerTimestamp = "-inf";
        }

        if (!("upperTimestamp" in options)) {
            options.upperTimestamp = "+inf";
        }

        // callbacks for Redis transactions
        var handlers = {
            broadcastIDsReceived: function(err, ids) {
                var args;

                if (err) {
                    userCallback(err, []);
                    return;
                }
                if (!ids.length) {
                    userCallback(null, []);
                    return;
                }

                // Comply with the node-redis API, where the "hmget" method
                // expects each desired field to be a separate argument
                args = ["broadcasts:byID"].concat(ids, handlers.broadcastDataReceived);

                self._client.hmget.apply(self._client, args);
            },
            broadcastDataReceived: function(err, broadcastStrs) {

                var broadcastObjs, replayObjs, semaphore;

                if (broadcastStrs) {
                    broadcastObjs = _.map(broadcastStrs, function(broadcastStr) {
                        return JSON.parse(broadcastStr);
                    });
                }

                // If expanded replay information was not requested, the
                // transaction is complete.
                if (err || !options.expandReplays) {
                    userCallback(err, broadcastObjs);
                    return;
                }

                replayObjs = _.filter(broadcastObjs, function(broadcast) {
                    return broadcast.type === "replay";
                });

                // A separate request must be made for each replay, so use a
                // semaphore to track progress
                semaphore = replayObjs.length;

                // If there are no replays to expand, return the results
                // immediately
                if (!semaphore) {
                    userCallback(err, broadcastObjs);
                    return;
                }

                _.forEach(replayObjs, function(replay) {

                    self.get(replay.recordingID, function(err, recording) {

                        replay.duration = recording && recording.duration;
                        semaphore--;

                        if (!semaphore) {
                            userCallback(err, broadcastObjs);
                        }
                    });
                });
            }
        };

        this._client.zrevrangebyscore("broadcastIDs:byTimestamp",
            options.upperTimestamp,
            options.lowerTimestamp,
            handlers.broadcastIDsReceived);
    },
    update: function(id, params, callback) {

        var self = this;

        this._client
            .hexists("broadcasts:byID", id, function(err, result) {

                var json, operations;

                if (err) {
                    callback(err);
                    return;
                }

                if (!parseInt(result, 10)) {
                    callback("Specified event does not exist");
                    return;
                }

                // ID cannot be modified by the client
                delete params.id;

                json = JSON.stringify(params);

                operations = self._client.multi();

                operations.hset("broadcasts:byID", id, json, callback);

                if (params.type === "replay") {
                    operations.zadd("replayIDs:byRecordingID", params.recordingID, id);
                }
                // zadd will update scores of already-existing members, but
                // this should only be done when a timeStamp is specified
                if ("timeStamp" in params) {
                    operations.zadd("broadcastIDs:byTimestamp", params.timeStamp, id);
                }

                operations.exec(callback);
            });
    },
    del: function(id, callback) {
        var operations = this._client.multi();

        operations.hdel("broadcasts:byID", id)
        operations.zrem("broadcastIDs:byTimestamp", id)

        // Remove from the "replayIDs" sorted set regardless of whether
        // the broadcast is a recording or a replay. This simplification is
        // possible for two reasons:
        // 1) removing recording IDs from this set will have no effect
        // 2) IDs are unique across recordings and replays
        operations.zrem("replayIDs:byRecordingID", id);

        operations.exec(callback);
    },
    addRecordingEvent: function(recordingID, event, userCallback) {
        var eventJSON = JSON.stringify(event);
        this._client.rpush("recording:" + recordingID, eventJSON, userCallback);
    },
    getRecordingEvent: function(recordingID, options, userCallback) {

        this._client.lrange("recording:" + recordingID, 0, -1, function(err, eventStrs) {
            var eventObjs;

            eventObjs = _.map(eventStrs, function(eventStr) {
                return JSON.parse(eventStr);
            });

            if ("endTime" in options) {

                eventObjs = _.filter(eventObjs, function(eventObj) {
                    return eventObj.timeStamp < options.endTime;
                });
            }

            if ("startTime" in options) {
                // Normalize the mapEvent timestamps to be relative to the
                // requested startTime
                _.forEach(eventObjs, function(eventObj) {
                    eventObj.timeStamp -= options.startTime;
                });

                // Remove any mapEvents that occurred before the requested
                // startTime
                eventObjs = _.filter(eventObjs, function(eventObj) {
                    return eventObj.timeStamp >= 0;
                });
            }

            userCallback(err, eventObjs);
        });
    }
};

module.exports = BroadcastSchedule;
