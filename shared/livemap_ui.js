// Temporary UI to demonstrate connection API and test broadcast behavior
// A back-end connection will only be made if the URL contains the
// "networked" query string parameter. If that parameter's value is
// "broadcaster", the UI for toggling broadcaster status will be displayed
(function(window, undefined) {

    // Dependencies
    var $ = window.$;
    var Popcorn = window.Popcorn;
    var liveMap = window.liveMap || {};
    window.liveMap = liveMap;

    function unavailableHandler(event) {
        event.data.$sidebar.append("The backend is not available at the moment.");
    }

    function availableHandler(event) {

        var $sidebar = event.data.$sidebar;

        liveMap.connection.off("error", unavailableHandler);
        liveMap.connection.off("connect", availableHandler);

        // Do not create the broadcaster control UI if the matched pattern does
        // not contain the string "broadcaster"
        if (event.data.match[1] === "broadcaster") {
            $sidebar.append(createBroadcasterUI());
        } else {
            $sidebar.append(createConsumerUI());
        }

        // Namespace the handler so it can be unbound on user
        // interaction without affecting other handlers
        liveMap.connection.on("updateMap.updateGUI", function(event, mapState) {

            liveMap.status.set(mapState);
        });
    }

    function createConsumerUI() {

        var $ui = {
            container: $("<div class='consumer-control'>"),
            status: $("<span class='status'></span>"),
            buttons: {
                showLive: $("<button>Connect LIVE to PBS</button>")
            }
        };
        var popcorn;

        Popcorn.player("baseplayer");
        popcorn = Popcorn.baseplayer("body");

        $ui.container.append($ui.status, $ui.buttons.showLive);

        $ui.buttons.showLive.click(function() {
            // detach map click handlers
            $ui.buttons.showLive.hide();
            $ui.status.text("Now showing live from PBS!");

            liveMap.popcorn(popcorn, {
                ignore: false
            });
        });

        $("#map svg").click(function() {
            // attach map click handlers
            $ui.buttons.showLive.show();
            $ui.status.text("Now editing.");
            liveMap.connection.off(".updateGUI");

            liveMap.popcorn(popcorn, {
                ignore: true
            });
        });

        liveMap.connection.on("reconnecting", function() {
            $ui.status
                .css("color", "#a00")
                .text("Connection lost. Reconnecting...");
        });

        // This handler simulates a re-broadcast of previously-recorded
        // events. A simpler implementation would involve the backend
        // re-broadcasting recorded events in real time. Under that
        // approach, the following client-side logic would be unecessary
        // since clients would not need to differentiate between live
        // broadcasts and re-broadcasts of recorded events.
        liveMap.connection.on("replay", function(event, replayInfo) {

            var relativeReplayData = [];

            // Create a set of map event cues for every future replay
            Popcorn.forEach(replayInfo.startTimes, function(startTime) {

                var delta = replayInfo.currentTime - startTime;

                // Modify each change event to be relative to the time the
                // recording was transmitted. Ignore those events that took
                // place before this time
                Popcorn.forEach(replayInfo.recording, function(changeEvent) {

                    // Clone the original event data so that it can be
                    // modified for each replay
                    var cloned = $.extend(true, {}, changeEvent);
                    cloned.timeStamp -= delta;
                    if (cloned.timeStamp >= 0) {
                        relativeReplayData.push(cloned);
                    }
                });

            });

            liveMap.popcorn(popcorn, {
                replayData: relativeReplayData
            });

            popcorn.play(0);
        });

        liveMap.connection.on("reconnect_failed", function() {
            $ui.status
                .css("color", "#a00")
                .text("Unable to reconnect.");
        });
        liveMap.connection.on("connect", function() {
            $ui.status
                .css("color", "#000")
                .text("Connected!");
        });

        $ui.buttons.showLive.trigger("click");

        return $ui.container;
    }

    // Create the broadcaster control UI
    function createBroadcasterUI() {

        var $ui = {
            container: $("<div class='broadcast-control'>"),
            status: $("<span>"),
            buttons: {
                start: $("<button class='broadcast-start'>Start Broadcasting</button>"),
                stop: $("<button class='broadcast-stop'>Stop Broadcasting</button>")
            }
        };

        $ui.container.append($ui.status, $ui.buttons.start, $ui.buttons.stop);
        $ui.buttons.stop.hide();

        $ui.buttons.start.click(function() {
            $ui.buttons.start.hide();
            $ui.buttons.stop.show();
            liveMap.connection.startBroadcast();
        });
        $ui.buttons.stop.click(function() {
            $ui.buttons.stop.hide();
            $ui.buttons.start.show();
            liveMap.connection.stopBroadcast();
        });

        liveMap.connection.on("reconnecting", function() {
            $ui.status
                .css("color", "#a00")
                .text("Connection lost. Reconnecting...");
        });
        liveMap.connection.on("reconnect_failed", function() {
            $ui.status
                .css("color", "#a00")
                .text("Unable to reconnect.");
        });
        liveMap.connection.on("connect", function() {
            $ui.status
                .css("color", "#000")
                .text("Connected!");
        });

        return $ui.container;
    }

    $(window.document).ready(function() {

        var eventData = {
            match: window.location.search.match(/(?:^\?|&)networked(?:=([^&]+))?(&|$)/i),
            $sidebar: $("#sidebar")
        };

        // Do not initiate a connection if the pattern does not match
        if (!eventData.match) {
            return;
        }

        liveMap.connection.on("error", eventData, unavailableHandler);
        liveMap.connection.on("connect", eventData, availableHandler);

        // Initiate a connection
        liveMap.connection.init();

    });
}(this));
