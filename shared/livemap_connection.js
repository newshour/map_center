(function(window) {

    // Dependencies
    var io = window.io;
    var liveMap = window.liveMap || {};
    window.liveMap = liveMap;

    var defaultOptions = {
        // These values are expanded at build time.
        host: "{{ NODE_HOST }}",
        port: "{{ NODE_PORT }}",
        // The connection status will be managed elsewhere. This allows the
        // script to be included without necessarily incurring the network
        // overhead of establishing a connection.
        "auto connect": false
    };
    var namespaces = {
        dflt: "",
        broadcaster: "/broadcaster"
    };

    var Connection = liveMap.Connection = function(userOptions) {
        var options = {};

        io.util.merge(options, defaultOptions);
        io.util.merge(options, userOptions);

        this._socket = new io.Socket(options);
    };
    Connection.prototype.connect = function() {
        var self = this;
        this._socket.connect();
        // Any further attempts to connect should use socket.io's "reconnect"
        // method
        this.connect = function() {
            self._socket.reconnect();
        };
    };
    Connection.prototype._on = function(namespace, msgType, handler) {
        this._socket.of(namespace).on(msgType, handler);
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
    Connection.prototype.on = function(msgType, handler) {
        this._on(namespaces.dflt, msgType, handler);
    };
    /* onBroadcaster
     * Subscribe to broadcaster-related events. Most notable, this includes the
     * "connect_failed" event, which will be fired with a message of
     * "unauthorized" when the client fails to authorize as a broadcaster
     */
    Connection.prototype.onBroadcaster = function(msgType, handler) {
        this._on(namespaces.broadcaster, msgType, handler);
    };
    Connection.prototype._off = function(namespace, msgType, handler) {
        if (handler) {
            this._socket.of(namespace).removeListener(msgType, handler);
        } else {
            this._socket.of(namespace).removeAllListeners(msgType);
        }
    };
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
    Connection.prototype.off = function(msgType, handler) {
        this._off(namespaces.dflt, msgType, handler);
    };
    Connection.prototype.offBroadcaster = function(msgType, handler) {
        this._off(namespaces.broadcaster, msgType, handler);
    };
    // Only emit in the broadcaster namespace
    Connection.prototype.emit = function(msgType, msg) {
        this._socket.of(namespaces.broadcaster).emit(msgType, msg);
    };

}(this));
