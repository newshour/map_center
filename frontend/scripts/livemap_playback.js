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

        var pop, $ifr;

        pop = new Popcorn(selectors.media);
        $ifr = $(selectors.iframe);

        liveMap.popcorn(pop, {
            element: selectors.json
        });

        liveMap.status.on("change", function(event, mapStatus) {
            $ifr.attr("src", mapStatus.href);
        });
    });

}(this));
