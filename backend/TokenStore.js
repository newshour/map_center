var redis = require("redis");

var purgeInterval = 1000*60*60*6;   // 6 hours

// BroadcastSchedule
// A CRUD datastore for broadcasts, which can be classified as either
// - recordings
// - replays
// Implemented as a Redis NoSQL database:
// - broadcastCounter <integer> - Maintained to generate broadcast IDs
// - broadcasts:byID <hash> - Contains meta data for recordings, encoded in JSON
// - broadcastIDs:byTimestamp <sorted set>
// - replayIDs:byRecordingID <sorted set>

// NOTE: This implementation does not scale well for large numbers of valid
// tokens.
var TokenStore = function(options) {

    options = options || {};

    this._client = redis.createClient();
    this._timeout = 60*60*3;

    // Specify the database index. Will default to 0 when not present
    if ("db" in options) {
        this._client.select(options.db);
    }
    if ("timeout" in options) {
        this._timeout = options.timeout;
    }

    // Initiate periodic removal of expired tokens
    this._purge();
};
// create
// Generate a unique token and store it. Optionally, specify the timeout of the
// token in seconds:
// create( [ metaData, ] callback )
TokenStore.prototype.create = function(metaData, callback) {
    var token = Math.random().toString().slice(2);
    var operations = this._client.multi();

    if (typeof metaData === "function") {
        callback = metaData;
        metaData = {};
    }

    if (typeof metaData.expires !== "number") {
        metaData.expires = this._timeout;
    }
    metaData.expires += new Date().getTime();

    operations.hset("tokens:metadata", token, JSON.stringify(metaData));
    operations.zadd("tokens:byExpiration", metaData.expires, token);

    operations.exec(function(err) {
        callback(err, token, metaData);
    });
};
TokenStore.prototype.isValid = function(token, callback) {
    var now = new Date().getTime();
    this._client.zrevrangebyscore(["tokens:byExpiration", "+inf", now],
        function(err, tokens) {

            var isValid = false;
            if (tokens.indexOf(token) > -1 ) {
                isValid = true;
            }

            callback(err, isValid);
        });
};
// getValid
// Return an array containing all valid token meta data.
TokenStore.prototype.getValid = function(callback) {
    var now = new Date().getTime();
    var self = this;
    this._client.zrevrangebyscore(["tokens:byExpiration", "+inf", now],
        function(err, tokens) {
            var hmgetArgs = ["tokens:metadata"];

            hmgetArgs = hmgetArgs.concat(tokens);

            self._client.hmget(hmgetArgs, function(err, metaDataJSON) {
                var metaData = metaDataJSON.map(function(json) {
                    return JSON.parse(json);
                });

                callback(err, metaData);
            });
        });
};
TokenStore.prototype.invalidate = function(token, callback) {
    this._client.zrem("tokens:byExpiration", token, callback);
};
// _purge
// Private method for curbing the growth of the database by removing expired
// tokens. This is done for memory efficiency only: the TokenStore safely
// ignores expired tokens that persist in the database.
TokenStore.prototype._purge = function(callback) {
    var self = this;
    var now = new Date().getTime();
    this._client.zremrangebyscore(["tokens:byExpiration", now, "-inf"], function() {
        setTimeout(function() {
            self._purge();
        }, purgeInterval);
    });
};
TokenStore.prototype.quit = function(callback) {
    this._client.quit(callback);
};
// Used for testing
TokenStore.prototype.clear = function(callback) {
    this._client.flushdb(callback);
};

module.exports = TokenStore;
