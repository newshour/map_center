var redis = require("redis");

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
};
// create
// Generate a unique token and store it. Optionally, specify the timeout of the
// token in seconds:
// create( [options,] callback )
TokenStore.prototype.create = function(options, callback) {
    var token = Math.random().toString().slice(2);
    var expires = new Date().getTime();

    if (typeof options === "function") {
        callback = options;
    }

    if (typeof options.timeout === "number") {
        expires += options.timeout;
    } else {
        expires += this._timeout;
    }

    this._client.zadd("tokens", expires, token, function(err) {
        callback(err, token);
    });
};
TokenStore.prototype.isValid = function(token, callback) {
    var now = new Date().getTime();
    this._client.zrevrangebyscore(["tokens", "+inf", now],
        function(err, tokens) {

            var isValid = false;
            if (tokens.indexOf(token) > -1 ) {
                isValid = true;
            }

            callback(err, isValid);
        });
};
// getValid
// Return all valid tokens as an object whose keys are the token strings and
// whose values are the expiration timestamps
TokenStore.prototype.getValid = function(callback) {
    var now = new Date().getTime();
    this._client.zrevrangebyscore(["tokens", "+inf", now, "WITHSCORES"],
        // zrevrangebyscore returns an array where values (tokens in this case)
        // and scores (expiration timestamps in this case) are intersperced as
        // follows:
        //     [ token1, timestamp1, token2, timestamp2, ... ]
        // This requires some minor processing to format in the more usable
        // form described above.
        function(err, data) {
            var validTokens = {};
            data.forEach(function(token, idx) {
                if (idx % 2) {
                    return;
                }
                validTokens[token] = data[idx+1];
            });

            callback(err, validTokens);
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
