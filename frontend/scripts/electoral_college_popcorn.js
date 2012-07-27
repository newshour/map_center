(function(window) {

    // Dependencies
    var Popcorn = window.Popcorn;
    var $ = window.jQuery;

    var ecMap = window.ecMap || {};
    window.ecMap = ecMap;

    var noop = function() {};

    // ecMap Popcorn.js plugin
    // Allows for tying electoral map change events to a Popcorn instance.
    // Options:
    // - replayData <object>: An array describing a set of map change events.
    //   Specifying this value will cancel previously-set change events.
    //   Each element should be formatted as follows:
    //   {
    //     timeStamp <number>: UNIX timestamp for the event to occur, relative
    //                         to the beginning of the Popcorn instance's
    //                         timeline
    //     mapState <object>:  Describes the desired state of the map
    //   }
    // - element <string>: A CSS selector string describing an element on the
    //   page from which to derive the replayDataa by parsing its contents as
    //   JSON.
    //   Specifying this value will cancel previously-set change events.
    // - ignore <boolean>: A flag to control whether or not change events
    //   should effect the map. Although pausing the Popcorn instance would
    //   acheive a similar result, this is useful for allowing the user to
    //   interact with the map without effecting playback.
    Popcorn.plugin("ecMap", function(options) {

        var self = this;
        var replayData;

        // Ensure that this instance has a namespace in its data object for the
        // plugin
        if (!this.data.ecMap) {
            this.data.ecMap = {};
        }

        // Ensure that this instance has an array to track cues
        if (!this.data.ecMap.cueIDs) {
            this.data.ecMap.cueIDs = [];
        }

        if ("replayData" in options) {
            replayData = options.replayData;
        } else if ("element" in options) {
            replayData = $.parseJSON($(options.element).text());
        }

        if (replayData) {

            // Cancel any previously-created cues
            Popcorn.forEach(this.data.ecMap.cueIDs, function(cueID) {
                self.cue(cueID, -1);
            });
            this.data.ecMap.cueIDs.length = 0;

            Popcorn.forEach(replayData, function(data, idx) {

                var cueID = "ecMapCue" + idx;

                self.data.ecMap.cueIDs.push(cueID);

                self.cue(cueID, data.timeStamp/1000);
                self.cue(cueID, function() {
                    self.emit("changeVotes", data.mapState);
                });
            });
        }

        // Allow cues to be ignored so that the playback may be "silenced"
        // without effecting timing
        if (options.ignore) {
            self.off("changeVotes");
        } else {
            self.on("changeVotes", function(mapState) {
                ecMap.status.set(mapState);
            });
        }

        // All Popcorn plugins must define 'start' and 'end' methods. These are
        // not necessary for this plugin, so set them as noops
        return {
            start: noop,
            end: noop
        };
    });

}(this));
