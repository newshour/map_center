var BroadcastSchedule = require("../broadcastSchedule");
var testDB = 2;
var testModules = {};

testModules.create = {
    setUp: function(callback) {
        this.schedule = new BroadcastSchedule({
            db: testDB
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
            timeStamp: 222,
            duration: 222
        };
        var self = this;
        this.schedule = new BroadcastSchedule({
            db: testDB
        });
        this.schedule.create(eventData, function(err, newEvent) {

            self.newEvent = newEvent;
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
testModules.get.normalCase = function(test) {
    var self = this;
    test.expect(4);
    this.schedule.get(this.newEvent.id, function(err, event) {
        test.ok(!err, "Request completes successfully");
        test.equal(self.newEvent.id, event.id,
            "The retrieved event has the correct ID");
        test.equal(self.newEvent.timeStamp, event.timeStamp,
            "The retrieved event has the correct timeStamp");
        test.equal(self.newEvent.duration, event.duration,
            "The retrieved event has the correct duration");
        test.done();
    });
};

testModules.getReplaysByRecordingID = {
    setUp: function(callback) {
        var eventData = {
            type: "record",
            timeStamp: 200,
            duration: 200
        };
        var self = this;
        var replayEvents = new Array(10);
        this.schedule = new BroadcastSchedule({
            db: testDB
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
                    timeStamp: (recordingEvent.duration + 100) * idx
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

testModules.getReplaysByRecordingID.normalCase = function(test) {
    test.expect(2);
    this.schedule.getReplaysByRecordingID(this.recordingEvent.id, function(err, replays) {
        test.ok(!err, "Does not return an error");
        test.equal(replays.length, 12,
            "Retrieves the correct number of replay events");
        test.done();
    });
};

module.exports = testModules;
