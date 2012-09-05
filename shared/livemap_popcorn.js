(function(window) {

    // Dependencies
    var Popcorn = window.Popcorn;
    var $ = window.jQuery;

    var liveMap = window.liveMap || {};
    window.liveMap = liveMap;

    // liveMap Popcorn.js scheduler
    // Allows for tying electoral map change events to a Popcorn instance.
    // Arguments:
    // - pop <Popcorn instance>: The Popcorn instance for which events should
    //   be scheduled
    // - options <object>: Specifies scheduling/playback details:
    //   - replayData <object>: An array describing a set of map change events.
    //     Specifying this value will cancel previously-set change events.
    //     Each element should be formatted as follows:
    //     {
    //       timeStamp <number>: UNIX timestamp for the event to occur, relative
    //                           to the beginning of the Popcorn instance's
    //                           timeline
    //       mapState <object>:  Describes the desired state of the map
    //     }
    //   - element <string>: A CSS selector string describing an element on the
    //     page from which to derive the replayDataa by parsing its contents as
    //     JSON.
    //     Specifying this value will cancel previously-set change events.
    //   - ignore <boolean>: A flag to control whether or not change events
    //     should effect the map. Although pausing the Popcorn instance would
    //     acheive a similar result, this is useful for allowing the user to
    //     interact with the map without effecting playback.
    liveMap.popcorn = function(pop, options) {

        var replayData;

        if ("replayData" in options) {
            replayData = options.replayData;
        } else if ("element" in options) {
            replayData = $.parseJSON($(options.element).text());
        }

        if (replayData) {

            Popcorn.forEach(replayData, function(data, idx) {

                var endTime;
                if (replayData[idx+1]) {
                    endTime = replayData[idx+1].timeStamp / 1000;
                } else  {
                    // Popcorn.duration may return 0 or NaN for YouTube videos
                    // before they have loaded. In this case, use Infinity as a
                    // stand in value to mimic the desired effect.
                    endTime = pop.duration() || Infinity;
                }

                // The Popcorn.js "code" plugin expects timestamps to be in
                // units of seconds.
                pop.code({
                    start: data.timeStamp / 1000,
                    end: endTime,
                    onStart: function() {
                        pop.emit("updateMap", data.mapState);
                    }
                });
            });
        }

        // Allow cues to be ignored so that the playback may be "silenced"
        // without effecting timing
        if (options.ignore) {
            pop.off("updateMap");
        } else {
            pop.on("updateMap", function(mapState) {
                liveMap.status.set(mapState);
            });
        }

    };

}(this));
