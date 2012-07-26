(function(window) {

    // Dependencies
    var Popcorn = window.Popcorn;
    var $ = window.jQuery;

    var ecMap = window.ecMap || {};
    window.ecMap = ecMap;

    Popcorn.plugin("ecMap", function(options) {

        var self = this;
        var replayData;

        if ("replayData" in options) {
            replayData = options.replayData;
        } else if ("element" in options) {
            replayData = $.parseJSON($(options.element).text());
        }

        if (replayData) {
            Popcorn.forEach(replayData, function(data) {
                self.cue(data.timeStamp/1000, function() {
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
