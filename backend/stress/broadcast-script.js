// Simple script to automate broadcasts for consistency across tests. Intended
// be run in a web browser as an authenticated broadcaster.

var idx;
var connection = new liveMap.Connection();
var urls = [
        "http://localhost/?pbs",
        "http://localhost/?bocoup",
        "http://localhost/?nodejs",
        "http://localhost/?redis",
        "http://localhost/?socket.io"
    ];

connection.connect();

function runTrial(broadcastCount, delay, callback) {
    for (idx = 0; idx < broadcastCount; ++idx) {
        (function(idx) {
            setTimeout(function() {
                var url = urls[idx % urls.length];
                console.log(idx + ": " + url);
                connection.emit("updateMap", {
                    href: url
                });
                if (idx === broadcastCount - 1) {
                    setTimeout(callback, delay)
                }
            }, idx*delay);
        }(idx));
    }
}

runTrial(10, 5000, function() {
    runTrial(10, 2000, function() {
        runTrial(10, 1000);
    });
});
