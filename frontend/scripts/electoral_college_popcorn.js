(function(window) {

    // Dependencies
    var Popcorn = window.Popcorn;
    var $ = window.jQuery;

    var ecMap = window.ecMap || {};
    window.ecMap = ecMap;

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

        return {
            start: function() {},
            end: function() {}
        };
    });

}(this));
