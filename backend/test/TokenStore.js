var TokenStore = require("../TokenStore.js");
var testDbId  = 2;
var testModules = {};

testModules.setUp = function(callback) {
    this.tokenStore = new TokenStore({
        db: testDbId
    });
    callback();
};
testModules.tearDown = function(callback) {
    var self = this;
    this.tokenStore.clear(function() {
        self.tokenStore.quit(callback);
    });
};

testModules.createNormal = function(test) {
    test.expect(3);
    this.tokenStore.create(function(err, token) {
        test.ok(!err, "Does not return an error");
        test.ok(typeof token === "string", "Generates a string token");
        test.ok(token.length > 10, "Generated token has non-negligable length");
        test.done();
    });
};
testModules.createOptions = function(test) {
    test.expect(3);
    this.tokenStore.create({ timeout: 300 }, function(err, token) {
        test.ok(!err, "Does not return an error");
        test.ok(typeof token === "string", "Generates a string token");
        test.ok(token.length > 10, "Generated token has non-negligable length");
        test.done();
    });
};

testModules.isValid = {
    setUp: function(callback) {
        var self = this;
        this.shortLifespan = 300;
        this.tokenStore.create(function(err, token) {
            self.token = token;
            self.tokenStore.create({ timeout: self.shortLifespan }, function(err, token) {
                self.shortToken = token;
                callback();
            });
        });
    }
};
testModules.isValid.member = function(test) {

    test.expect(2);
    this.tokenStore.isValid(this.token, function(err, isValid) {

        test.ok(!err, "Does not return an error");
        test.ok(isValid, "Confirms validity");
        test.done();
    });
};
testModules.isValid.nonmember = function(test) {

    // Create an invalid token based on the runtime-generated token
    var invalidToken = this.token + "differentiator";

    test.expect(2);

    this.tokenStore.isValid(invalidToken, function(err, isValid) {

        test.ok(!err, "Does not return an error");
        test.ok(!isValid, "Confirms invalidity");
        test.done();
    });
};
testModules.isValid.expiring = function(test) {
    var self = this;

    test.expect(4);

    this.tokenStore.isValid(this.shortToken, function(err, isValid) {
        test.ok(!err, "Does not return an error");
        test.ok(isValid, "Confirms validity");
        setTimeout(function() {
            self.tokenStore.isValid(self.shortToken, function(err, isValid) {
                test.ok(!err, "Does not return an error");
                test.ok(!isValid, "Confirms invalidity");
                test.done();
            });
        }, self.shortLifespan);
    });
};

testModules.getValid = {
    setUp: function(callback) {
        var self = this;
        this.tokens = [];
        this.tokenStore.create(function(err, token) {
            self.tokens.push(token);
            self.tokenStore.create(function(err, token) {
                self.tokens.push(token);
                callback();
            });
        });
    }
};

testModules.getValid.normal = function(test) {
    var self = this;
    test.expect(6);

    this.tokenStore.getValid(function(err, validTokens) {
        var now = new Date().getTime();

        test.ok(!err, "Does not return an error");
        test.equal(2, Object.keys(validTokens).length,
            "Returns the correct number of tokens");

        self.tokens.forEach(function(token) {
            test.ok(token in validTokens, "Token is present");
            test.ok(validTokens[token] > now, "Token is not yet expired");
        });
        test.done();
    });
};
module.exports = testModules;
