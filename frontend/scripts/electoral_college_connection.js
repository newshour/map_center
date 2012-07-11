(function(window) {

    // Dependencies
    var io = window.io;
    var $ = window.jQuery;
    var ecMap = window.ecMap || {};
    window.ecMap = ecMap;
    var connection = ecMap.connection = {};

    var eventBus = $("<div>");
    var socket = new io.Socket({
        host: "localhost",
        port: 8000,
        // The connection status will be managed elsewhere. This allows the
        // script to be included without necessarily incurring the network
        // overhead of establishing a connection.
        "auto connect": false
    });

    // Forward the following socket.io events for use by the UI. These events
    // are described below
    $.each(["connect", "connecting", "disconnect", "connect_failed", "error",
        "reconnect", "reconnecting", "reconnect_failed"],
        function(idx, eventName) {
            socket.on(eventName, function() { eventBus.trigger(eventName); });
        });

    // _broadcastChange
    // Private method for setting map change events to the server
    connection._broadcastChange = function(event, status) {

        if (!socket.connected ||
            // Prevent infinite recursion resulting from broadcasters receiving
            // change events
            !ecMap.status.changedStates()) {
            return;
        }

        socket.of("").emit("changeVotes", status);
    };

    // open
    // Initiate a connection to the backend service and update the state of the
    // map as change information arrives
    // Arguments:
    //   - options <object> A collection of connection-related options:
    //     - isBroadcaster <boolean> An optional flag that, when set high, will
    //       cause the client to emit local change events to the backend (which
    //       will be forwarded to all other active clients)
    connection.open = function(options) {

        // Ensure that only one connection is open at any time
        connection.close();

        socket.connect();

        socket.of("").on("changeVotes", ecMap.status.set);

        if (options && options.isBroadcaster) {
            ecMap.status.on("change", connection._broadcastChange);
        }
    };

    // close
    // Disconnect from the backend service
    connection.close = function() {
        ecMap.status.off("change", connection._broadcastChange);
        if (socket.connected) {
            socket.disconnect();
        }
    };

    /* on
     * Subscribe to connect-related events.
     * Arguments:
     *   - eventName <string> An identifier for the type of event to listen for
     *     (see event types below)
     *   - handler <function> The function to be invoked when the event occurs.
     * Event types (from the socket.io documentation):
     *  - "connect" - emitted when the socket connected successfully
     *  - "connecting" - emitted when the socket is attempting to connect with
     *     the server
     *  - "disconnect" - emitted when the socket disconnected
     *  - "connect_failed" - emitted when socket.io fails to establish a
     *     connection to the server and has no more transports to fallback to
     *  - "error" - emitted when an error occurs and it cannot be handled by
     *     the other event types
     *  - "reconnect_failed" - emitted when socket.io fails to re-establish a
     *     working connection after the connection was dropped.
     *  - "reconnect" - emitted when socket.io successfully reconnected to the
     *     server
     *  - "reconnecting" - emitted when the socket is attempting to reconnect
     *     with the server
     */
    connection.on = $.proxy(eventBus.bind, eventBus);
    /* off
     * Unsubscribe from connection-related events
     * Arguments:
     *   - eventName <string> An identifier for the type of event to list for
     *   - handler <function> The function to be invoked when the event occurs.
     *     If unspecified, all events bound to the supplied event type will be
     *     unbound.
     * Event types:
     *   - (see listing in "on")
     */
    connection.off = $.proxy(eventBus.unbind, eventBus);

}(this));
