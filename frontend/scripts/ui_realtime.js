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

    function updateIframe(status) {
        if (status.href !== "unavailable") {
            $("#live-map-frame").attr("src", status.href);
        } else {
            $("#live-map-frame").attr("src", "about:blank");
        }
    }

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

        $("#map svg").click(function() {
            // attach map click handlers
            $ui.buttons.showLive.show();
            $ui.status.text("Now editing.");
            connection.off("updateMap", liveMap.status.set);

            liveMap.popcorn(popcorn, {
                ignore: true
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

        $ui.buttons.start.on("click", function() {
            $ui.buttons.start.hide();
            $ui.buttons.stop.show();
            $("#frame-options").on("click.broadcast", "a", function(event) {
                connection.emit("updateMap", {
                    href: $(event.target).attr("href")
                });
            });
        });
        $ui.buttons.stop.on("click", function() {
            $ui.buttons.stop.hide();
            $ui.buttons.start.show();

            $("#frame-options").off("click.broadcast");
        });

        // TODO: Extend liveMap.connection API so that the service location may
        // be derived at run time
        var linkHtml = $.map(authServices, function(authService) {
            return "<a href='http://127.0.0.1:8000/auth/" +
                authService.toLowerCase() + "'>Login with " +
                authService + "</a>";
        }).join(" | ");

        $ui.loginOptions.append($(linkHtml)).prependTo(document.body);

        // Send status messages as frame updates
        $('#live-map-frame').load(function() {
            try {
                var subWindow = this.contentWindow;
                var frameLocation = subWindow.location.href;
                if (frameLocation) {
                    liveMap.status.set({
                        href: subWindow.location.href
                    });
                    // Bind hashchange event so we can still pick
                    // it up
                    $(subWindow.document).ready(function() {
                        if ('onhashchange' in subWindow) {
                            $(subWindow).bind('hashchange', function() {
                                liveMap.status.set({
                                    href: subWindow.location.href
                                });
                            });
                        }
                    });
                } else {
                    // Chrome doesn't actually throw anything and just
                    // sets frameLocation to undefined, so we need to
                    // check for that and throw something (_anything_)
                    // ourselves to trigger the catch block below.
                    throw true;
                }
            } catch(e) {
                // liveMap.status.set({
                //     href: "unavailable"
                // });

                // Do nothing
            }
        });

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

        // Change iframe URL whenever a link gets clicked
        $("#frame-options").on("click", "a", function(event) {
            liveMap.status.set({
                href: $(event.target).attr("href")
            });
            event.preventDefault();
        });

        liveMap.status.on("change", function(event, status) {
            updateIframe(status);
        });

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
