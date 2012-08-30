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
        test.equal(typeof token.val, "string", "Generates a string token");
        test.ok(token.val.length > 10, "Generated token has non-negligable length");
        test.done();
    });
};
testModules.createWithOptions = function(test) {
    test.expect(3);
    this.tokenStore.create({ test: 123 }, function(err, token) {
        test.ok(!err, "Does not return an error");
        test.equal(typeof token.val, "string", "Generates a string token");
        test.ok(token.val.length > 10, "Generated token has non-negligable length");
        test.done();
    });
};

testModules.isValid = {
    setUp: function(callback) {
        var self = this;

        this.shortLifespan = 300;

        this.tokenStore.create(function(err, token) {
            self.token = token;
            self.tokenStore.create({ expires: self.shortLifespan }, function(err, token) {
                self.shortToken = token;
                callback();
            });
        });
    }
};
testModules.isValid.member = function(test) {

    test.expect(2);
    this.tokenStore.isValid(this.token.val, function(err, isValid) {

        test.ok(!err, "Does not return an error");
        test.ok(isValid, "Confirms validity");
        test.done();
    });
};
testModules.isValid.nonmember = function(test) {

    // Create an invalid token based on the runtime-generated token
    var invalidToken = this.token.val + "differentiator";

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

    this.tokenStore.isValid(this.shortToken.val, function(err, isValid) {
        test.ok(!err, "Does not return an error");
        test.ok(isValid, "Confirms validity");
        setTimeout(function() {
            self.tokenStore.isValid(self.shortToken.val, function(err, isValid) {
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
        this.metaData = [];

        this.tokenStore.create({ m: 23 }, function(err, token) {

            self.metaData.push(token);
            self.tokenStore.create({ j: 45 }, function(err, token) {
                self.metaData.push(token);
                self.metaData.sort(self.metaDataSorter);
                callback();
            });
        });
        this.metaDataSorter = function(a, b) {
            return a.val > b.val;
        };
    }
};
testModules.getValid.normal = function(test) {
    var self = this;
    test.expect(4);

    this.tokenStore.getValid(function(err, validTokenMetaData) {
        var now = new Date().getTime();

        test.ok(!err, "Does not return an error");
        test.equal(2, validTokenMetaData.length,
            "Returns the correct number of tokens");

        // The ordering of the returned meta data is not guaranteed, so sort
        // it. This simplifies the process of comparing expected values.
        validTokenMetaData.sort(self.metaDataSorter);

        self.metaData.forEach(function(metaData, idx) {
            test.deepEqual(metaData, validTokenMetaData[idx]);
        });

        test.done();
    });
};

testModules.invalidate = {
    setUp: function(callback) {
        var self = this;
        this.tokenStore.create(function(err, token) {
            self.token = token;
            callback();
        });
    }
};
testModules.invalidate.valid = function(test) {
    var self = this;
    test.expect(5);
    this.tokenStore.isValid(this.token.val, function(err, isValid) {
        test.ok(!err, "Does not return an error");
        test.ok(isValid, "Token is initially valid");
        self.tokenStore.invalidate(self.token.val, function(err) {

            test.ok(!err, "Does not return an error");
            self.tokenStore.isValid(self.token.val, function(err, isValid) {
                test.ok(!err, "Does not return an error");
                test.ok(!isValid, "Token has been successfully invalidated");
                test.done();
            });
        });
    });
};
testModules.invalidate.invalid = function(test) {
    var self = this;
    // Create an invalid token based on the runtime-generated token
    var invalidToken = this.token.val + "differentiator";

    test.expect(5);
    this.tokenStore.isValid(invalidToken, function(err, isValid) {
        test.ok(!err, "Does not return an error");
        test.ok(!isValid, "Token is initially invalid");
        self.tokenStore.invalidate(invalidToken, function(err) {

            test.ok(!err, "Does not return an error");
            self.tokenStore.isValid(invalidToken, function(err, isValid) {
                test.ok(!err, "Does not return an error");
                test.ok(!isValid, "Token remains invalidat");
                test.done();
            });
        });
    });
};

testModules.setMeta = {
    setUp: function(callback) {
        var self = this;
        this.tokenStore.create({ oldAttr: 33 }, function(err, token) {
            self.token = token;
            callback();
        });
    }
};
testModules.setMeta.set = function(test) {
    test.expect(3);
    this.tokenStore.setMeta(this.token.val, { newAttr: 23 }, function(err, token) {
        test.ok(!err, "Does not return an error");
        test.equal(token.meta.newAttr, 23, "Correctly sets new meta data");
        test.equal(token.meta.oldAttr, 33, "Correctly returns unmodified meta data");
        test.done();
    });
};
testModules.setMeta.reset = function(test) {
    test.expect(2);
    this.tokenStore.setMeta(this.token.val, { oldAttr: 42 }, function(err, token) {
        test.ok(!err, "Does not return an error");
        test.equal(token.meta.oldAttr, 42, "Correctly re-sets existing meta data");
        test.done();
    });
};
testModules.setMeta.unknown = function(test) {
    var invalidToken = this.token.val + "differentiator";
    test.expect(2);
    this.tokenStore.setMeta(invalidToken, { j: 45 }, function(err, meta) {
        test.ok(err, "Returns an error when invalid token is specified");
        test.ok(!meta, "Does not return any meta data for invalid tokens");
        test.done();
    });
};

module.exports = testModules;
