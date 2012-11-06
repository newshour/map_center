if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

$(document).ready(function() {
    // Configuration settings
    var config = {
        baseUrl: 'http://www.pbs.org/newshour/vote2012/map/embed/embed.php?nobranding=1',
        primaryStates: ["al", "ak", "az", "ca", "co", "ct", "de", "dc", "fl", "ga", "hi", "id", "il", "ia", "in", "ks", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nj", "nm", "nv", "nh", "nc", "nd", "ny", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy"],
        mapsWithoutUS: ["#foreclosures", "#patchwork_types"],
        mapsWithOnlyUS: ["#senate_six", "#primary_winners", "#voter_id", "#unions"]
    };
    
    // Visibility settings
    var categories = {
        "map-select-module": {
            visible: function() {
                return true;
            },
            active: null,
            $element: $('#map-select-module'),
            urlName: 'map_module'
        },
        "map-select-view": {
            visible: function() {
                return categories['map-select-module'].active !== 'electoral_college' && categories['map-select-module'].active !== 'wi_recall';
            },
            active: null,
            $element: $('#map-select-view'),
            urlName: 'map_view'
        },
        "map-select-type": {
            visible: function() {
                return categories['map-select-module'].active === 'static_maps';
            },
            active: null,
            $element: $('#map-select-type'),
            urlName: 'static_maps_type'
        },
        "map-select-index-ethnicity": {
            visible: function() {
                return categories['map-select-module'].active === 'static_maps' && categories['map-select-type'].active === 'ethnicity';
            },
            active: null,
            $element: $('#map-select-index-ethnicity'),
            urlName: 'static_maps_index'
        },
        "map-select-index-foreclosures": {
            visible: function() {
                return categories['map-select-module'].active === 'static_maps' && categories['map-select-type'].active === 'foreclosures';
            },
            active: null,
            $element: $('#map-select-index-foreclosures'),
            urlName: 'static_maps_index'
        },
        "map-select-index-unions": {
            visible: function() {
                return categories['map-select-module'].active === 'static_maps' && categories['map-select-type'].active === 'unions';
            },
            active: null,
            $element: $('#map-select-index-unions'),
            urlName: 'static_maps_index'
        },
        "map-select-index-election-race": {
            visible: function() {
                return categories['map-select-module'].active === 'general_election';
            },
            active: null,
            $element: $('#map-select-index-election-race'),
            urlName: '|race_name'
        },
        "map-select-electoral-presets": {
            visible: function() {
                return categories['map-select-module'].active === 'electoral_college';
            },
            active: null,
            $element: $('#map-select-electoral-presets'),
            urlName: '#states'
        }
    };
    var electoralStates = {
        visible: function() {
            return categories['map-select-module'].active === 'electoral_college';
        },
        $element: $('#map-select-electoral-states')
    }
    function updateVisibility() {
        for (var elementId in categories) {
            if (categories.hasOwnProperty(elementId)) {
                if (categories[elementId].visible()) {
                    categories[elementId].$element.show();
                } else {
                    categories[elementId].$element.hide();
                }
            }
        }
        if (electoralStates.visible()) {electoralStates.$element.show();}
        else {electoralStates.$element.hide();}
    }
    
    // Map Url generator
    var $broadcasterQueued = $('#broadcaster-queued');
    function updateUrl() {
        var newUrl = config.baseUrl;
        for (var elementId in categories) {
            if (categories.hasOwnProperty(elementId) && categories[elementId].visible()) {
                var firstChar = categories[elementId].urlName.substring(0, 1);
                if (categories['map-select-module'].active === 'general_election' && categories[elementId].urlName === 'map_view') {
                    newUrl += '#';
                } else if (firstChar !== '#' && firstChar !== '|') {
                    newUrl += '&';
                }
                newUrl += categories[elementId].urlName + '=' + categories[elementId].active;
            }
        }
        $broadcasterQueued.val(newUrl);
        return newUrl;
    }
    
    // Electoral College URL generation
    var nhmc = {
        geo: {
            usGeo: {"Alabama": null, "Alaska": null, "Arizona": null, "Arkansas": null, "California": null, "Colorado": null, "Connecticut": null, "Delaware": null, "District of Columbia": null, "Florida": null, "Georgia": null, "Hawaii": null, "Idaho": null, "Illinois": null, "Indiana": null, "Iowa": null, "Kansas": null, "Kentucky": null, "Louisiana": null, "Maine": null, "Maryland": null, "Massachusetts": null, "Michigan": null, "Minnesota": null, "Mississippi": null, "Missouri": null, "Montana": null, "Nebraska": null, "Nevada": null, "New Hampshire": null, "New Jersey": null, "New Mexico": null, "New York": null, "North Carolina": null, "North Dakota": null, "Ohio": null, "Oklahoma": null, "Oregon": null, "Pennsylvania": null, "Rhode Island": null, "South Carolina": null, "South Dakota": null, "Tennessee": null, "Texas": null, "Utah": null, "Vermont": null, "Virginia": null, "Washington": null, "West Virginia": null, "Wisconsin": null, "Wyoming": null}
        }
    };
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
        }
    };
    function compressStateVotes(stateVotes) {
        // Useful definitions
        var threeToOne = {
            "000": "0", "001": "1", "002": "2", "003": "3", "010": "4",
            "011": "5", "012": "6", "013": "7", "020": "8", "021": "9",
            "022": "a", "023": "b", "030": "c", "031": "d", "032": "e",
            "033": "f", "100": "g", "101": "h", "102": "i", "103": "j",
            "110": "k", "111": "l", "112": "m", "113": "n", "120": "o",
            "121": "p", "122": "q", "123": "r", "130": "s", "131": "t",
            "132": "u", "133": "v", "200": "w", "201": "x", "202": "y",
            "203": "z", "210": "A", "211": "B", "212": "C", "213": "D",
            "220": "E", "221": "F", "222": "G", "223": "H", "230": "I",
            "231": "J", "232": "K", "233": "L", "300": "M", "301": "N",
            "302": "O", "303": "P", "310": "Q", "311": "R", "312": "S",
            "313": "T", "320": "U", "321": "V", "322": "W", "323": "X",
            "330": "Y", "331": "Z", "332": "+", "333": "-"
        };
        var digitChoices = {
            "empty": "0",
            "rep": "1",
            "dem": "2",
            "toss": "3"
        };
        
        // State storage
        var compressedParts = [];
        var currentDigitGroup = '';
        
        // Go through each state in order
        var stateNames = Object.keys(nhmc.geo.usGeo).sort();
        for (var i = 0, length = stateNames.length; i < length; i++) {
            var stateName = stateNames[i];
            // Copy the thisState object so we can modify it without affecting
            // the original
            var thisState = $.extend({}, stateVotes[stateName]);
            
            // Add digits to currentDigitGroup--one for each state, except for
            // Maine and Nebraska, which can split votes and therefore will
            // have a seperate digit for each independently assignable group of
            // electoral votes
            if (stateName == 'Maine') {
                // Add winner of popular vote
                if (thisState.rep >= 3) {
                    currentDigitGroup += digitChoices.rep;
                    thisState.rep -= 3;
                } else if (thisState.dem >= 3) {
                    currentDigitGroup += digitChoices.dem;
                    thisState.dem -= 3;
                } else if (thisState.toss >= 3) {
                    currentDigitGroup += digitChoices.toss;
                    thisState.toss -= 3;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
                
                // Add winner of fourth district
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
            } else if (stateName == 'Nebraska') {
                // Add winner of popular vote
                if (thisState.rep >= 3) {
                    currentDigitGroup += digitChoices.rep;
                    thisState.rep -= 3;
                } else if (thisState.dem >= 3) {
                    currentDigitGroup += digitChoices.dem;
                    thisState.dem -= 3;
                } else if (thisState.toss >= 3) {
                    currentDigitGroup += digitChoices.toss;
                    thisState.toss -= 3;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
                
                // Add winner of fourth district
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                    thisState.rep -= 1;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                    thisState.dem -= 1;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                    thisState.toss -= 1;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
                
                // Add winner of fifth district
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
            } else {
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
            }
            
            // Three digits can be compressed at a time, so if we have at least
            // three digits ready to go, compress the first three and get them
            // out of the way.
            if (currentDigitGroup.length < 3) {
                continue;
            } else if (currentDigitGroup.length > 3) {
                compressedParts.push(threeToOne[
                    currentDigitGroup.substring(0, 3)
                ]);
                currentDigitGroup = currentDigitGroup.substring(3);
            } else {
                compressedParts.push(threeToOne[currentDigitGroup]);
                currentDigitGroup = '';
            }
        }
        
        // If there are any remaining digits to compress (i.e., there wasn't an
        // exact multiple of three), pad this last three-digit group with empty
        // digits, compress it and get it out of the way.
        if (currentDigitGroup.length > 0) {
            for (var i = currentDigitGroup.length; i < 3; i++) {
                currentDigitGroup += digitChoices.empty;
            }
            compressedParts.push(threeToOne[currentDigitGroup]);
            currentDigitGroup = '';
        }
        
        // That should take care of it!
        return compressedParts.join('');
    }
    function expandStateVotes(compressed) {
        // Useful definitions
        var oneToThree = {
            "0": "000", "1": "001", "2": "002", "3": "003", "4": "010",
            "5": "011", "6": "012", "7": "013", "8": "020", "9": "021",
            "a": "022", "b": "023", "c": "030", "d": "031", "e": "032",
            "f": "033", "g": "100", "h": "101", "i": "102", "j": "103",
            "k": "110", "l": "111", "m": "112", "n": "113", "o": "120",
            "p": "121", "q": "122", "r": "123", "s": "130", "t": "131",
            "u": "132", "v": "133", "w": "200", "x": "201", "y": "202",
            "z": "203", "A": "210", "B": "211", "C": "212", "D": "213",
            "E": "220", "F": "221", "G": "222", "H": "223", "I": "230",
            "J": "231", "K": "232", "L": "233", "M": "300", "N": "301",
            "O": "302", "P": "303", "Q": "310", "R": "311", "S": "312",
            "T": "313", "U": "320", "V": "321", "W": "322", "X": "323",
            "Y": "330", "Z": "331", "+": "332", "-": "333"
        };
        var digitChoices = {
            "0": "empty",
            "1": "rep",
            "2": "dem",
            "3": "toss"
        };
        
        // State storage
        var decompressed = [];
        var stateVotes = {};
        
        // Decompress the argument into its original three-digit groups.
        for (var i = 0, length = compressed.length; i < length; i++) {
            decompressed.push(oneToThree[compressed.charAt(i)]);
        }
        decompressed = decompressed.join('');
        
        // Go through each state in order. Because we're using the state names
        // for the main loop, any padding digits at the end of the decompressed
        // string will simply (and safely) be ignored.
        var stateNames = Object.keys(nhmc.geo.usGeo).sort();
        var decompressedIndex = 0;
        var decompressedLength = decompressed.length;
        if (decompressedLength < (stateNames.length + 3)) {
            // If there aren't enough digits in the decompressed string to
            // figure out each state (including the extra district in Maine and
            // the two extra districts in Nebraska), don't bother with the
            // rest; return an empty object instead so we know something went
            // wrong.
            return {};
        }
        for (var i = 0, length = stateNames.length; i < length; i++) {
            var stateName = stateNames[i];
            stateVotes[stateName] = {
                "rep": 0,
                "dem": 0,
                "toss": 0
            };
            
            if (stateName == 'Maine') {
                // Handle Maine's popular vote.
                var popularVote = digitChoices[
                    decompressed.charAt(decompressedIndex)
                ];
                if (popularVote != 'empty') {
                    stateVotes[stateName][popularVote] += 3;
                } else if (popularVote == null) {
                    // Also works for undefined (not checking strict equality).
                    // If popularVote doesn't make sense, return an empty
                    // object so we know something went wrong.
                    return {};
                }
                // Handle Maine's fourth district.
                var fourthDistrict = digitChoices[
                    decompressed.charAt(decompressedIndex + 1)
                ];
                if (fourthDistrict != 'empty') {
                    stateVotes[stateName][fourthDistrict] += 1;
                } else if (fourthDistrict == null) {
                    return {};
                }
                decompressedIndex += 2;
            } else if (stateName == 'Nebraska') {
                // Handle Nebraska's popular vote.
                var popularVote = digitChoices[
                    decompressed.charAt(decompressedIndex)
                ];
                if (popularVote != 'empty') {
                    stateVotes[stateName][popularVote] += 3;
                } else if (popularVote == null) {
                    return {};
                }
                // Handle Nebraska's fourth district.
                var fourthDistrict = digitChoices[
                    decompressed.charAt(decompressedIndex + 1)
                ];
                if (fourthDistrict != 'empty') {
                    stateVotes[stateName][fourthDistrict] += 1;
                } else if (fourthDistrict == null) {
                    return {};
                }
                // Handle Nebraska's fifth district.
                var fifthDistrict = digitChoices[
                    decompressed.charAt(decompressedIndex + 2)
                ];
                if (fifthDistrict != 'empty') {
                    stateVotes[stateName][fifthDistrict] += 1;
                } else if (fifthDistrict == null) {
                    return {};
                }
                decompressedIndex += 3;
            } else {
                var stateVote = digitChoices[
                    decompressed.charAt(decompressedIndex)
                ];
                var stateElectoralVotes = electoralVotes["2012"].states[stateName];
                if (stateVote != 'empty') {
                    stateVotes[stateName][stateVote] += stateElectoralVotes;
                } else if (stateVote == null) {
                    return {};
                }
                decompressedIndex += 1;
            }
        }
        
        return stateVotes;
    }
    var currentStateVotes = {};
    var resetStateVotes = function() {
        for (var stateName in nhmc.geo.usGeo) {
            if (nhmc.geo.usGeo.hasOwnProperty(stateName)) {
                currentStateVotes[stateName] = {
                    rep: 0,
                    dem: 0,
                    toss: 0
                };
            }
        }
    };
    resetStateVotes();
    // Table data population
    $('#map-select-electoral-states tbody tr').each(function(i, elem) {
        var $row = $(elem);
        if (typeof($row.find('a').first().data('state')) === 'undefined') {
            var stateName = $row.children('td').first().text();
            $row.find('a').each(function(i, elem) {
                var $link = $(this);
                $link.data({
                    state: stateName,
                    votes: electoralVotes['2012'].states[stateName]
                });
            });
        }
    });
    function compressFromTable() {
        var propNames = {
            "R": "rep",
            "D": "dem",
            "T": "toss"
        };
        resetStateVotes();
        $('#map-select-electoral-states tbody tr').each(function(i, elem) {
            var $row = $(elem);
            var $active = $row.find('.active a');
            if ($active.length > 0) {
                var stateName = $active.data('state');
                var stateParty = $active.attr('href').substring(1);
                if (stateParty !== 'off') {
                    var stateVotes = $active.data('votes');
                    currentStateVotes[stateName][stateParty] += stateVotes;
                }
            }
        });
        return compressStateVotes(currentStateVotes);
    }
    function expandToTable() {
        var compressed = categories['map-select-electoral-presets'].active;
        currentStateVotes = expandStateVotes(compressed);
        $('#map-select-electoral-states tbody tr').each(function(i, elem) {
            var $row = $(elem);
            $row.find('.active').removeClass('active');
            var $firstLink = $row.find('a').first();
            var stateName = $firstLink.data('state');
            var stateVotes = $firstLink.data('votes');
            var allStateVotes = $.extend({}, currentStateVotes);
            for (var stateParty in allStateVotes[stateName]) {
                if (allStateVotes[stateName].hasOwnProperty(stateParty)) {
                    if (allStateVotes[stateName][stateParty] > 0) {
                        var $partyLink = $row.find('a[href="#' + stateParty + '"]');
                        $partyLink.parents('td').addClass('active');
                        allStateVotes[stateName][stateParty] -= stateVotes;
                        break;
                    }
                }
            }
        });
    }
    
    $('#map-select-electoral-states a').click(function(event) {
        var $this = $(this);
        $this.parents('td').addClass('active').siblings().removeClass('active');
        var compressed = compressFromTable();
        categories['map-select-electoral-presets'].active = compressed;
        categories['map-select-electoral-presets'].$element.find('.active').removeClass('active');
        updateUrl();
        event.preventDefault();
    });
    
    // Initialize options by preselecting the first option in each category.
    (function() {
        for (var elementId in categories) {
            if (categories.hasOwnProperty(elementId)) {
                var $firstChild = categories[elementId].$element.children('ul').first();
                var $firstChildLink = $firstChild.find('a').first();
                var firstChildValue = $firstChildLink.attr('href').substring(1);
                categories[elementId].active = firstChildValue;
                $firstChildLink.parent().addClass('active');
            }
        }
        updateVisibility();
        expandToTable();
        updateUrl();
    })();
    
    // Switch active elements as new options are selected.
    $('.category a').click(function(event) {
        var $this = $(this);
        var categoryId = $this.parents('.category').attr('id');
        categories[categoryId].active = $this.attr('href').substring(1);
        $this.parents('li').addClass('active').siblings().removeClass('active');
        expandToTable();
        updateVisibility();
        updateUrl();
        event.preventDefault();
    });
});
