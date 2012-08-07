var BroadcastSchedule = require("../broadcastSchedule");
var testDbId = 2;
var testModules = {};

testModules.create = {
    setUp: function(callback) {
        this.schedule = new BroadcastSchedule({
            db: testDbId
        });
        callback();
    },
    tearDown: function(callback) {
        var self = this;
        this.schedule.clear(function() {
            self.schedule.quit(callback);
        });
    }
};
testModules.create.normalCase = function( test ) {
    var eventData = {
        timeStamp: 2000,
        duration: 200
    };
    test.expect(4);
    this.schedule.create(eventData, function(err, newEvent) {
        test.ok(!err, "Creating a new event does not generate an error");
        test.equal(eventData.timeStamp, newEvent.timeStamp,
            "The created event has the correct timeStamp");
        test.equal(eventData.duration, newEvent.duration,
            "The created event has the correct duration");
        test.ok("id" in eventData, "Assigns an ID to the event");
        test.done();
    });
};
testModules.create.invalidReplay = function( test ) {
    var eventData = {
        type: "replay"
    };
    test.expect(2);
    this.schedule.create(eventData, function(err, newEvent) {
        test.ok(err, "Creating a replay event without a recording ID generates an error");
        test.ok(!newEvent, "No event is created");
        test.done();
    });
};

testModules.get = {
    setUp: function(callback) {
        var eventData = {
            type: "record",
            timeStamp: 200,
            duration: 200
        };
        var self = this;
        var replayEvents = new Array(10);
        this.schedule = new BroadcastSchedule({
            db: testDbId
        });
        this.schedule.create(eventData, function(err, recordingEvent) {
            var replaysToCreate = 12;
            // Each replay event needs to be created individually. Use the
            // replaysToCreate value to track when they have all been created
            // and the setup function is complete
            var replayCreatedHandler = function(err, replay) {
                replaysToCreate--;
                if (replaysToCreate === 0) {
                    callback();
                }
            };
            self.recordingEvent = recordingEvent;
            for (var idx = 0; idx < replaysToCreate; ++idx) {
                self.schedule.create({
                    type: "replay",
                    recordingID: recordingEvent.id,
                    timeStamp: recordingEvent.timeStamp +
                        ((recordingEvent.duration + 100) * (idx + 1))
                }, replayCreatedHandler);
            };
        });
    },
    tearDown: function(callback) {
        var self = this;
        this.schedule.clear(function() {
            self.schedule.quit(callback);
        });
    }
};
testModules.get.byID = function(test) {
    var self = this;
    test.expect(4);
    this.schedule.get(this.recordingEvent.id, function(err, event) {
        test.ok(!err, "Request completes successfully");
        test.equal(self.recordingEvent.id, event.id,
            "The retrieved event has the correct ID");
        test.equal(self.recordingEvent.timeStamp, event.timeStamp,
            "The retrieved event has the correct timeStamp");
        test.equal(self.recordingEvent.duration, event.duration,
            "The retrieved event has the correct duration");
        test.done();
    });
};

testModules.get.replaysByRecordingID = function(test) {
    test.expect(2);
    this.schedule.getReplaysByRecordingID(this.recordingEvent.id, function(err, replays) {
        test.ok(!err, "Does not return an error");
        test.equal(replays.length, 12,
            "Retrieves the correct number of replay events");
        test.done();
    });
};

testModules.get.byTimeBetween = function(test) {
    var options = {
        lowerTimestamp: 1100,
        upperTimestamp: 1700
    };
    test.expect(2);
    this.schedule.getByTime(options, function(err, events) {

        test.ok(!err, "Does not return an error");
        test.equal(events.length, 3,
            "Returns all events within the specified interval");
        test.done();
    });
};

testModules.get.byTimeAfter = function(test) {
    var options = {
        lowerTimestamp: 1400
    };
    test.expect(2);
    this.schedule.getByTime(options, function(err, events) {

        test.ok(!err, "Does not return an error");
        test.equal(events.length, 9,
            "Returns all events after the lower time stamp");
        test.done();
    });
};

testModules.get.byTimeBefore = function(test) {
    var options = {
        upperTimestamp: 1400
    };
    test.expect(2);
    this.schedule.getByTime(options, function(err, events) {

        test.ok(!err, "Does not return an error");
        test.equal(events.length, 5,
            "Returns all events before the upper time stamp");
        test.done();
    });
};

testModules.get.byTimeAll = function(test) {
    var options = {};
    test.expect(2);
    this.schedule.getByTime(options, function(err, events) {

        test.ok(!err, "Does not return an error");
        test.equal(events.length, 13,
            "Returns all events");
        test.done();
    });
};

testModules.get.byTimeExpanded = function(test) {
    var self = this;
    var options = {
        expandReplays: true
    };
    test.expect(14);
    this.schedule.getByTime(options, function(err, events) {

        test.ok(!err, "Does not return an error");
        test.equal(events.length, 13,
            "Returns all events");
        events.forEach(function(event) {
            if (event.type === "replay") {
                test.equal(event.duration, self.recordingEvent.duration,
                    "Expands replay events with duration of associated recording");
            }
        });
        test.done();
    });
};

testModules.update = {
    setUp: function(callback) {

        var self = this;
        var eventData = {
            timeStamp: 2000,
            duration: 200
        };

        this.schedule = new BroadcastSchedule({
            db: testDbId
        });

        this.schedule.create(eventData, function(err, newEvent) {

            self.recordingEvent = newEvent;
            callback();
        });
    },
    tearDown: function(callback) {
        var self = this;
        this.schedule.clear(function() {
            self.schedule.quit(callback);
        });
    }
};
testModules.update.normalCase = function( test ) {

    var self = this;
    var newTimestamp = this.recordingEvent.timeStamp + 654321;
    var newParams = {
        id: this.recordingEvent.id + 1,
        duration: this.recordingEvent.duration + 123456,
        timeStamp: newTimestamp
    };

    test.expect(2);

    this.schedule.update(this.recordingEvent.id, newParams, function(err, event) {

        test.ok(!err, "Does not return an error");
        test.notEqual(event.id, self.recordingEvent.id,
            "Does not modify ID even when specified");

        test.done();
    });
};

testModules.del = {
    setUp: function(callback) {

        var self = this;
        var eventData = {
            duration: 23,
            timeStamp: 45
        };

        this.schedule = new BroadcastSchedule({
            db: testDbId
        });

        this.schedule.create(eventData, function(err, newEvent) {
            self.recordingEvent = newEvent;
            callback();
        });
    },
    tearDown: function(callback) {

        var self = this;

        this.schedule.clear(function() {
            self.schedule.quit(callback);
        });
    }
};

testModules.del.normalCase = function(test) {

    var self = this;

    test.expect(2);
    this.schedule.del(this.recordingEvent.id, function(err) {
        test.ok(!err, "Does not return an error");
        self.schedule.get(self.recordingEvent.id, function(err, event) {

            test.ok(!err && !event,
                "Successfully returns nothing after deletion");
            test.done();
        });
    });
};

module.exports = testModules;
