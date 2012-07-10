(function(window) {

    // Dependencies
    var $ = window.jQuery;

    /* mapStatus
     * Public interface, aliased for convenience within this closure
     */
    var mapStatus = window.mapStatus = {};
    /* status
     * Private state object
     *     year <number> - The year to display. This allows for coloring
     *         according to the changing distribution of electoral votes
     *     stateVotes <object> - A collection describing the vote distribution
     *         for each state.
     *         {
     *             <state name>: {
     *                 dem: <number> - Number of electoral votes for the Democratic party
     *                 rep: <number> - Number of electoral votes for the Republican party
     *                 toss: <number> - Number of tossup electoral votes
     *             }
     *         }
     *    totals <object> - This value is calculated from the "stateVotes"
     *        objects each time it is modified.
     *        {
     *            dem: <number> - Number of electoral votes for the Democratic party
     *            rep: <number> - Number of electoral votes for the Republican party
     *            toss: <number> - Number of tossup electoral votes
     *        }
     */
    var status = {
        stateVotes: {},
        totals: {}
    };
    var eventBus = $("<div>");
    var changedStates;

    /* on
     * Subscribe to map-related events.
     * Arguments:
     *   - eventName <string> An identifier for the type of event to listen for
     *     (see event types below)
     *   - handler <function> The function to be invoked when the event occurs.
     * Events types:
     *   - "change" - triggered any time the state of the map changes
     *   - "change:state" - triggered each time a state changes (note that when
     *      this event fires as part of a collection of concurrent state
     *      changes, the status of the map will be completely set BEFORE these
     *      events fire)
     */
    mapStatus.on = $.proxy(eventBus.bind, eventBus);
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
    mapStatus.off = $.proxy(eventBus.unbind, eventBus);
    /* set
     * Set the status of the map. Re-calculates total vote counts; fires an
     * "change:state" event for each state followed by a single "change" event
     * neweStatus <object> - Describes the new status of the map
     *     year <number> - See description in "mapStatus" above
     *     stateVotes <object> - See description in "mapStatus" above
     */
    mapStatus.set = function(newStatus) {

        var idx, len;
        var statusChange = false;

        if ("year" in newStatus) {
            status.year = newStatus.year;
            statusChange = true;
        }

        changedStates = {};

        if ("stateVotes" in newStatus) {

            status.totals.dem = status.totals.rep = status.totals.toss = 0;

            $.each(newStatus.stateVotes, function(stateName, newVotes) {

                $.each(newVotes, function(partyName, newVoteCount) {
                    // Initialization case
                    if (!status.stateVotes[stateName] ||
                        status.stateVotes[stateName][partyName] !== newVoteCount) {
                        changedStates[stateName] = newVotes;
                        return false;
                    }
                });

                status.stateVotes[stateName] = newVotes;
                status.totals.dem += newVotes.dem || 0;
                status.totals.rep += newVotes.rep || 0;
                status.totals.toss += newVotes.toss || 0;
            });

            // Now that the totals are re-calculated, trigger an change event
            // for each state
            $.each(newStatus.stateVotes, function(stateName, votes) {
                eventBus.trigger("change:state", {
                    name: stateName,
                    dem: votes.dem,
                    rep: votes.rep,
                    toss: votes.toss
                });
            });
            statusChange = true;
        }

        if (statusChange) {
            eventBus.trigger("change", mapStatus.get());
        }
    };
    /* changedStates
     * If any states were changed in the most recent call to "set", this method
     * will return the vote distribution of those states (formatted in the same
     * manner as "mapStatus.stateVotes"). If no states were changed, this
     * method will return false
     */
    mapStatus.changedStates = function() {

        var hasStates = false;

        $.each(changedStates, function() {
            hasStates = true;
            return false;
        });

        if (!hasStates) {
            return false;
        } else {
            return changedStates;
        }
    };
    /* get
     * Create a copy of the map state
     */
    mapStatus.get = function() {
        return $.extend(true, {}, status);
    };
    /* modifyVotes
     * A convenience method for modifying the distribution of votes within
     * states, relative to their current value.
     */
    mapStatus.modifyVotes = function(stateVoteDeltas) {

        var statesVotes = mapStatus.get().stateVotes;

        $.each(stateVoteDeltas, function(stateName, voteDelta) {

            var stateVotes = statesVotes[stateName];

            stateVotes.dem += voteDelta.dem || 0;
            stateVotes.rep += voteDelta.rep || 0;
            stateVotes.toss += voteDelta.toss || 0;
        });

        mapStatus.set({ stateVotes: statesVotes });
    };

}(this));
/* Example usages:
 *
 * // Responding to click events
 * var eventToken = nhmc.geo.usGeo[i].statePath.connect('onclick',
 *     nhmc.geo.usGeo[i].statePath,
 *     function() {
 *          // Modified version of genericHandler
 *     });
 *
 * // Updating the visualization...
 * // ...the map:
 * mapStatus.on("change:state", function(event, stateStatus) {
 *     // Code consolidated from:
 *     //   - nebraskaHandler
 *     //   - maineHandler
 *     //   - genericHandler
 * });
 *
 * // ...the electoral results (numeric display)
 *
 * mapStatus.on("change", function(event, status) {
 *     indicateWin(status.totals.rep, status.totals.dem, status.totals.toss);
 * });
 *
 * // Tracking map status in the document fragment
 *
 * mapStatus.on("change", function(event, status) {
 *     window.location.hash = encodeURIComponent(JSON.stringify(status));
 * });
 */


