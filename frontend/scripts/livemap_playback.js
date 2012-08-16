(function(window, undefined) {

    // Dependencies
    var Popcorn = window.Popcorn;
    var $ = window.jQuery;

    var liveMap = window.liveMap || {};
    window.liveMap = liveMap;

    // By hard-coding these selectors, new playback pages can be created
    // without additional scripting. These pages simply need to contain
    // elements for media, JSON, and a map container iFrame.
    var selectors = {
        media: "#live-map-media",
        json: "#live-map-data",
        iframe: "#live-map-frame"
    };

    $(function() {

        var pop, $ifr, $media;

        $ifr = $(selectors.iframe);
        $media = $(selectors.media);

        if (!$ifr.length || !$media.length) {

            if (!$ifr.length) {
                console.error("Replay iFrame element not found (expected at selector '" +
                    selectors.iframe + "'");
            }

            if (!$media.length) {
                console.error("Replay media element not found (expected at selector '" +
                    selectors.media + "'");
            }

            return;
        }

        pop = new Popcorn($media.get(0));

        liveMap.popcorn(pop, {
            element: selectors.json
        });

        liveMap.status.on("change", function(event, mapStatus) {
            $ifr.attr("src", mapStatus.href);
        });
    });

}(this));
