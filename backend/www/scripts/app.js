require([
  "recording",
  "jquery",
  "socket.io"
  ], function(Recording, $, io) {

    $(function() {
        var recordings = new Recording.collection();
        var $cache = {
            statusList: $(".map-status .status"),
            body: $("body")
        };
        var socket = io.connect();
        socket.on("updateMap", function(data) {
            $cache.statusList.prepend(
                $("<li>").text(JSON.stringify(data)));
        });
        $cache.recordingList = new Recording.views.list({ collection: recordings }).$el;
        $cache.body.append($cache.recordingList);
        recordings.fetch();
    });

});
