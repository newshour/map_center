module("liveMap.status.set", {
    setup: function() {
        this.sampleValue = {
            href: "http://fake-url.com"
        };
        this.sampleValue2 = {
            href: "http://even-more-fake-url.com"
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
test("events", 4, function() {

    var self = this;
    // Scope the expected status outside of the change handler so that the same
    // change handler can be used to test different change events
    var expectedStatus;
    var changeHandler = function(event, status) {
        ok(liveMap.status.hasChanged(),
            ".hasChanged() always returns true in the change handler");
        deepEqual( status, expectedStatus,
            "Emits a 'change' event with the expected state data");
    };

    liveMap.status.on("change", changeHandler);

    expectedStatus = this.sampleValue;
    liveMap.status.set(this.sampleValue);

    // Set without changes--these should not trigger any "change:state" events
    // or a "change" event (which QUnit confirms through this test's expected
    // assertion count)
    liveMap.status.set(this.sampleValue);
    liveMap.status.set({});

    expectedStatus = this.sampleValue2;
    liveMap.status.set(this.sampleValue2);
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
