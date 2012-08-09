module("liveMap.status.set", {
    setup: function() {
        this.sampleValue = {
            href: "http://fake-url.com"
        };
    },
    teardown: function() {
       liveMap.status.off("change");
       liveMap.status.reset();
    }
});

test("normal operation", 2, function() {

    var actualStatus;

    liveMap.status.set(this.sampleValue);

    actualStatus = liveMap.status.get();

    deepEqual(actualStatus, this.sampleValue,
        "Correctly stores the state and calculates totals");
    notEqual(actualStatus, this.sampleValue,
        "Returns a distinct object");
});
test("events", 1, function() {

    var self = this;
    var changeHandler = function(event, status) {
        deepEqual( status, self.sampleValue,
            "Emits a 'change' event with the expected state data");
        start();
    };
    stop();

    liveMap.status.on("change", changeHandler);

    liveMap.status.set(this.sampleValue);

    // Set without changes--these should not trigger any "change:state" events
    // or a "change" event (which QUnit confirms through this test's expected
    // assertion count)
    liveMap.status.set(this.sampleValue);
    liveMap.status.set({});
});

module("liveMap.status helpers", {
    setup: function() {
        this.sampleValue = {
            href: "http://fake-url.com"
        };
    },
    teardown: function() {
       liveMap.status.off("change");
       liveMap.status.reset();
    }
});

test("reset()", 1, function() {
    var emptyStatus = {};
    var changeHandler = function(event, status) {
        deepEqual(status, emptyStatus, "Fires a 'change' event reflecting an empty status");
        start();
    };
    stop();

    liveMap.status.set(this.sampleValue);

    liveMap.status.on("change", changeHandler);
    liveMap.status.reset();

});

test("hasChanged()", 2, function() {

    liveMap.status.set({});

    equal(liveMap.status.hasChanged(), false,
        "Returns 'false' when no change was made by previous call to 'set'");

    liveMap.status.set({ href: "http://fake-url.com" });

    equal(liveMap.status.hasChanged(), true,
        "Returns 'true' when a change was made by the previous call to 'set'");

});
