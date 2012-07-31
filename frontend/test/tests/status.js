module("liveMap.status.set", {
    setup: function() {
        this.sampleValue = {
            year: 1986,
            stateVotes: {
                Massachusetts: {
                    dem: 3,
                    rep: 0,
                    toss: 1
                },
                Pennsylvania: {
                    dem: 1,
                    rep: 2,
                    toss: 3
                }
            }
        };
        this.expectedStatus = $.extend(true, {}, this.sampleValue, {
            totals: {
                dem: 4,
                rep: 2,
                toss: 4
            }
        });
    },
    teardown: function() {
       liveMap.status.off("change");
       liveMap.status.off("change:state");
       liveMap.status.reset();
    }
});

test("normal operation", 2, function() {

    var actualStatus;

    liveMap.status.set(this.sampleValue);

    actualStatus = liveMap.status.get();

    deepEqual(actualStatus, this.expectedStatus,
        "Correctly stores the state and calculates totals");
    notEqual(actualStatus, this.expectedStatus,
        "Returns a distinct object");
});
test("events", 5, function() {

    var self = this;
    // The status to expect in the "change" event handler
    var expectedStatus;
    var extraStates = {
        Georgia: {
            dem: 0,
            rep: 1,
            toss: 3
        }
    };
    var handlers = {
        change: function(event, status) {
            deepEqual( status, expectedStatus,
                "Emits a 'change' event with the expected state data");
        },
        stateChange: function(event, status) {
            var stateName = status.name;
            delete status.name;
            deepEqual( self.expectedStatus.stateVotes[stateName], status,
                "Emits a 'change:state' event for each state (" +stateName+ ")");
        }
    };

    liveMap.status.on("change", handlers.change);
    liveMap.status.on("change:state", handlers.stateChange);

    expectedStatus = this.expectedStatus;
    liveMap.status.set(this.sampleValue);

    expectedStatus = $.extend(true, expectedStatus, {
        stateVotes: extraStates,
        totals: {
            rep: 3,
            toss: 7
        }
    });
    liveMap.status.set({ stateVotes: extraStates });

    // Set without changes--these should not trigger any "change:state" events
    // or a "change" event (which QUnit confirms through this test's expected
    // assertion count)
    liveMap.status.set({ stateVotes: extraStates });
    liveMap.status.set({ stateVotes: {} });
});

module("liveMap.status helpers");

test("reset()", 6, function() {
    var newValue = {
        year: 1999,
        stateVotes: {
            Massachusetts: {
                dem: 11,
                rep: 12,
                toss: 13
            },
            Nebraska: {
                dem: 21,
                rep: 22,
                toss: 23
            }
        }
    };
    var emptyStatus = {
        stateVotes: {},
        totals: {
            rep: 0,
            dem: 0,
            toss: 0
        }
    };
    var handlers = {
        change: function(event, status) {
            deepEqual(status, emptyStatus, "Fires a 'change' event reflecting an empty status");
        },
        stateChange: function(event, status) {
            deepEqual( status, {
                name: status.name,
                dem: 0,
                rep: 0,
                toss: 0
            }, "Fires a 'change' event for each state that had previously been set");
        }
    };
    var stateCount = 0;

    liveMap.status.set(newValue);

    liveMap.status.on("change", handlers.change);
    liveMap.status.on("change:state", handlers.stateChange);
    liveMap.status.reset();

    ok(!liveMap.status.get().year, "Unsets the year");
    $.each(liveMap.status.get().stateVotes, function(stateName, votes) {
        stateCount++;
    });
    equal(stateCount, 0, "Unsets all states");

    liveMap.status.off("change");
    liveMap.status.off("change:state");

    // Ensure that "change" fires even when only states change (and not the
    // year)
    delete newValue.year;
    liveMap.status.set(newValue);

    liveMap.status.on("change", handlers.change);
    liveMap.status.reset();

    liveMap.status.off("change");
});

test("changedStates()", 4, function() {

    var toChange = {
        California: {
            toss: 23
        }
    };
    var toAdd = {
        Wyoming: {
            rep: 10
        }
    };

    liveMap.status.set({});

    equal(liveMap.status.changedStates(), false,
        "Returns 'false' when no change was made by previous call to 'set'");

    liveMap.status.set({ stateVotes: toChange });

    deepEqual(liveMap.status.changedStates(), toChange,
        "Returns the changed data when a change was made by the previous call to 'set'");

    liveMap.status.set({ stateVotes: toChange });

    equal(liveMap.status.changedStates(), false,
        "Returns 'false' when no change was made by previous call to 'set'");

    $.extend(true, toChange, toAdd);

    liveMap.status.set({ stateVotes: toChange });

    deepEqual(liveMap.status.changedStates(), toAdd,
        "Returns only the changed data when a change was made by the previous call to 'set'");
});
