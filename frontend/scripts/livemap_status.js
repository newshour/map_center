(function(window) {

    // Dependencies
    var $ = window.jQuery;

    var liveMap = window.liveMap || {};
    window.liveMap = liveMap;

    /* liveMap.status
     * Public interface, aliased for convenience within this closure
     */
    var status = liveMap.status = {};
    /* _status
     * Private state object
     *     href <strong> - The URL to show in the child iframe.
     */
    var _status = {
        href: ''
    };
    var eventBus = $("<div>");
    var changedStates = false;

    /* on
     * Subscribe to map-related events.
     * Arguments:
     *   - eventName <string> An identifier for the type of event to listen for
     *     (see event types below)
     *   - handler <function> The function to be invoked when the event occurs.
     * Events types:
     *   - "change" - triggered any time the state of the map changes
     */
    status.on = $.proxy(eventBus.bind, eventBus);
    /* off
     * Unsubscribe from map-related events
     * Arguments:
     *   - eventName <string> An identifier for the type of event to list for
     *   - handler <function> The function to be invoked when the event occurs.
     *     If unspecified, all events bound to the supplied event type will be
     *     unbound.
     * Event types:
     *   - (see listing in "on")
     */
    status.off = $.proxy(eventBus.unbind, eventBus);
    /* set
     * Set the status of the map. Re-calculates total vote counts; fires an
     * "change:state" event for each state followed by a single "change" event
     * neweStatus <object> - Describes the new status of the map
     *     href <string> - See description in "_status" above
     */
    status.set = function(newStatus) {

        var idx, len;
        // Flag used to determine whether a "change" event should be fired at
        // the end of this method
        var hasChanged = false;

        if ("href" in newStatus) {
            _status.href = newStatus.href;
            hasChanged = true;
        }

        if (hasChanged) {
            eventBus.trigger("change", status.get());
            changedStates = true;
        }
    };
    status.reset = function() {

        // Flag used to determine whether a "change" event should be fired at
        // the end of this method
        var hasChanged = false;

        if ("href" in _status) {
            delete _status.href;
            hasChanged = true;
        }

        if (hasChanged) {
            eventBus.trigger("change", status.get());
            changedStates = true;
        }
    };
    /* changedStates
     * If any properties were changed in the most recent call to "set", this
     * method will return true. If no states were changed, this
     * method will return false
     */
    status.changedStates = function() {

        return changedStates;
    };
    /* get
     * Create a copy of the map state
     */
    status.get = function() {
        return $.extend(true, {}, _status);
    };
}(this));
