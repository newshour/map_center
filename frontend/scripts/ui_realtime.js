// Temporary UI to demonstrate connection API and test broadcast behavior
// A back-end connection will only be made if the URL contains the
// "networked" query string parameter. If that parameter's value is
// "broadcaster", the UI for toggling broadcaster status will be displayed
(function(window, undefined) {

    // Dependencies
    var $ = window.$;
    var Popcorn = window.Popcorn;
    var liveMap = window.liveMap;

    var connection = new liveMap.Connection();
    var urlMatch;

    function unavailableHandler(event) {
        $("#backend-controls").show();
        $("#sidebar").append("<strong>Service unavailable.</strong>");
    }

    function availableHandler() {

        var $sidebar = $("#sidebar");

        $("#backend-controls").show();

        connection.off("error", unavailableHandler);
        connection.off("connect", availableHandler);

        // Do not create the broadcaster control UI if the matched pattern does
        // not contain the string "broadcaster"
        if (urlMatch[1] === "broadcaster") {
            $sidebar.append(createBroadcasterUI());
        } else {
            $sidebar.append(createConsumerUI());
        }
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
            connection.on("updateMap", liveMap.status.set);

            liveMap.popcorn(popcorn, {
                ignore: false
            });
        });

        connection.on("reconnecting", function() {
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
        connection.on("replay", function(replayInfo) {

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

        connection.on("reconnect_failed", function() {
            $ui.status
                .css("color", "#a00")
                .text("Unable to reconnect.");
        });
        connection.on("connect", function() {
            $ui.status
                .css("color", "#000")
                .text("Connected!");
        });

        $ui.buttons.showLive.trigger("click");

        return $ui.container;
    }

    // Create the broadcaster control UI
    function createBroadcasterUI() {

        var authServices = ["Twitter", "Google"];
        var $ui = {
            container: $("<div class='broadcast-control'>"),
            status: $("<span>"),
            buttons: {
                start: $("<button class='broadcast-start'>Start Broadcasting</button>"),
                stop: $("<button class='broadcast-stop'>Stop Broadcasting</button>")
            },
            loginOptions: $("<div>").addClass("broadcaster-login")
        };

        $ui.container.append($ui.status, $ui.buttons.start, $ui.buttons.stop);
        $ui.buttons.stop.hide();

        function emitUpdate(event, status) {
            connection.emit("updateMap", status);
        }
        $ui.buttons.start.on("click", function() {
            $ui.buttons.start.hide();
            $ui.buttons.stop.show();

            liveMap.status.on("change", emitUpdate);
        });
        $ui.buttons.stop.on("click", function() {
            $ui.buttons.stop.hide();
            $ui.buttons.start.show();

            liveMap.status.off("change", emitUpdate);
        });

        // Generate hyperlinks to backend OAuth services. Derive the URL from
        // the socket connection's host and port.
        var linkHtml = $.map(authServices, function(authService) {
            return "<a href='http://" + connection.getHost() + ":" +
                connection.getPort() + "/auth/" +
                authService.toLowerCase() + "'>Login with " +
                authService + "</a>";
        }).join(" | ");

        $ui.loginOptions.append($(linkHtml)).prependTo(document.body);

        connection.on("updateMap", liveMap.status.set);
        connection.on("reconnecting", function() {
            $ui.status
                .css("color", "#a00")
                .text("Connection lost. Reconnecting...");
        });
        connection.onBroadcaster("connect_failed", function(message) {
            if (message === "unauthorized") {
                $ui.buttons.stop.hide();
                $ui.buttons.start.hide();
                $ui.status
                    .css("color", "#a00")
                    .text("Failed to authenticate as a broadcaster.");
            }
        });
        connection.on("reconnect_failed", function() {
            $ui.status
                .css("color", "#a00")
                .text("Unable to reconnect.");
        });
        connection.on("connect", function() {
            $ui.status
                .css("color", "#000")
                .text("Connected!");
        });

        return $ui.container;
    }

    $(function() {

        urlMatch = window.location.search.match(/(?:^\?|&)networked(?:=([^&]+))?(&|$)/i);

        // When we click the .big-red-button, send out the next update.
        var $broadcasterQueued = $('#broadcaster-queued');
        var $broadcasterQueueForm = $('#broadcaster-queue');
        function fireNextChange(event) {
            liveMap.status.set({
                href: $broadcasterQueued.val()
            });
            event.preventDefault();
        }
        $broadcasterQueueForm.submit(fireNextChange);

        // Do not initiate a connection if the pattern does not match
        if (!urlMatch) {
            return;
        }

        connection.on("error", unavailableHandler);
        connection.on("connect", availableHandler);

        // Initiate a connection
        connection.connect();

    });
}(this));
