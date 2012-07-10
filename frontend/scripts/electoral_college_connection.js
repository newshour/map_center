(function(window) {

    // Dependencies
    var io = window.io;
    var ecMap = window.ecMap || {};
    window.ecMap = ecMap;
    var connection = ecMap.connection = {};

    var serviceURL = "http://localhost:8000";
    var socket = io.connect(serviceURL);

    var isBroadcaster = false;

    connection.broadcastChange = function(event, status) {
        // Only broadcasters should emit change events to the backend
        if (!isBroadcaster) {
            return;
        }

        // Prevent infinite recursion resulting from broadcasters receiving
        // change events
        if (!ecMap.status.changedStates()) {
            return;
        }

        socket.emit("changeVotes", status);
    };
    connection.setBroadcaster = function(val) {
        isBroadcaster = !!val;
    };

    ecMap.status.on("change", connection.broadcastChange);

    socket.on("changeVotes", function(data) {
        ecMap.status.set(data);
    });

}(this));
