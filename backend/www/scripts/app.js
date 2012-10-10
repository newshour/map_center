require([
  "recording",
  "auth",
  "jquery",
  "socket.io"
  ], function(Recording, Auth, $, io) {

    $(function() {
        var recordings = new Recording.collection();
        var $cache = {
            statusList: $(".map-status .status"),
            clientCount: $(".client-monitor .count"),
            clientCountTimestamp: $(".client-monitor .timestamp"),
            body: $("body")
        };
        var socket = io.connect();
        socket.on("updateMap", function(data) {
            $cache.statusList.prepend(
                $("<li>").text(JSON.stringify(data)));
        });
        socket.of("/broadcaster").on("clientCount", function(count) {
            var dateStr = new Date().toString();

            // Remove extraneous time zone information.
            // TODO: Use more readable formatting, possibly with moment.js
            // library
            dateStr = dateStr.replace(/[A-Z]{3}.*$/, "");
            $cache.clientCount.text(count);
            $cache.clientCountTimestamp.text(dateStr);
        });
        $cache.recordingList = new Recording.views.list({ collection: recordings }).$el;
        $cache.body.append($cache.recordingList);
        $cache.body.append(new Auth.views.loginForm().el);
        recordings.fetch();
    });

});
