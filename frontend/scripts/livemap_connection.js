(function(window) {

    // Dependencies
    var io = window.io;
    var $ = window.jQuery;
    var liveMap = window.liveMap || {};
    window.liveMap = liveMap;
    var connection = liveMap.connection = {};

    var eventBus = $("<div>");
    var connectionRequested = false;
    var socket = new io.Socket({
        host: "localhost",
        port: 8000,
        // The connection status will be managed elsewhere. This allows the
        // script to be included without necessarily incurring the network
        // overhead of establishing a connection.
        "auto connect": connectionRequested
    });
    // Default socket namespace
    var socketNs = socket.of("");

    // Forward the following socket.io events for use by the UI. These events
    // are detailed in the description of the "on" method below
    $.each(["replay", "updateMap", "connect", "connecting", "disconnect",
        "connect_failed", "error",
        "reconnect", "reconnecting", "reconnect_failed"],
        function(idx, eventName) {
            socketNs.on(eventName, function() {
                eventBus.trigger.apply(eventBus,
                    [eventName].concat(Array.prototype.slice.call(arguments)));
            });
        });

    // _broadcastChange
    // Private method for setting map change events to the server
    connection._broadcastChange = function(mapState) {

        if (!socket.connected ||
            // Prevent infinite recursion resulting from broadcasters receiving
            // change events
            !liveMap.status.changedStates()) {
            return;
        }

        socketNs.emit("updateMap", mapState);
    };

    /* init
     * Initiate a connection to the backend service
     */
    connection.init = function(options) {

        if (!connectionRequested) {

            socket.connect();
            connectionRequested = true;
        }
    };

    /* startBroadcast
     * Emit map status changes to the backend
     */
    connection.startBroadcast = function() {
        liveMap.status.on("change.broadcast", function(event, mapStatus) {

            connection._broadcastChange({
                // Only broadcast the votes (not the totals)
                // TODO: Broadcast compressed state used to generate document
                // fragments
                stateVotes: mapStatus.stateVotes
            });
        });
    };

    /* stopBroadcast
     * Prevent map status changes from being emitted to the backend
     */
    connection.stopBroadcast = function() {
        liveMap.status.off("change.broadcast");
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
