var httpServer = require("http").createServer();

var broadcast = require("../broadcast");
var BroadcastSchedule = require("../BroadcastSchedule");
var testDbId = 2;
var broadcastSchedule = new BroadcastSchedule({
    db: testDbId
});
var testModules = module.exports = {};

broadcast.initialize(httpServer, broadcastSchedule);

testModules.setUp = function(callback) {

    var self = this;
    var eventData = {
        type: "record",
        timeStamp: 2000,
        duration: 200
    };

    broadcastSchedule.create(eventData, function(err, recordingEvent) {

        self.recordingEvent = recordingEvent;

        broadcastSchedule.create({
            type: "replay",
            recordingID: recordingEvent.id,
            timeStamp: recordingEvent.timeStamp + 3000
        }, function(err, replayEvent) {
            self.replayEvent = replayEvent;
            callback();
        });
    });
};

testModules.tearDown = function(callback) {
    broadcastSchedule.clear(callback);
};

testModules.generateHandlers = {};

testModules.generateHandlers.offAir = function(test) {

    test.expect(3);

    broadcast.handlerGenerators.offAir(null, function(err, handlers) {

        test.ok(!err, "Does not return an error.");
        test.equal(null, handlers.onConnection,
            "Returns null in place of the onConnection handler");
        test.equal(null, handlers.onUpdateMap,
            "Returns null in place of the onUpdateMap handler");
        test.done();
    });
};

testModules.generateHandlers.replay = function(test) {

    test.expect(3);

    broadcast.handlerGenerators.replay(this.replayEvent, function(err, handlers) {

        test.ok(!err, "Does not return an error.");
        test.equal("function", typeof handlers.onConnection,
            "Returns a function for the onConnection handler");
        test.equal(null, handlers.onUpdateMap,
            "Returns null in place of the onUpdateMap handler");
        test.done();
    });
};

testModules.generateHandlers.recording = function(test) {

    test.expect(3);

    broadcast.handlerGenerators.recording(this.recordingEvent, function(err, handlers) {

        test.ok(!err, "Does not return an error.");
        test.equal("function", typeof handlers.onConnection,
            "Returns a function for the onConnection handler");
        test.equal("function", typeof handlers.onUpdateMap,
            "Returns a function for the onUpdateMap handler");
        test.done();
    });
};
