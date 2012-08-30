var redis = require("redis");

var purgeInterval = 1000*60*60*6;   // 6 hours

// TokenStore
// A CRUD datastore for tokens, which are used to grant temporary authorization
// to broadcasters after they have presented valid credentials
// Implemented as a Redis NoSQL database:
// - tokens:metadata <hash> - Indexed by the tokens themselves. Contains
//   user-defined meta data for tokens, along with an "expires" field (a UNIX
//   timestamp describing the moment that the token will be invalidated)
// - tokens:byExpiration <sorted set> - indexed by token expiration time. Used
//   to enable efficient queries for currently-valid tokens
// NOTE: This implementation does not scale well for large numbers of valid
// tokens.
var TokenStore = function(options) {

    options = options || {};

    this._client = redis.createClient();
    this._timeout = 1000*60*60*3;   // 3 hours

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
// Generate a unique token and store it. Optionally, specify arbitrary metadata
// to be stored along with the token. If unspecified, an "expires" attribute
// will be created as a UNIX timestamp describing the moment the token will be
// invalidated.
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
        callback(err, { val: token, meta: metaData });
    });
};
// isValid
// Determine if a given token is valid
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

            self._client.hmget(hmgetArgs, function(err, tokenJSON) {
                var toreturn = tokenJSON && tokenJSON.map(function(json, idx) {
                    return { val: tokens[idx], meta: JSON.parse(json) };
                });

                callback(err, toreturn);
            });
        });
};
// invalidate
// Ensure that the specified token, if it exists, is no longer recognized as
// valid
TokenStore.prototype.invalidate = function(token, callback) {
    var operations = this._client.multi();

    operations.zrem("tokens:byExpiration", token);
    operations.hdel("tokens:metadata", token);

    operations.exec(callback);
};
// _purge
// Private method for curbing the growth of the database by removing expired
// tokens. This is done for memory efficiency only: the TokenStore safely
// ignores expired tokens that persist in the database.
TokenStore.prototype._purge = function(callback) {
    var self = this;
    var now = new Date().getTime();

    var scheduleNext = function() {
        setTimeout(function() {
            self._purge();
        }, purgeInterval);
    };

    this._client.zrevrangebyscore(["tokens:byExpiration", now, "-inf"], function(err, tokens) {
        var toInvalidateCount = tokens.length;

        tokens.forEach(function(token) {
            self.invalidate(token, function() {
                toInvalidateCount--;

                if (toInvalidateCount === 0) {
                    scheduleNext();
                }
            });
        });

        if (toInvalidateCount === 0) {
            scheduleNext();
        }
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
