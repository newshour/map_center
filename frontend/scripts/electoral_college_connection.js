(function(window) {

    // Dependencies
    var io = window.io;
    var mapStatus = window.mapStatus;

    var serviceURL = "http://localhost:8000";
    var socket = io.connect(serviceURL);

    window.isBroadcaster = false;

    var broadcastChange = function(event, status) {
        // Only broadcasters should emit change events to the backend
        if (!window.isBroadcaster) {
            return;
        }

        // Prevent infinite recursion resulting from broadcasters receiving
        // change events
        if (!mapStatus.changedStates()) {
            return;
        }

        socket.emit("changeVotes", status);
    };

    mapStatus.on("change", broadcastChange);

    socket.on("changeVotes", function(data) {
        mapStatus.set(data);
    });

}(this));
