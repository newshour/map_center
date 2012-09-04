var _ = require("underscore");
var express = require("express");
var passport = require("passport");
var RedisStore = require("connect-redis")(express);
var TwitterStrategy = require("passport-twitter").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    // For now, don't bother persisting information about the user. Simply set
    // a flag so the application can grant access to recognized users.
    done(null, { id: id });
});
// Dynamically generating a secret in this way means one less file will have to
// be managed outside of the repository. The drawback is that, in the event of
// a server re-start, all authenticated users will be kicked and need to re-
// authenticate.
var sessionSecret = "This is a secret." + Math.random();
var secureCookieParser = express.cookieParser(sessionSecret);
var sessionStore = new RedisStore();

// Simple Express middleware to restrict access to protected endpoints
var redirectUnauthorized = function(req, res, next) {

    // The request should be honored either of the following conditions hold:
    // 1. The requested resource is an authorization endpoint
    // 2. The user has already authenticated with this server
    if (/^\/auth\//.test(req.path) ||
        (req.session && req.session.passport && req.session.passport.user)) {
        next();

    // In all other cases, snub the request
    } else {
        next("Unauthorized");
    }
};

// routeHandlers
// These handlers are necessary for the OAuth protocol. They must be exposed on
// an HTTP route before they may be utilized.
var routeHandlers = [
    {
        serviceName: "twitter",
        request: passport.authenticate("twitter"),
        callback: passport.authenticate("twitter", {
            successRedirect: "/",
            failureRedirect: "/"
        })
    },
    {
        serviceName: "google",
        request: passport.authenticate("google", {
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ]}),
        callback: passport.authenticate("google", {
            successRedirect: "/",
            failureRedirect: "/"
        })
    }
];

exports.initialize = function(CREDS, serviceLocation) {

    var baseUrl = "http://" + serviceLocation.hostName +
        ":" + serviceLocation.portNumber;

    function authorize(isRecognized, id, done) {
        if (isRecognized) {
            return done(null, { id: id, isRecognized: true });
        } else {
            return done("Not recognized");
        }
    }

    passport.use(new TwitterStrategy({
            consumerKey: CREDS.oauth.twitter.key,
            consumerSecret: CREDS.oauth.twitter.secret,
            callbackURL: baseUrl + "/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, done) {

            var id = profile.username;
            var isRecognized = CREDS.oauth.twitter.ids.indexOf(id) > -1;

            authorize(isRecognized, id, done);

        }
    ));
    passport.use(new GoogleStrategy({
            clientID: CREDS.oauth.google.key,
            clientSecret: CREDS.oauth.google.secret,
            callbackURL: baseUrl + "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            // profile.emails is an array with the following format:
            // [ { value: "a@b.com" }, { value: "c@d.com" }, ... ]
            // So _.pluck out the e-mail addresses themselves.
            var emailAddresses = _.pluck(profile.emails, "value");
            var ids = _.intersection(CREDS.oauth.google.ids, emailAddresses);
            var id = ids[0];
            var isRecognized = (id !== undefined);

            authorize(isRecognized, id, done);
        }
    ));
};

exports.initializeApp = function(app) {
    app.use(express.cookieParser());
    app.use(express.session({ store: sessionStore, secret: sessionSecret }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(redirectUnauthorized);
};

exports.getRouteHandlers = function() {

    return routeHandlers;
};

exports.checkAuthorization = function(cookie, callback) {

    // Create an object literal to mimick Connect's "request" object so that
    // it may be parsed by the cookieParser
    var fakeReq = { headers: { cookie: cookie } };

    secureCookieParser(fakeReq, {}, function(err) {
        var sessionId;

        if (err) {
            callback(err);
            return;
        }

        sessionId = fakeReq.signedCookies && fakeReq.signedCookies["connect.sid"];

        sessionStore.get(sessionId, function(err, sessionData) {

            var isAuthorized;

            if (err) {
                callback(err);
                return;
            }

            // A user is only authorized if passport has set their username
            isAuthorized = sessionData && sessionData.passport &&
                sessionData.passport.user;

            callback(null, isAuthorized);
        });
    });
};
