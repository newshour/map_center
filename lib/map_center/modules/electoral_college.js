namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");

(function(window) {

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

    /* eventBus
     * A dedicated object for subscribing to map-related events:
     *   "change" - triggered any time the state of the map changes
     */
    mapStatus.eventBus = $("<div>");
    /* set
     * Set the status of the map. Re-calculates total vote counts; fires an
     * "update:state" event for each state followed by a single "update" event
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

        if ("stateVotes" in newStatus) {

            status.totals.dem = status.totals.rep = status.totals.toss = 0;

            $.each(newStatus.stateVotes, function(stateName, votes) {

                status.stateVotes[stateName] = votes;
                status.totals.dem += votes.dem || 0;
                status.totals.rep += votes.rep || 0;
                status.totals.toss += votes.toss || 0;
            });

            // Now that the totals are re-calculated, trigger an change event
            // for each state
            $.each(newStatus.stateVotes, function(stateName, votes) {
                mapStatus.eventBus.trigger("change:state", {
                    name: stateName,
                    dem: votes.dem,
                    rep: votes.rep,
                    toss: votes.toss
                });
            });
            statusChange = true;
        }

        if (statusChange) {
            mapStatus.eventBus.trigger("change", mapStatus.get());
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

        var delta;

        $.each(stateVoteDeltas, function(stateName, voteDelta) {

            var stateVotes = status.stateVotes[stateName];

            stateVotes.dem += voteDelta.dem || 0;
            stateVotes.rep += voteDelta.rep || 0;
            stateVotes.toss += voteDelta.toss || 0;
        });

        mapStatus.set(status);
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
 * mapStatus.bind("change:state", function(event, stateStatus) {
 *     // Code consolidated from:
 *     //   - nebraskaHandler
 *     //   - maineHandler
 *     //   - genericHandler
 * });
 *
 * // ...the electoral results (numeric display)
 *
 * mapStatus.bind("change", function(event, status) {
 *     indicateWin(status.totals);
 * });
 *
 * // ...the electoral results (bar graph)
 *
 * mapStatus.bind("change", function(event, status) {
 *     nhmc.charts.lowerChart.series[0].setData([{
 *         color: nhmc.config.styleColors['blue'],
 *         y: status.totals.demo
 *     }]);
 *     nhmc.charts.lowerChart.series[1].setData([{
 *         color: nhmc.config.styleColors['yellow'],
 *         y: status.totals.toss
 *     }]);
 *     nhmc.charts.lowerChart.series[2].setData([{
 *         color: nhmc.config.styleColors['red'],
 *         y: status.totals.rep
 *     }]);
 * });
 *
 * // Tracking map status in the document fragment
 *
 * mapStatus.bind("change", function(event, status) {
 *     window.location.hash = encodeURIComponent(JSON.stringify(status));
 * });
 */

$(document).one('coreInitialized', function() {
    var predictionTabText = "Your map";
    
    var electoralVotes = {
        "2012": {
            "states": {
                "Alabama": 9,
                "Alaska": 3,
                "Arizona": 11,
                "Arkansas": 6,
                "California": 55,
                "Colorado": 9,
                "Connecticut": 7,
                "Delaware": 3,
                "District of Columbia": 3,
                "Florida": 29,
                "Georgia": 16,
                "Hawaii": 4,
                "Idaho": 4,
                "Illinois": 20,
                "Indiana": 11,
                "Iowa": 6,
                "Kansas": 6,
                "Kentucky": 8,
                "Louisiana": 8,
                "Maine": 4,
                "Maryland": 10,
                "Massachusetts": 11,
                "Michigan": 16,
                "Minnesota": 10,
                "Mississippi": 6,
                "Missouri": 10,
                "Montana": 3,
                "Nebraska": 5,
                "Nevada": 6,
                "New Hampshire": 4,
                "New Jersey": 14,
                "New Mexico": 5,
                "New York": 29,
                "North Carolina": 15,
                "North Dakota": 3,
                "Ohio": 18,
                "Oklahoma": 7,
                "Oregon": 7,
                "Pennsylvania": 20,
                "Rhode Island": 4,
                "South Carolina": 9,
                "South Dakota": 3,
                "Tennessee": 11,
                "Texas": 38,
                "Utah": 6,
                "Vermont": 3,
                "Virginia": 13,
                "Washington": 12,
                "West Virginia": 5,
                "Wisconsin": 10,
                "Wyoming": 3
            },
            "republican": [],
            "democratic": [],
            "tossup": []
        },
        "1964": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 5,
                "Iowa": 9,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 40,
                "Massachusetts": 14,
                "West Virginia": 7,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 12,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 4,
                "Pennsylvania": 29,
                "Florida": 14,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 26,
                "Alabama": 10,
                "New York": 43,
                "South Dakota": 4,
                "Colorado": 6,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 25,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Arizona", "Georgia", "Louisiana", "Mississippi", "South Carolina"],
            "democratic": ["Alaska", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
            "tossup": []
        },
        "1968": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 5,
                "Iowa": 9,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 40,
                "Massachusetts": 14,
                "West Virginia": 7,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 12,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 4,
                "Pennsylvania": 29,
                "Florida": 14,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 26,
                "Alabama": 10,
                "New York": 43,
                "South Dakota": 4,
                "Colorado": 6,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 25,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alaska", "Arizona", "California", "Colorado", "Delaware", "Florida", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "North Dakota", "Ohio", "Oklahoma", "Oregon", "South Carolina", "South Dakota", "Tennessee", "Utah", "Vermont", "Virginia", "Wisconsin", "Wyoming"],
            "democratic": ["Arkansas", "Connecticut", "District of Columbia", "Hawaii", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "New York", "Pennsylvania", "Rhode Island", "Texas", "Washington", "West Virginia"],
            "tossup": ["Alabama", "Georgia", "Louisiana", "Mississippi"],
            "North Carolina": {
                "republican": 12,
                "democratic": 0,
                "tossup": 1
            }
        },
        "1972": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 10,
                "Arizona": 6,
                "Iowa": 8,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 45,
                "Massachusetts": 14,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 27,
                "Florida": 17,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 25,
                "Alabama": 9,
                "New York": 41,
                "South Dakota": 4,
                "Colorado": 7,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 26,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4}, "Virginia": {"republican": 11,
                "democratic": 0,
                "tossup": 1
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
            "democratic": ["District of Columbia", "Massachusetts"],
            "tossup": [],
            "Virginia": {
                "republican": 11,
                "democratic": 0,
                "tossup": 1
            }
        },
        "1976": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 10,
                "Arizona": 6,
                "Iowa": 8,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 45,
                "Massachusetts": 14,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 27,
                "Florida": 17,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 25,
                "Alabama": 9,
                "New York": 41,
                "South Dakota": 4,
                "Colorado": 7,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 26,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alaska", "Arizona", "California", "Colorado", "Connecticut", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Maine", "Michigan", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "North Dakota", "Oklahoma", "Oregon", "South Dakota", "Utah", "Vermont", "Virginia", "Wyoming"],
            "democratic": ["Alabama", "Arkansas", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Kentucky", "Louisiana", "Maryland", "Massachusetts", "Minnesota", "Mississippi", "Missouri", "New York", "North Carolina", "Ohio", "Pennsylvania", "Rhode Island", "South Carolina", "Tennessee", "Texas", "West Virginia", "Wisconsin"],
            "tossup": [],
            "Washington": {
                "republican": 8,
                "democratic": 0,
                "tossup": 0
            }
        },
        "1980": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 10,
                "Arizona": 6,
                "Iowa": 8,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 45,
                "Massachusetts": 14,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 27,
                "Florida": 17,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 25,
                "Alabama": 9,
                "New York": 41,
                "South Dakota": 4,
                "Colorado": 7,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 26,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Massachusetts", "Michigan", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "Wisconsin", "Wyoming"],
            "democratic": ["District of Columbia", "Georgia", "Hawaii", "Maryland", "Minnesota", "Rhode Island", "West Virginia"],
            "tossup": []
        },
        "1984": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 24,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 7,
                "Iowa": 8,
                "Michigan": 20,
                "Kansas": 7,
                "Utah": 5,
                "Virginia": 12,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 4,
                "California": 47,
                "Massachusetts": 13,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 25,
                "Florida": 21,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 23,
                "Alabama": 9,
                "New York": 36,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 16,
                "Washington": 10,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 29,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
            "democratic": ["District of Columbia", "Minnesota"],
            "tossup": []
        },
        "1988": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 24,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 7,
                "Iowa": 8,
                "Michigan": 20,
                "Kansas": 7,
                "Utah": 5,
                "Virginia": 12,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 4,
                "California": 47,
                "Massachusetts": 13,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 25,
                "Florida": 21,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 23,
                "Alabama": 9,
                "New York": 36,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 16,
                "Washington": 10,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 29,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4}
            ,
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Michigan", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Pennsylvania", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Wyoming"],
            "democratic": ["District of Columbia", "Hawaii", "Iowa", "Massachusetts", "Minnesota", "New York", "Oregon", "Rhode Island", "Washington", "West Virginia", "Wisconsin"],
            "tossup": []
        },
        "1992": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 22,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 12,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 8,
                "Iowa": 7,
                "Michigan": 18,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 3,
                "California": 54,
                "Massachusetts": 10,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 13,
                "North Dakota": 3,
                "Pennsylvania": 23,
                "Florida": 25,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 21,
                "Alabama": 9,
                "New York": 33,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 14,
                "District of Columbia": 3,
                "Texas": 32,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Florida", "Idaho", "Indiana", "Kansas", "Mississippi", "Nebraska", "North Carolina", "North Dakota", "Oklahoma", "South Carolina", "South Dakota", "Texas", "Utah", "Virginia", "Wyoming"],
            "democratic": ["Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Georgia", "Hawaii", "Illinois", "Iowa", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Montana", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "Ohio", "Oregon", "Pennsylvania", "Rhode Island", "Tennessee", "Vermont", "Washington", "West Virginia", "Wisconsin"],
            "tossup": []
        },
        "1996": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 22,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 8,
                "Iowa": 7,
                "Michigan": 18,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 3,
                "California": 54,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 13,
                "North Dakota": 3,
                "Pennsylvania": 23,
                "Florida": 25,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 21,
                "Alabama": 9,
                "New York": 33,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 14,
                "District of Columbia": 3,
                "Texas": 32,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Colorado", "Georgia", "Idaho", "Indiana", "Kansas", "Mississippi", "Montana", "Nebraska", "North Carolina", "North Dakota", "South Carolina", "South Dakota", "Texas", "Utah", "Virginia", "Wyoming"],
            "democratic": ["Arizona", "Arkansas", "California", "Connecticut", "Delaware", "District of Columbia", "Florida", "Hawaii", "Illinois", "Iowa", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "Tennessee", "Vermont", "Washington", "West Virginia", "Wisconsin"],
            "tossup": []
        },
        "2000": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 22,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 8,
                "Iowa": 7,
                "Michigan": 18,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 3,
                "California": 54,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 13,
                "North Dakota": 3,
                "Pennsylvania": 23,
                "Florida": 25,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 21,
                "Alabama": 9,
                "New York": 33,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 14,
                "District of Columbia": 3,
                "Texas": 32,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "Colorado", "Florida", "Georgia", "Idaho", "Indiana", "Kansas", "Kentucky", "Louisiana", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "West Virginia", "Wyoming"],
            "democratic": ["California", "Connecticut", "Delaware", "Hawaii", "Illinois", "Iowa", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "New Jersey", "New Mexico", "New York", "Oregon", "Pennsylvania", "Rhode Island", "Vermont", "Washington", "Wisconsin"],
            "tossup": [], 
            "District of Columbia": {
                "republican": 0,
                "democratic": 2,
                "tossup": 0
            }
        },
        "2004": {
            "states": {
                "Mississippi": 6,
                "Oklahoma": 7,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 21,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 11,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 10,
                "Iowa": 7,
                "Michigan": 17,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 7,
                "Montana": 3,
                "California": 55,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 10,
                "Vermont": 3,
                "Georgia": 15,
                "North Dakota": 3,
                "Pennsylvania": 21,
                "Florida": 27,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 20,
                "Alabama": 9,
                "New York": 31,
                "South Dakota": 3,
                "Colorado": 9,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 15,
                "District of Columbia": 3,
                "Texas": 34,
                "Nevada": 5,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "Colorado", "Florida", "Georgia", "Idaho", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Mexico", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "West Virginia", "Wyoming"],
            "democratic": ["California", "Connecticut", "Delaware", "District of Columbia", "Hawaii", "Illinois", "Maine", "Maryland", "Massachusetts", "Michigan", "New Hampshire", "New Jersey", "New York", "Oregon", "Pennsylvania", "Rhode Island", "Vermont", "Washington", "Wisconsin"],
            "tossup": [],
            "Minnesota": {
                "republican": 0,
                "democratic": 9,
                "tossup": 0
            }
        },
        "2008": {
            "states": {
                "Mississippi": 6,
                "Oklahoma": 7,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 21,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 11,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 10,
                "Iowa": 7,
                "Michigan": 17,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 7,
                "Montana": 3,
                "California": 55,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 10,
                "Vermont": 3,
                "Georgia": 15,
                "North Dakota": 3,
                "Pennsylvania": 21,
                "Florida": 27,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 20,
                "Alabama": 9,
                "New York": 31,
                "South Dakota": 3,
                "Colorado": 9,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 15,
                "District of Columbia": 3,
                "Texas": 34,
                "Nevada": 5,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "Georgia", "Idaho", "Kansas", "Kentucky", "Louisiana", "Mississippi", "Missouri", "Montana", "North Dakota", "Oklahoma", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "West Virginia", "Wyoming"],
            "democratic": ["California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Hawaii", "Illinois", "Indiana", "Iowa", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "Ohio", "Oregon", "Pennsylvania", "Rhode Island", "Vermont", "Virginia", "Washington", "Wisconsin"],
            "tossup": [],
            "Nebraska": {
                "republican": 4,
                "democratic": 1,
                "tossup": 0
            }
        }
    };
    electoralVotes[predictionTabText] = electoralVotes["2012"];
    
    var candidateNames = {
        "2012": {
            "democratic": "Obama",
            "republican": "Romney"
        },
        "1964": {
            "democratic": "Johnson",
            "republican": "Goldwater"
        },
        "1968": {
            "democratic": "Humphrey",
            "republican": "Nixon",
            "tossup": "Wallace"
        },
        "1972": {
            "democratic": "McGovern",
            "republican": "Nixon"
        },
        "1976": {
            "democratic": "Carter",
            "republican": "Ford"
        },
        "1980": {
            "democratic": "Carter",
            "republican": "Reagan"
        },
        "1984": {
            "democratic": "Mondale",
            "republican": "Reagan"
        },
        "1988": {
            "democratic": "Dukakis",
            "republican": "Bush"
        },
        "1992": {
            "democratic": "Clinton",
            "republican": "Bush"
        },
        "1996": {
            "democratic": "Clinton",
            "republican": "Dole"
        },
        "2000": {
            "democratic": "Gore",
            "republican": "Bush"
        },
        "2004": {
            "democratic": "Kerry",
            "republican": "Bush"
        },
        "2008": {
            "democratic": "Obama",
            "republican": "McCain"
        }
    };
    candidateNames[predictionTabText] = candidateNames["2012"];
    
    function indicateWin(democratic, republican, tossup) {
        $('.ec_win').hide();
        $('.ec_detail').removeClass('ec_detail_win');
        
        $('#ec_total_d').text(democratic);
        $('#ec_total_r').text(republican);
        $('#ec_total_t').text(tossup);
        
        if (democratic >= 270) {
            $('#ec_win_d').show();
            $('#ec_detail_d').addClass('ec_detail_win');
        } else if (republican >= 270) {
            $('#ec_win_r').show();
            $('#ec_detail_r').addClass('ec_detail_win');
        } else if (tossup >= 270) {
            $('#ec_win_t').show();
            $('#ec_detail_t').addClass('ec_detail_win');
        }
    }
    
    function showElectoralVote(year, startPrediction) {
        // clean up arguments
        // coerce year to string (just for good measure)
        year = year + '';
        // default startPrediction to false
        startPrediction = (typeof startPrediction == 'undefined') ? false : startPrediction;
        
        var republican = electoralVotes[year].republican;
        var democratic = electoralVotes[year].democratic;
        var tossup = electoralVotes[year].tossup;
        nhmc.cleanup.clearPathColors();
        nhmc.ctrl.setStateColors(republican, 'red');
        nhmc.ctrl.setStateColors(democratic, 'blue');
        nhmc.ctrl.setStateColors(tossup, 'yellow');
        
        var republicanVotes = 0;
        var democraticVotes = 0;
        var tossupVotes = 0;
        var invalidVotes = 0;
        
        if (!startPrediction) {
            for (i=0; i<republican.length; i++) {
                republicanVotes += electoralVotes[year].states[republican[i]];
            }
            for (i=0; i<democratic.length; i++) {
                democraticVotes += electoralVotes[year].states[democratic[i]];
            }
            for (i=0; i<tossup.length; i++) {
                tossupVotes += electoralVotes[year].states[tossup[i]];
            }
            
            for (state in electoralVotes[year].states) {
                var stateVotes = electoralVotes[year][state];
                if (stateVotes) {
                    
                    republicanVotes += stateVotes.republican;
                    democraticVotes += stateVotes.democratic;
                    tossupVotes += stateVotes.tossup;
                    
                    if (stateVotes.republican >= 0 && stateVotes.democratic == 0 && stateVotes.tossup == 0) {
                        nhmc.ctrl.setStateColors([state], 'red');
                    } else if (stateVotes.republican == 0 && stateVotes.democratic >= 0 && stateVotes.tossup == 0) {
                        nhmc.ctrl.setStateColors([state], 'blue');
                    } else if (stateVotes.republican == 0 && stateVotes.democratic == 0 && stateVotes.tossup >= 0) {
                        nhmc.ctrl.setStateColors([state], 'yellow');
                    } else if (stateVotes.republican >= 0 && stateVotes.democratic >= 0 && stateVotes.tossup == 0) {
                        nhmc.ctrl.setStateColors([state], 'purple');
                    } else if (stateVotes.republican >= 0 && stateVotes.democratic == 0 && stateVotes.tossup >= 0) {
                        nhmc.ctrl.setStateColors([state], 'orange');
                    } else if (stateVotes.republican == 0 && stateVotes.democratic >= 0 && stateVotes.tossup >= 0) {
                        nhmc.ctrl.setStateColors([state], 'green');
                    } else {
                        nhmc.ctrl.setStateColors([state], 'gray');
                    }
                }
            }
            
            $('#ec_name_d').text(candidateNames[year].democratic);
            $('#ec_name_r').text(candidateNames[year].republican);
            if (candidateNames[year].tossup) {
                $('#ec_name_t').text(candidateNames[year].tossup);
            } else {
                $('#ec_name_t').text('Tossup');
            }
        } else {
            for (i=0; i<republican.length; i++) {
                republicanVotes += electoralVotes['2012'].states[republican[i]];
            }
            for (i=0; i<democratic.length; i++) {
                democraticVotes += electoralVotes['2012'].states[democratic[i]];
            }
            for (i=0; i<tossup.length; i++) {
                tossupVotes += electoralVotes['2012'].states[tossup[i]];
            }
            
            for (state in electoralVotes[year].states) {
                var stateVotes = electoralVotes[year][state];
                if (stateVotes) {
                    var mostVotes = Math.max(stateVotes.republican, stateVotes.democratic, stateVotes.tossup);
                    if (mostVotes == stateVotes.republican) {
                        nhmc.ctrl.setStateColors([state], 'red');
                        republicanVotes += electoralVotes['2012'].states[state];
                    } else if (mostVotes == stateVotes.democratic) {
                        nhmc.ctrl.setStateColors([state], 'blue');
                        democraticVotes += electoralVotes['2012'].states[state];
                    } else {  // assume third-party
                        nhmc.ctrl.setStateColors([state], 'yellow');
                        tossupVotes += electoralVotes['2012'].states[state];
                    }
                }
            }
            
            $('#ec_name_d').text(candidateNames['2012'].democratic);
            $('#ec_name_r').text(candidateNames['2012'].republican);
            $('#ec_name_t').text('Tossup');
            
            $('.view_tab_active').removeClass('view_tab_active');
            $('.view_tab_option:contains("' + predictionTabText + '")').parent().addClass('view_tab_active');
        }
        
        indicateWin(democraticVotes, republicanVotes, tossupVotes);
        
        var animate = true;
        if (nhmc.charts.lowerChart) {animate = false;}
        $('#lower_chart').slideDown(0, function() {
            nhmc.charts.lowerChart = new Highcharts.Chart({
                chart: {
                    margin: [0,10,20,10],
                    renderTo: 'lower_chart',
                    defaultSeriesType: 'bar'
                },
                credits: {enabled: false},
                title: {text: null},
                xAxis: {
                    categories: [' '],
                    lineWidth: 0
                },
                yAxis: {
                    endOnTick: false,
                    max: 538,
                    min: 0,
                    // tickInterval: 270,
                    plotLines: [{
                        color: nhmc.config.styleColors['black'],
                        label: {
                            rotation: 0,
                            text: '270',
                            y: 10
                        },
                        value: 270,
                        width: 2
                    }],
                    title: {text: ''}
                },
                series: [{
                    name: 'Democratic',
                    data: [{
                        color: nhmc.config.styleColors['blue'],
                        y: democraticVotes
                    }]
                }, {
                    name: 'Tossup',
                    data: [{
                        color: nhmc.config.styleColors['yellow'],
                        y: tossupVotes
                    }]
                }, {
                    name: 'Republican',
                    data: [{
                        color: nhmc.config.styleColors['red'],
                        y: republicanVotes
                    }]
                }],
                legend: {enabled: false},
                plotOptions: {
                    bar: {
                        borderWidth: 0,
                        shadow: false
                    },
                    series: {
                        animation: animate
                    }
                },
                tooltip: {enabled: false}
            });
        });
        
    }
    
    $('#view_tabs').delegate('.view_tab_option', 'click', function() {
        // reset things so we don't accidentally set or append them on top
        // of each other
        $('#map').unbind('click');
        nhmc.cleanup.clearClickHandlers();
        nhmc.cleanup.closeDialogs();
        nhmc.cleanup.clearGarbage();
        
        // render the map
        showElectoralVote($(this).text());
        
        $('#instructions_after').hide();
        $('#instructions_before').show();
        $('#map').click(function() {
            // remove the option to shoot yourself in the foot
            $('#map').unbind('click');
            $('#instructions_before').hide();
            $('#instructions_after').show();
            
            // unsplit states
            var activeYear = $('.view_tab_active .view_tab_option');
            if ($('.view_tab_active .view_tab_option').length > 1) {
                activeYear = $('#view_tab_more_shown');
            }
            showElectoralVote(activeYear.text(), true);
            
            // prep the dialogs for splitting states, including 
            // pre-selecting the currently shown choices
            $([
                '<div id="nebraska_electoral" title="Choose Nebraska\'s votes">',
                    '<p>',
                    '<label for="nebraska_popular">Popular vote (worth 3):</label>',
                    '<select id="nebraska_popular">',
                        '<option value="r">Republican</option>',
                        '<option value="d">Democratic</option>',
                        '<option value="t">Tossup</option>',
                        '<option value="u">Undecided</option>',
                    '</select>',
                    '</p>',
                    '<p>',
                    '<label for="nebraska_4">Fourth vote:</label>',
                    '<select id="nebraska_4">',
                        '<option value="r">Republican</option>',
                        '<option value="d">Democratic</option>',
                        '<option value="t">Tossup</option>',
                        '<option value="u">Undecided</option>',
                    '</select>',
                    '</p>',
                    '<p>',
                    '<label for="nebraska_5">Fifth vote:</label>',
                    '<select id="nebraska_5">',
                        '<option value="r">Republican</option>',
                        '<option value="d">Democratic</option>',
                        '<option value="t">Tossup</option>',
                        '<option value="u">Undecided</option>',
                    '</select>',
                    '</p>',
                '</div>'
            ].join('')).dialog({
                autoOpen: false,
                beforeClose: function(e, ui) {
                    $('#nebraska_popular').unbind('change');
                    $('#nebraska_4').unbind('change');
                    $('#nebraska_5').unbind('change');
                },
                resizable: false,
                width: $('body').width() >= 375 ? 350 : 250
            });
            nhmc.cleanup.futureGarbage.push($('#nebraska_electoral'));
            nhmc.cleanup.activeDialogs.push($('#nebraska_electoral'));
            if (nhmc.geo.usGeo['Nebraska'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['red']).toString()) {
                $('#nebraska_popular').val('r');
                $('#nebraska_4').val('r');
                $('#nebraska_5').val('r');
            } else if (nhmc.geo.usGeo['Nebraska'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['blue']).toString()) {
                $('#nebraska_popular').val('d');
                $('#nebraska_4').val('d');
                $('#nebraska_5').val('d');
            } else if (nhmc.geo.usGeo['Nebraska'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['yellow']).toString()) {
                $('#nebraska_popular').val('t');
                $('#nebraska_4').val('t');
                $('#nebraska_5').val('t');
            } else {
                $('#nebraska_popular').val('u');
                $('#nebraska_4').val('u');
                $('#nebraska_5').val('u');
            }
            $([
                '<div id="maine_electoral" title="Choose Maine\'s votes">',
                    '<p>',
                    '<label for="maine_popular">Popular vote (worth 3):</label>',
                    '<select id="maine_popular">',
                        '<option value="r">Republican</option>',
                        '<option value="d">Democratic</option>',
                        '<option value="t">Tossup</option>',
                        '<option value="u">Undecided</option>',
                    '</select>',
                    '</p>',
                    '<p>',
                    '<label for="maine_4">Fourth vote:</label>',
                    '<select id="maine_4">',
                        '<option value="r">Republican</option>',
                        '<option value="d">Democratic</option>',
                        '<option value="t">Tossup</option>',
                        '<option value="u">Undecided</option>',
                    '</select>',
                    '</p>',
                '</div>'
            ].join('')).dialog({
                autoOpen: false,
                beforeClose: function(e, ui) {
                    $('#maine_popular').unbind('change');
                    $('#maine_4').unbind('change');
                },
                height: 170,
                resizable: false,
                width: 400
            });
            nhmc.cleanup.futureGarbage.push($('#maine_electoral'));
            nhmc.cleanup.activeDialogs.push($('#maine_electoral'));
            if (nhmc.geo.usGeo['Maine'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['red']).toString()) {
                $('#maine_popular').val('r');
                $('#maine_4').val('r');
                $('#maine_5').val('r');
            } else if (nhmc.geo.usGeo['Maine'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['blue']).toString()) {
                $('#maine_popular').val('d');
                $('#maine_4').val('d');
                $('#maine_5').val('d');
            } else if (nhmc.geo.usGeo['Maine'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['yellow']).toString()) {
                $('#maine_popular').val('t');
                $('#maine_4').val('t');
                $('#maine_5').val('t');
            } else {
                $('#maine_popular').val('u');
                $('#maine_4').val('u');
                $('#maine_5').val('u');
            }
            
            for (var i in nhmc.geo.usGeo) {
                var stateClass = i;
                switch (stateClass) {
                    case 'Nebraska':
                        // store the votes currently reflected so we can
                        // subtract them out later
                        var nebraskaVotes = {
                            republican: 0,
                            democratic: 0,
                            tossup: 0
                        };
                        
                        if (nhmc.geo.usGeo['Nebraska'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['red']).toString()) {
                            nebraskaVotes.republican = electoralVotes['2012'].states['Nebraska'];
                        } else if (nhmc.geo.usGeo['Nebraska'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['blue']).toString()) {
                            nebraskaVotes.democratic = electoralVotes['2012'].states['Nebraska'];
                        } else if (nhmc.geo.usGeo['Nebraska'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['yellow']).toString()) {
                            nebraskaVotes.tossup = electoralVotes['2012'].states['Nebraska'];
                        }  // else we're undecided
                        
                        function nebraskaHandler(e) {
                            $('#nebraska_electoral').dialog('open');
                            
                            function updateNebraska() {
                                var oldBlue = nhmc.charts.lowerChart.series[0].data[0].y;
                                var oldRed = nhmc.charts.lowerChart.series[2].data[0].y;
                                var oldYellow = nhmc.charts.lowerChart.series[1].data[0].y;
                                
                                var newVotes = {
                                    republican: 0,
                                    democratic: 0,
                                    tossup: 0
                                };
                                
                                // figure out new votes
                                switch ($('#nebraska_popular').val()) {
                                    case 'r':
                                        newVotes.republican += 3;
                                        break;
                                    case 'd':
                                        newVotes.democratic += 3;
                                        break;
                                    case 't':
                                        newVotes.tossup += 3;
                                        break;
                                    default:  // do nothing
                                        break;
                                }
                                switch ($('#nebraska_4').val()) {
                                    case 'r':
                                        newVotes.republican += 1;
                                        break;
                                    case 'd':
                                        newVotes.democratic += 1;
                                        break;
                                    case 't':
                                        newVotes.tossup += 1;
                                        break;
                                    default:  // do nothing
                                        break;
                                }
                                switch ($('#nebraska_5').val()) {
                                    case 'r':
                                        newVotes.republican += 1;
                                        break;
                                    case 'd':
                                        newVotes.democratic += 1;
                                        break;
                                    case 't':
                                        newVotes.tossup += 1;
                                        break;
                                    default:  // do nothing
                                        break;
                                }
                                
                                var newDVotes = oldBlue - nebraskaVotes.democratic + newVotes.democratic;
                                var newRVotes = oldRed - nebraskaVotes.republican + newVotes.republican;
                                var newTVotes = oldYellow - nebraskaVotes.tossup + newVotes.tossup;
                                // update the chart, of course
                                nhmc.charts.lowerChart.series[0].setData([{
                                    color: nhmc.config.styleColors['blue'],
                                    y: newDVotes
                                }]);
                                nhmc.charts.lowerChart.series[1].setData([{
                                    color: nhmc.config.styleColors['yellow'],
                                    y: newTVotes
                                }]);
                                nhmc.charts.lowerChart.series[2].setData([{
                                    color: nhmc.config.styleColors['red'],
                                    y: newRVotes
                                }]);
                                indicateWin(newDVotes, newRVotes, newTVotes);
                                
                                // update the stored votes to reflect the 
                                // new state of things *rimshot*
                                nebraskaVotes = newVotes;
                                
                                switch ($('#nebraska_popular').val() + $('#nebraska_4').val() + $('#nebraska_5').val()) {
                                    case 'rrr':
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'red');
                                        break;
                                    case 'ddd':
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'blue');
                                        break;
                                    case 'ttt':
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'yellow');
                                        break;
                                    case 'rrd':  // let's not try to set
                                    case 'rdd':  // different levels of
                                    case 'drr':  // each primary color.
                                    case 'drd':  // too crazy.
                                    case 'rdr':
                                    case 'ddr':
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'purple');
                                        break;
                                    case 'rrt':
                                    case 'rtr':
                                    case 'rtt':
                                    case 'trr':
                                    case 'trt':
                                    case 'ttr':
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'orange');
                                        break;
                                    case 'ddt':
                                    case 'dtd':
                                    case 'dtt':
                                    case 'tdd':
                                    case 'tdt':
                                    case 'ttd':
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'green');
                                        break;
                                    case 'rdt':
                                    case 'rtd':
                                    case 'drt':
                                    case 'dtr':
                                    case 'trd':
                                    case 'tdr':
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'gray');
                                        break;
                                    default:
                                        nhmc.ctrl.setStateColors(['Nebraska'], 'default');
                                        break;
                                }
                            }
                            
                            $('#nebraska_popular').change(updateNebraska);
                            $('#nebraska_4').change(updateNebraska);
                            $('#nebraska_5').change(updateNebraska);
                        }
                        var eventToken = nhmc.geo.usGeo['Nebraska'].statePath.connect('onclick', nhmc.geo.usGeo['Nebraska'].statePath, nebraskaHandler);
                        nhmc.cleanup.clickHandlerTokens.push(eventToken);
                        break;
                    
                    case 'Maine':
                        var maineVotes = {
                            republican: 0,
                            democratic: 0,
                            tossup: 0
                        };
                        
                        if (nhmc.geo.usGeo['Maine'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['red']).toString()) {
                            maineVotes.republican = electoralVotes['2012'].states['Maine'];
                        } else if (nhmc.geo.usGeo['Maine'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['blue']).toString()) {
                            maineVotes.democratic = electoralVotes['2012'].states['Maine'];
                        } else if (nhmc.geo.usGeo['Maine'].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['yellow']).toString()) {
                            maineVotes.tossup = electoralVotes['2012'].states['Maine'];
                        }  // else we're undecided
                        
                        function maineHandler(e) {
                            $('#maine_electoral').dialog('open');
                            
                            function updateMaine() {
                                var oldBlue = nhmc.charts.lowerChart.series[0].data[0].y;
                                var oldRed = nhmc.charts.lowerChart.series[2].data[0].y;
                                var oldYellow = nhmc.charts.lowerChart.series[1].data[0].y;
                                
                                var newVotes = {
                                    republican: 0,
                                    democratic: 0,
                                    tossup: 0
                                };
                                
                                // figure out new votes
                                switch ($('#maine_popular').val()) {
                                    case 'r':
                                        newVotes.republican += 3;
                                        break;
                                    case 'd':
                                        newVotes.democratic += 3;
                                        break;
                                    case 't':
                                        newVotes.tossup += 3;
                                        break;
                                    default:  // do nothing
                                        break;
                                }
                                switch ($('#maine_4').val()) {
                                    case 'r':
                                        newVotes.republican += 1;
                                        break;
                                    case 'd':
                                        newVotes.democratic += 1;
                                        break;
                                    case 't':
                                        newVotes.tossup += 1;
                                        break;
                                    default:  // do nothing
                                        break;
                                }
                                
                                var newDVotes = oldBlue - maineVotes.democratic + newVotes.democratic;
                                var newRVotes = oldRed - maineVotes.republican + newVotes.republican;
                                var newTVotes = oldYellow - maineVotes.tossup + newVotes.tossup;
                                nhmc.charts.lowerChart.series[0].setData([{
                                    color: nhmc.config.styleColors['blue'],
                                    y: newDVotes
                                }]);
                                nhmc.charts.lowerChart.series[1].setData([{
                                    color: nhmc.config.styleColors['yellow'],
                                    y: newTVotes
                                }]);
                                nhmc.charts.lowerChart.series[2].setData([{
                                    color: nhmc.config.styleColors['red'],
                                    y: newRVotes
                                }]);
                                indicateWin(newDVotes, newRVotes, newTVotes);
                                maineVotes = newVotes;
                                
                                switch ($('#maine_popular').val() + $('#maine_4').val()) {
                                    case 'rr':
                                        nhmc.ctrl.setStateColors(['Maine'], 'red');
                                        break;
                                    case 'dd':
                                        nhmc.ctrl.setStateColors(['Maine'], 'blue');
                                        break;
                                    case 'tt':
                                        nhmc.ctrl.setStateColors(['Maine'], 'yellow');
                                        break;
                                    case 'rd':  // fall through
                                    case 'dr':
                                        nhmc.ctrl.setStateColors(['Maine'], 'purple');
                                        break;
                                    case 'rt':  // fall through
                                    case 'tr':
                                        nhmc.ctrl.setStateColors(['Maine'], 'orange');
                                        break;
                                    case 'dt':  // fall through
                                    case 'td':
                                        nhmc.ctrl.setStateColors(['Maine'], 'green');
                                        break;
                                    default:
                                        nhmc.ctrl.setStateColors(['Maine'], 'default');
                                        break;
                                }
                            }
                            
                            $('#maine_popular').change(updateMaine);
                            $('#maine_4').change(updateMaine);
                        }
                        var eventToken = nhmc.geo.usGeo['Maine'].statePath.connect('onclick', nhmc.geo.usGeo['Maine'].statePath, maineHandler);
                        nhmc.cleanup.clickHandlerTokens.push(eventToken);
                        break;
                    
                    default:
                        function genericHandler() {
                            var state = this.nhmcData.state;
                            var votes = electoralVotes['2012'].states[state];
                            
                            var oldBlue = nhmc.charts.lowerChart.series[0].data[0].y;
                            var oldRed = nhmc.charts.lowerChart.series[2].data[0].y;
                            var oldYellow = nhmc.charts.lowerChart.series[1].data[0].y;
                            
                            var newDVotes = oldBlue;
                            var newRVotes = oldRed;
                            var newTVotes = oldYellow;
                            
                            if (nhmc.geo.usGeo[state].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['red']).toString()) {
                                newRVotes = oldRed - votes;
                                newDVotes = oldBlue + votes;
                                nhmc.charts.lowerChart.series[2].setData([{
                                    color: nhmc.config.styleColors['red'],
                                    y: newRVotes
                                }]);
                                nhmc.ctrl.setStateColors([state], 'blue');
                                nhmc.charts.lowerChart.series[0].setData([{
                                    color: nhmc.config.styleColors['blue'],
                                    y: newDVotes
                                }]);
                            } else if (nhmc.geo.usGeo[state].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['blue']).toString()) {
                                newDVotes = oldBlue - votes;
                                newTVotes = oldYellow + votes;
                                nhmc.charts.lowerChart.series[0].setData([{
                                    color: nhmc.config.styleColors['blue'],
                                    y: newDVotes
                                }]);
                                nhmc.ctrl.setStateColors([state], 'yellow');
                                nhmc.charts.lowerChart.series[1].setData([{
                                    color: nhmc.config.styleColors['yellow'],
                                    y: newTVotes
                                }]);
                            } else if (nhmc.geo.usGeo[state].statePath.getFill().toString() == dojox.gfx.normalizeColor(nhmc.config.styleColors['yellow']).toString()) {
                                newTVotes = oldYellow - votes;
                                nhmc.charts.lowerChart.series[1].setData([{
                                    color: nhmc.config.styleColors['yellow'],
                                    y: newTVotes
                                }]);
                                nhmc.ctrl.setStateColors([state], 'default');
                            } else {
                                newRVotes = oldRed + votes;
                                nhmc.charts.lowerChart.series[2].setData([{
                                    color: nhmc.config.styleColors['red'],
                                    y: newRVotes
                                }]);
                                nhmc.ctrl.setStateColors([state], 'red');
                            }
                            indicateWin(newDVotes, newRVotes, newTVotes);
                        }
                        
                        var eventToken = nhmc.geo.usGeo[i].statePath.connect('onclick', nhmc.geo.usGeo[i].statePath, genericHandler);
                        nhmc.cleanup.clickHandlerTokens.push(eventToken);
                        break;
                }
            }
            
            return false;
        });
        
        return false;
    });
    
    $('.view_tab_active .view_tab_option').first().click();
});
