module("ecMap.status", {
    setup: function() {
        this.status = ecMap.status;
    },
	teardown: function() {
	}
});

test("set()", 4, function() {

    var newValue = {
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
    var expectedStatus = $.extend(true, {}, newValue, {
        totals: {
            dem: 4,
            rep: 2,
            toss: 4
        }
    });
    var handlers = {
        change: function(event, status) {
            deepEqual( status, expectedStatus,
                "Emits a 'change' event with the expected state data");
        },
        stateChange: function(event, status) {
            var stateName = status.name;
            delete status.name;
            deepEqual( newValue.stateVotes[stateName], status,
                "Emits a 'change:state' event for each state");
        }
    };
    var actualStatus;

    this.status.on("change", handlers.change);
    this.status.on("change:state", handlers.stateChange);

    this.status.set(newValue);

    actualStatus = this.status.get();

    deepEqual(actualStatus, expectedStatus, "Correctly stores the state and calculates totals");

    // Clean up
    this.status.off("change");
    this.status.off("change:state");
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

    this.status.set({});

    equal(this.status.changedStates(), false,
        "Returns 'false' when no change was made by previous call to 'set'");

    this.status.set({ stateVotes: toChange });

    deepEqual(this.status.changedStates(), toChange,
        "Returns the changed data when a change was made by the previous call to 'set'");

    this.status.set({ stateVotes: toChange });

    equal(this.status.changedStates(), false,
        "Returns 'false' when no change was made by previous call to 'set'");

    $.extend(true, toChange, toAdd);

    this.status.set({ stateVotes: toChange });

    deepEqual(this.status.changedStates(), toAdd,
        "Returns only the changed data when a change was made by the previous call to 'set'");
});
