namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");
namespace("nhmc.tooltips");

nhmc.autoRefreshIntervalId = null;

$(document).one('coreInitialized', function() {
    // Add local references for performance reasons
    var countyGeo = nhmc.geo.countyGeo;
    var usGeo = nhmc.geo.usGeo;
    var FIPSToCounty = nhmc.config.FIPSToCounty;
    
    // Local storage for results data
    var latestData = {};
    var latestFullData = {};
    
    // Configuration details, including support for override by declaring
    // values in nhmcOtherVotesConfig
    var config = {
        autoRefresh: false,
        autoRefreshDelay: 1000 * 15,
        bigCandidates: 3,
        blankMap: false,
        candidateColors: {
           "No Preference": "#000000",
           "Other": "#838282"
        },
        candidateImages: {},
        condenseCandidates: false,
        defaultRaceNames: {},
        flyoutsEnabled: false,
        friendlyRaceNames: {
            "President - GOP": "President (R)"
        },
        randomColors: [
            // ColorBrewer Set2 with eight classes
            "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3",
            "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3",
            // ColorBrewer Dark2 with eight classes
            "#1b9e77", "#d95f02", "#7570b3", "#e7298a",
            "#66a61e", "#e6ab02", "#a6761d", "#666666"
        ],
        showCandidates: {},
        showRaces: [],
        strokeHighlight: "#9F1C20",
        tooltipsEnabled: true
    };
    if (typeof(nhmcOtherVotesConfig) != 'undefined') {
        $.extend(true, config, nhmcOtherVotesConfig);
    }
    
    // General-purpose utility functions
    var formatThousands = function(value, decimalPlaces, alwaysDecimalize) {
        // Set default decimal formatting values if undefined
        decimalPlaces = (typeof decimalPlaces == 'undefined') ? 1 : decimalPlaces;
        alwaysDecimalize = (typeof alwaysDecimalize == 'undefined') ? false : alwaysDecimalize;
        
        var wholePart = Math.floor(Math.abs(value)) + '';  // coerce to string
        
        var signPart = '';
        if (value < 0) {signPart = '-';}
        
        var decimalPart = '';
        if (alwaysDecimalize || value % 1 != 0) {
            decimalPart = (Math.abs(value) % 1).toFixed(decimalPlaces);
            decimalPart = decimalPart.substring(1);  // remove leading zero
        }
        
        var withCommas = wholePart;
        var commasToAdd = Math.floor(withCommas.length / 3);
        if (withCommas.length % 3 == 0) {commasToAdd -= 1;}
        for (var i = 0; i < commasToAdd; i++) {
            var firstComma = withCommas.indexOf(',');
            if (firstComma >= 0) {
                withCommas = withCommas.substring(0, firstComma-3) +
                    ',' + withCommas.substring(firstComma-3);
            } else {
                withCommas = withCommas.substring(0, withCommas.length-3) +
                    ',' + withCommas.substring(withCommas.length-3);
            }
        }
        return signPart + withCommas + decimalPart;
    };
    var formatDate = function(year, month, day, hour, minute) {
        var monthAbbrs = {
            // These are Python datetime month keys, not JavaScript ones (which
            //  differ by one). Don't worry, I'm not forgetting.
            1: 'Jan.',
            2: 'Feb.',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'Aug.',
            9: 'Sept.',
            10: 'Oct.',
            11: 'Nov.',
            12: 'Dec.'
        };
        var timeStringParts = [];
        
        // Convert hour from 24-hour time.
        if (hour > 12) {timeStringParts.push((hour - 12) + '');}
        else if (hour == 0) {timeStringParts.push('12');}
        else {timeStringParts.push(hour + '');}
        
        // Add minute, zero-padding if necessary
        if (minute != 0) {
            if (minute < 10) {timeStringParts.push(':0' + minute);}
            else {timeStringParts.push(':' + minute);}
        }
        
        // Add a.m. or p.m.
        if (hour < 12) {timeStringParts.push(' a.m., ');}
        else {timeStringParts.push(' p.m., ');}
        
        // Add month and day
        timeStringParts.push(monthAbbrs[month] + ' ' + day);
        
        // Done!
        return timeStringParts.join('');
    };
    var numericalSort = function(a, b) {
        return parseInt(a, 10) - parseInt(b, 10);
    };
    
    // Color assignments
    var colorAssignments = {};
    var colorsUsed = {};
    var getColor = function(candidateName, state, raceNumber) {
        if (config.candidateColors[candidateName]) {
            // If we have a specific color defined for this candidate, use it.
            return config.candidateColors[candidateName];
        } else {
            // Otherwise, we need to select a "random" color for the candidate.
            // This color should remain consistent for at least as long as this
            // specific map is continuously displayed; otherwise, the colors on
            // the map are likely to change dramatically every time the data
            // refreshes (every 15 seconds by default). Given that constraint,
            // let's see whether we've previously assigned a color to this
            // particular candidate in this race. If we have, use that color
            // again; if not, find one and store it for later use.
            
            // First, make sure all of our data structures are set up the way
            // we expect.
            if (colorAssignments[state]) {
                if (!colorAssignments[state][raceNumber]) {
                    colorAssignments[state][raceNumber] = {};
                    colorsUsed[state][raceNumber] = [];
                }
            } else {
                colorAssignments[state] = {};
                colorAssignments[state][raceNumber] = {};
                colorsUsed[state] = {};
                colorsUsed[state][raceNumber] = [];
            }
            
            if (colorAssignments[state][raceNumber][candidateName]) {
                // Great! We've assigned a color to this candidate before. Use
                // that one.
                return colorAssignments[state][raceNumber][candidateName];
            } else {
                // Go through each of the preselected "random" colors until we
                // find one that hasn't been used in this race.
                for (var i = 0, length = config.randomColors.length; i < length; i++) {
                    var thisColor = config.randomColors[i];
                    if (colorsUsed[state][raceNumber].indexOf(thisColor) == -1) {
                        // Found one! Store it for later retrieval before we
                        // send it out into the world.
                        colorAssignments[state][raceNumber][candidateName] = thisColor;
                        colorsUsed[state][raceNumber].push(thisColor);
                        return thisColor;
                    }
                }
            }
        }
        
        // If we still haven't found anything yet, just call it "Other".
        return config.candidateColors["Other"];
    };
    
    // In case we need to condense candidates (i.e., group some into an "Other"
    // category), this is how to do it.
    var condenseCandidates = function(data) {
        if (config.showRaces.length != 0) {
            var condensedData = {
                "candidates": {},
                "lastUpdated": raceData.lastUpdated,
                "races": {},
                "raceNames": {},
                "test": raceData.test
            };
            // Make sure we don't inadvertently modify our original data
            $.extend(condensedData.candidates, data.candidates);
            
            // Be ready for "Other" where we need it.
            var otherCandidateId = "OTHER_CONDENSED";
            condensedData.candidates[otherCandidateId] = "Other";
            
            for (var i = 0, length = config.showRaces.length; i < length; i++) {
                var raceName = config.showRaces[i];
                var raceNumber = null;
                // Store the names of all desired races.
                for (var possibleRaceNumber in raceData.raceNames) {
                    if (raceData.raceNames[possibleRaceNumber] === raceName) {
                        raceNumber = possibleRaceNumber;
                        condensedData.raceNames[raceNumber] = raceName;
                        break;
                    }
                }
                if (raceNumber) {
                    if (config.showCandidates[raceName] && !$.isEmptyObject(config.showCandidates[raceName])) {
                        var oldRaceData = raceData.races[raceNumber];
                        var newRaceData = {
                            "areas": {},
                            "breakdown": [],
                            "precincts": oldRaceData.precincts,
                            "winners": {}
                        };
                        
                        // Keep a list of all of the candidate IDs we want to
                        // leave intact.
                        var showCandidateIds = [];
                        for (var j = 0, jLength = config.showCandidates[raceName].length; j < jLength; j++) {
                            var candidateName = config.showCandidates[raceName][j];
                            var candidateId = '';
                            for (var possibleCandidateId in data.candidates) {
                                if (data.candidates[possibleCandidateId] === candidateName) {
                                    candidateId = possibleCandidateId;
                                    showCandidateIds.push(candidateId);
                                    break;
                                }
                            }
                        }
                        
                        // Build new area objects.
                        for (var areaName in oldRaceData.areas) {
                            var oldAreaData = oldRaceData.areas[areaName];
                            var newAreaData = {
                                "data": [],
                                "precincts": oldAreaData.precincts
                            };
                            
                            var otherTotal = 0;
                            var otherCount = 0;
                            for (var j = 0, jLength = oldAreaData.raceData.length; j < jLength; j++) {
                                var candidateId = oldAreaData.data[j][0];
                                var candidateVotes = oldAreaData.data[j][1];
                                
                                if (showCandidateIds.indexOf(candidateId) != -1) {
                                    // Keep this one.
                                    newAreaData.raceData.push([
                                        candidateId, candidateVotes
                                    ]);
                                } else {
                                    // Save it for later.
                                    otherTotal += candidateVotes;
                                    otherCount += 1;
                                }
                            }
                            
                            // Add the "Other" entry at the end if necessary.
                            if (otherCount > 0) {
                                newAreaData.raceData.push([
                                    otherCandidateId, otherTotal
                                ]);
                            }
                            
                            // Store this and move on to the next one.
                            newRaceData.areas[areaName] = newAreaData;
                        }
                        
                        // Change the called winner in each area to "Other" if
                        // necessary.
                        for (var areaName in oldRaceData.winners) {
                            var candidateId = oldRaceData.winners[areaName];
                            if (showCandidateIds.indexOf(candidateId) != -1) {
                                newRaceData.winners[areaName] = candidateId;
                            } else {
                                newRaceData.winners[areaName] = otherCandidateId;
                            }
                        }
                        
                        // The breakdown for the race is the same as that for
                        // the current state being displayed.
                        newRaceData.breakdown = newRaceData.areas[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].data;
                        
                        // Store this race and move on to the next one.
                        condensedData.races[raceNumber] = newRaceData;
                    }
                }
            }
            return condensedData;
        } else {
            return data;
        }
    };
    
    var liveDataInit = function(data) {
        // debugger;
        // Get the currently displayed race number.
        var initialRaceNumber = $('#view_tab_options_more_shown').attr('href')
            .split('-')[1];
        
        // Get ready to render the race menu again if we need to.
        var newState = $('#map_view').val();
        var renderMenu = function() {
            // Clear out the existing race menu.
            $('#view_tab_options_more_menu').empty();
            
            // Fill it back up.
            for (var i = 0, length = newRaces.numbers.length; i < length; i++) {
                var raceNumber = newRaces.numbers[i];
                var raceName = newRaces.names[raceNumber];
                
                var elem = $('<li><a class="view_tab_option"></a></li>');
                var elemLink = elem.children('.view_tab_option');
                elemLink.attr('href', [
                    '#', newState.toLowerCase(), '-', raceNumber
                ].join('')).text(raceName);
                $('#view_tab_options_more_menu').append(elem);
            }
            
            // Select the first race (lowest race number).
            initialRaceNumber = newRaces.numbers[0];
            $('#view_tab_options_more_shown')
                .text(newRaces.names[initialRaceNumber])
                .attr('href', [
                    '#', newState.toLowerCase(), '-', initialRaceNumber
                ].join(''));
        };
        
        // Compare the current and proposed contents of the race menu to see if
        // they differ. If they do, render the race menu.
        var oldRaces = (function() {
            var races = {
                names: {},
                numbers: []
            };
            $('#view_tab_options_more_menu .view_tab_option')
            .each(function(i, elem) {
                var stateRaceId = $(elem).attr('href').substring(1);
                var stateRaceIdComponents = stateRaceId.split('-');
                
                // If the races in the menu aren't from the same state that's
                // currently showing, we immediately know the comparison between
                // old and new race names and numbers is going to fail. There's
                // no reason to keep going through this loop.
                var oldState = stateRaceIdComponents[0];
                if (oldState != newState) {return false;}
                
                var raceNumber = stateRaceIdComponents[1];
                races.numbers.push(raceNumber);
                races.names[raceNumber] = $(elem).text();
            });
            races.numbers.sort(numericalSort);  // Remember, sorts are in place.
            return races;
        })();
        var newRaces = (function() {
            var races = {
                names: {},
                numbers: []
            };
            races.numbers = Object.keys(data.raceNames).sort(numericalSort);
            for (var i = 0, length = races.numbers.length; i < length; i++) {
                var raceNumber = races.numbers[i];
                var raceName = data.raceNames[raceNumber];
                if (config.friendlyRaceNames[raceName]) {
                    raceName = config.friendlyRaceNames[raceName];
                }
                races.names[raceNumber] = raceName;
            }
            return races;
        })();
        for (var i = 0, length = newRaces.numbers.length; i < length; i++) {
            var oldRaceNumber = oldRaces.numbers[i];
            var newRaceNumber = newRaces.numbers[i];
            if (newRaceNumber != oldRaceNumber) {
                // We know there's a mismatch between what's currently shown and
                // what's in this data set. Go ahead and render the menu and
                // break out of here already.
                renderMenu();
                break;
            }
        }
        
        // Render the date/time information and selected race from this data.
        $('#last_updated').text(formatDate.apply(formatDate, data.lastUpdated));
        displayRaceData(data, initialRaceNumber);
        
        // Mark the page as containing test data if applicable.
        if (data.test && $('#test_data').length == 0) {
            $('#view_info h1').append(' <span id="test_data">(test)</span>');
        } else if (!data.test) {
            $('#test_data').remove();
        }
    };
    
    // Show a particular race from within our overall state data object. This
    // includes rendering the legend and coloring the map areas.
    var displayRaceData = function(data, raceNumber) {
        var raceData = data.races[raceNumber];
        if (typeof(raceData) == 'undefined') {return;}
        
        // Fill all areas on the map that the specified candidate has won.
        var fillAreas = function(candidateId, clearFill) {
            // Default clearFill to false if not provided
            clearFill = (typeof clearFill == 'undefined') ? false : clearFill;
            
            // Are we clearing these out (i.e., filling with the default color)?
            if (clearFill || config.blankMap) {
                var areaFill = nhmc.config.defaultAttributes.fill;
            } else {
                var areaFill = getColor(
                    data.candidates[candidateId],
                    $('#map_view').val(), raceNumber
                );
            }
            
            // Color each area appropriately.
            for (var areaId in raceData.areas) {
                // Are we:
                //     * in an area where this candidate has won?
                //     * in an area with results in?
                //     * in an area with precincts listed as reporting?
                // If so, color the area.
                if (candidateId == raceData.areas[areaId].data[0][0]
                        && raceData.areas[areaId].data[0][1] != 0
                        && raceData.areas[areaId].precincts[0] != 0) {
                    var mapView = $('#map_view').val();
                    if (mapView == 'us_counties') {
                        var countyPath = countyGeo[areaId];
                        if (countyPath != undefined) {
                            countyPath.setFill(areaFill);
                        }
                    } else if (mapView == 'us_all') {
                        var statePath = usGeo[areaId].statePath;
                        if (statePath != undefined) {
                            statePath.setFill(areaFill);
                        }
                    } else {
                        var FIPSData = FIPSToCounty[areaId];
                        if (FIPSData != undefined) {
                            var state = FIPSData[0];
                            var county = FIPSData[1];
                            if (usGeo[state] != undefined) {
                                var stateCountyPath = usGeo[state].countyPaths[county];
                                if (stateCountyPath != undefined) {
                                    stateCountyPath.setFill(areaFill);
                                }
                            }
                        }
                    }
                }
            }
        };
        
        // Show how many precincts are reporting for this race.
        $('#precincts_percent').text((
            100 * raceData.precincts[0] / raceData.precincts[1]
        ).toFixed(1));
        $('#precincts_reporting').text(raceData.precincts[0]);
        $('#precincts_total').text(raceData.precincts[1]);
        
        // Start rendering the template.
        // 
        // We need to start figuring out percentages, so start off by finding
        // the total number of votes cast in this race.
        var stateTotalVotes = 0;
        for (var i = 0, length = raceData.breakdown.length; i < length; i++) {
            stateTotalVotes += raceData.breakdown[i][1];
        }
        
        // Clear out the legend since we're about to fill it back up again.
        $('#legend_candidates').empty();
        
        // Go through every candidate to render its legend entry and color its
        // respective map areas.
        for (var i = 0, length = raceData.breakdown.length; i < length; i++) {
            var candidateId = raceData.breakdown[i][0];
            
            // What's the candidate's last name?
            var candidateName = data.candidates[candidateId];
            var candidateNameParts = candidateName.split(' ');
            var candidateLastName = candidateNameParts[
                candidateNameParts.length - 1
            ];
            
            // Now that we have a total number of votes cast, let's figure out
            // the candidate's vote percent. (This will be NaN if nobody has
            // any votes at all yet, so make sure to account for that.)
            var candidateVotePercent = 100 * (
                raceData.breakdown[i][1] / stateTotalVotes
            );
            if (stateTotalVotes == 0) {candidateVotePercent = 0;}
            
            // Figure out whether we're showing a "big" or "small" legend entry
            // for this candidate.
            if (i <= config.bigCandidates - 1) {
                var legendEntry = $('#legend_templates .candidate_big')
                    .clone().appendTo('#legend_candidates');
            } else {
                var legendEntry = $('#legend_templates .candidate_small')
                    .clone().appendTo('#legend_candidates');
            }
            
            legendEntry.find('.candidate_color').css(
                'background-color',
                getColor(
                    data.candidates[candidateId],
                    $('#map_view').val(), raceNumber
                )
            );
            legendEntry.find('.candidate_vote_count').text(
                formatThousands(raceData.breakdown[i][1])
            );
            legendEntry.find('.candidate_votes').text(
                Math.round(candidateVotePercent) + '%'
            );
            
            // Add the candidate's name, of course. (The "first" name should be
            // an empty string if the candidate name is only one word (e.g.,
            // "For" or "Against").)
            legendEntry.find('.candidate_name').find('.candidate_name_first')
                .text(candidateNameParts.slice(0, -1).join(' '));
            legendEntry.find('.candidate_name').find('.candidate_name_last')
                .text(candidateLastName);
            // Regardless of what the styles try to do, make sure we show the
            // full name "No Preference" if it applies. (Try to show the
            // element if it exists; otherwise just shoehorn this into the
            // last-name field.)
            if (candidateLastName.toLowerCase() == 'preference') {
                var candidateFirstNameElem = legendEntry
                    .find('.candidate_name').find('.candidate_name_first');
                if (candidateFirstNameElem.length != 0) {
                    candidateFirstNameElem.show();
                } else {
                    legendEntry.find('.candidate_name')
                        .find('.candidate_name_last')
                        .text(candidateNameParts.join(' '));
                }
            }
            
            // Show the candidate's image if we have one, and cache it for
            // later to avoid flicker.
            if (config.candidateImages[data.candidates[candidateId]]) {
                var candidateImage = $('#legend_images .candidate_image_' + candidateId);
                if (candidateImage.length) {
                    legendEntry.find('.candidate_image')
                        .replaceWith(candidateImage.clone());
                } else {
                    legendEntry.find('.candidate_image')
                        .attr(
                            'src',
                            config.candidateImages[data.candidates[candidateId]]
                        ).addClass('candidate_image_' + candidateId).clone()
                        .appendTo('#legend_images');
                }
            }
            
            // Check whether AP has called the race in favor of this candidate.
            // If so, mark the candidate's legend entry appropriately.
            var stateShowing = $('#map_view').val().toUpperCase();
            var winnerId = "";
            winnerId = raceData.winners[nhmc.config.USPSToState[stateShowing]];
            if (winnerId == candidateId) {
                legendEntry.find('.candidate_won').show();
                legendEntry.addClass('candidate_winner');
            }
            
            // Oh yeah, make sure to color the areas this candidate won.
            fillAreas(candidateId);
        }
        
        // Now to figure out the tooltips.
        if (config.tooltipsEnabled) {
            nhmc.tooltips.render = function() {
                // If we're using flyout tooltips, highlight the selected area.
                if (config.flyoutsEnabled) {
                    this.setStroke({
                        color: config.strokeHighlight,
                        width: 3
                    });
                    this.moveToFront();
                    
                    // Just to make sure the cities aren't covered up in the
                    // process, move all of those to the front again.
                    for (var i in nhmc.geo.usGeo[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].cityPaths) {
                        var path = nhmc.geo.usGeo[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].cityPaths[i];
                        path.moveToFront();
                    }
                }
                
                // Figure out the identifiers for the selected area.
                var thisFIPS = '';
                var thisState = '';
                var thisCounty = '';
                if (this.nhmcData.county_fips != undefined) {
                    thisFIPS = this.nhmcData.county_fips;
                    thisCounty = nhmc.config.FIPSToCounty[thisFIPS][1];
                    thisState = nhmc.config.FIPSToCounty[thisFIPS][0];
                } else if (this.nhmcData.county != undefined) {
                    thisState = nhmc.config.USPSToState[
                        $('#map_view').val().toUpperCase()
                    ];
                    thisCounty = this.nhmcData.county;
                    thisFIPS = nhmc.config.countyToFIPS[thisState][thisCounty];
                } else {
                    thisState = this.nhmcData.state;
                }
                
                // Start building the tooltip element. Much like in the legend
                // (see above), we'll be using a lot of cloning to allow for
                // templating and such.
                var tooltip = $('<div id="tooltip"></div>').appendTo('body');
                if (config.flyoutsEnabled) {tooltip.addClass('tooltip_flyout');}
                var tooltipContent = $('#tooltip_template .tooltip_content')
                    .clone().appendTo('#tooltip');
                
                // Add the title (human-friendly name of the selected area) for
                // the tooltip.
                if (this.nhmcData.county != undefined) {
                    tooltipContent.find('.tooltip_name').text(thisCounty);
                } else if (thisCounty != '') {
                    tooltipContent.find('.tooltip_name')
                        .text(thisCounty + ', ' + thisState);
                } else {
                    tooltipContent.find('.tooltip_name').text(thisState);
                }
                
                // Get the results for this specific area (or default to an
                // empty object if we don't have any).
                var areaName = thisCounty != '' ? thisFIPS : thisState;
                var areaResults = raceData.areas[areaName] || {
                    "data": [],
                    "precincts": [0, 0]
                };
                
                // Display this area's precinct metadata.
                tooltipContent.find('.tooltip_precincts_percent')
                    .text((100 * (
                        areaResults.precincts[0] / areaResults.precincts[1]
                    )).toFixed(1));
                tooltipContent.find('.tooltip_precincts_reporting')
                    .text(areaResults.precincts[0]);
                tooltipContent.find('.tooltip_precincts_total')
                    .text(areaResults.precincts[1]);
                
                // If there are any precincts reporting in this area, show a
                // breakdown of the results.
                if (areaResults.precincts[0] != 0) {
                    // Total the votes cast in this area so we can figure out
                    // percentages for each candidate.
                    var areaTotalVotes = 0;
                    for (var i = 0, length = areaResults.data.length; i < length; i++) {
                        areaTotalVotes += areaResults.data[i][1];
                    }
                    
                    // Clear out the list of candidates...
                    var tooltipCandidates = tooltipContent.find('.tooltip_candidates');
                    tooltipCandidates.empty();
                    
                    // ...and fill it back up.
                    for (var i = 0, length = areaResults.data.length; i < length; i++) {
                        var candidateId = areaResults.data[i][0];
                        
                        // What's the candidate's last name?
                        var candidateName = data.candidates[candidateId];
                        var candidateNameParts = candidateName.split(' ');
                        var candidateLastName = candidateNameParts[
                            candidateNameParts.length - 1
                        ];
                        
                        // Add the candidate's entry to this tooltip.
                        var tooltipEntry = tooltipContent
                            .find('.tooltip_templates .tooltip_candidate')
                            .clone().appendTo(tooltipCandidates);
                        
                        // Add a color (if applicable) to the candidate's
                        // entry.
                        tooltipEntry.find('.tooltip_candidate_color').css(
                            'background-color',
                            getColor(
                                data.candidates[candidateId],
                                $('#map_view').val(), raceNumber
                            )
                        );
                        
                        // What percentage of the total votes in this area did
                        // the candidate receive?
                        var candidateVotePercent = 100 * (
                            areaResults.data[i][1] / areaTotalVotes
                        );
                        if (areaTotalVotes == 0) {candidateVotePercent = 0;}
                        
                        // Fill in vote numbers for the candidate.
                        tooltipEntry.find('.tooltip_candidate_vote_count')
                            .text(formatThousands(areaResults.data[i][1]));
                        tooltipEntry.find('.tooltip_candidate_votes')
                            .text(Math.round(candidateVotePercent) + '%');
                        
                        // And--last, but not least--the name.
                        tooltipEntry.find('.tooltip_candidate_name_first')
                            .text(candidateNameParts.slice(0, -1).join(' '));
                        tooltipEntry.find('.tooltip_candidate_name_last')
                            .text(candidateLastName);
                        if (candidateLastName.toLowerCase() == 'preference') {
                            var candidateFirstNameElem = tooltipEntry
                                .find('.tooltip_candidate_name_first');
                            if (candidateFirstNameElem.length != 0) {
                                candidateFirstNameElem.show();
                            } else {
                                tooltipEntry
                                    .find('.tooltip_candidate_name_last')
                                    .text(candidateNameParts.join(' '));
                            }
                        }
                    }
                }
                
                // If we're on a touch device, add a close button so the user
                // can get rid of this thing when they're done with it.
                if (Modernizr.touch) {nhmc.tooltips.addClose();}
            };
        }
        
        // Add some touch-specific modifications if we're using flyout (i.e.,
        // broadcast touch-specific) tooltips.
        if (config.tooltipsEnabled && config.flyoutsEnabled) {
            // Positioning should be handled in the page styles.
            nhmc.tooltips.position = $.noop;
            
            nhmc.tooltips.destroy = function() {
                $('#tooltip').remove();
                for (var i = 0, length = nhmc.surface.children.length; i < length; i++) {
                    var child = nhmc.surface.children[i];
                    if (typeof(child.nhmcData) != 'undefined') {
                        child.setStroke(nhmc.config.defaultAttributes.stroke);
                    }
                }
            };
        }
        
        // Assuming everything's good to go with tooltips (i.e., there aren't
        // any already), let's bind their event handlers!
        if (nhmc.tooltips.hoverHandlerTokens.length == 0) {
            nhmc.tooltips.init();
        }
        
        // Give the user a way to see all of the "Other" results if we've
        // condensed some of the candidates into that entry.
        if (config.condenseCandidates && config.hoverExpandOther) {
            // Find the "Other" legend entry.
            var otherElement = $('.candidate_small').filter(function(i) {
                var candidateName = $(this).find('.candidate_name');
                if (candidateName.find('.candidate_name_last').text() == 'Other' && candidateName.find('.candidate_name_first').text() == '') {
                    return true;
                } else {
                    return false;
                }
            });
            
            // Render this using the template we used for the area tooltips.
            var otherTooltip = {};
            otherTooltip.xOffset = nhmc.tooltips.xOffset;
            otherTooltip.yOffset = nhmc.tooltips.yOffset;
            otherTooltip.render = function(e) {
                $('#other_tooltip').remove();
                
                var latestStateData = latestFullData[$('#map_view').val()];
                
                var tooltip = $('<div id="other_tooltip"></div>')
                    .appendTo('body');
                if (config.flyoutsEnabled) {tooltip.addClass('tooltip_flyout');}
                var tooltipContent = $('#tooltip_template .tooltip_content')
                    .clone().appendTo('#other_tooltip');
                
                // Add the title, of course, and get rid of the precincts
                // information (since that's already elsewhere in the legend).
                tooltipContent.find('.tooltip_name').text('Other candidates');
                tooltipContent.find('.tooltip_precincts_percent').parent()
                    .remove();
                
                // Clear out the list of candidates...
                var tooltipCandidates = tooltipContent.find('.tooltip_candidates');
                tooltipCandidates.empty();
                
                // ...and fill it back up.
                var raceResults = raceData.breakdown;
                for (var i = 0, length = raceResults.length; i < length; i++) {
                    var candidateId = raceResults[i][0];
                    
                    // Is this candidate already shown in the legend?
                    var candidateName = data.candidates[candidateId];
                    if (config.showCandidates.indexOf(candidateName) == -1) {
                        // What's the candidate's last name?
                        var candidateNameParts = candidateName.split(' ');
                        var candidateLastName = candidateNameParts[
                            candidateNameParts.length - 1
                        ];
                        
                        // Add the candidate's entry to this tooltip.
                        var tooltipEntry = tooltipContent
                            .find('.tooltip_templates .tooltip_candidate')
                            .clone().appendTo(tooltipCandidates);
                        
                        // Add the "Other" color to the candidate's entry if
                        // needed.
                        tooltipEntry.find('.tooltip_candidate_color').css(
                            'background-color',
                            config.candidateColors['Other']
                        );
                        
                        // What percentage of the total votes in this state did
                        // the candidate receive?
                        var candidateVotePercent = 100 * (
                            raceResults[i][1] / stateTotalVotes
                        );
                        if (areaTotalVotes == 0) {candidateVotePercent = 0;}
                        
                        // Fill in vote numbers for the candidate.
                        tooltipEntry.find('.tooltip_candidate_vote_count')
                            .text(formatThousands(raceResults[i][1]));
                        tooltipEntry.find('.tooltip_candidate_votes')
                            .text(Math.round(candidateVotePercent) + '%');
                        
                        // And--last, but not least--the name.
                        tooltipEntry.find('.tooltip_candidate_name_first')
                            .text(candidateNameParts.slice(0, -1).join(' '));
                        tooltipEntry.find('.tooltip_candidate_name_last')
                            .text(candidateLastName);
                        if (candidateLastName.toLowerCase() == 'preference') {
                            var candidateFirstNameElem = tooltipEntry
                                .find('.tooltip_candidate_name_first');
                            if (candidateFirstNameElem.length != 0) {
                                candidateFirstNameElem.show()
                            } else {
                                tooltipEntry
                                    .find('.tooltip_candidate_name_last')
                                    .text(candidateNameParts.join(' '));
                            }
                        }
                    }
                }
                
                // If we're on a touch device, add a close button so the user
                // can get rid of this thing when they're done with it.
                if (Modernizr.touch) {otherTooltip.addClose();}
                
                otherTooltip.position(e);
            };
            if (config.tooltipsEnabled && config.flyoutsEnabled) {
                otherTooltip.position = $.noop;
            } else {
                otherTooltip.position = function(e) {
                    var tooltip = $('#other_tooltip');
                    if (e.pageX + tooltip.width() + otherTooltip.yOffset <= $('body').width()) {
                        tooltip.css('left', (e.pageX + otherTooltip.yOffset) + 'px');
                    } else {
                        tooltip.css('left', (e.pageX - otherTooltip.yOffset - tooltip.width()) + 'px');
                    }
                    if (e.pageY + tooltip.height() - otherTooltip.xOffset <= $('body').height()) {
                        tooltip.css('top', (e.pageY - otherTooltip.xOffset) + 'px');
                    } else {
                        tooltip.css('top', (e.pageY - otherTooltip.xOffset - tooltip.height()) + 'px');
                    }
                };
            }
            otherTooltip.addClose = function() {
                $('<a href="#" id="other_tooltip_close" class="ui-icon ui-icon-closethick">Close</a>').prependTo('#other_tooltip').click(function() {
                    otherTooltip.destroy();
                    otherTooltip.bindHover();
                    return false;
                });
            };
            otherTooltip.destroy = function() {
                $('#other_tooltip').remove();
            };
            otherTooltip.bindHover = function() {
                if (Modernizr && Modernizr.touch) {var touchCapable = true;}
                else {var touchCapable = false;}
                
                if (touchCapable) {
                    otherElement.mouseenter(otherTooltip.render);
                    otherElement.mouseenter(otherTooltip.unbindHover);
                } else {
                    otherElement.mouseenter(otherTooltip.render);
                    otherElement.mouseleave(otherTooltip.destroy);
                    otherElement.mousemove(otherTooltip.position);
                }
            };
            otherTooltip.unbindHover = function() {
                otherElement.unbind('mouseenter');
                otherElement.unbind('mouseleave');
                otherElement.unbind('mousemove');
            };
            
            // bind tooltip events
            otherTooltip.bindHover();
        }
    };
    
    $('.view_tab_more').delegate('.view_tab_option:not(#view_tab_more_shown)', 'click', function() {
        $(document).one('drawingComplete', function() {
            sidebarInit();
            getMapData(mapValue);
        });
        
        var mapValue = $(this).attr('href').substring(1);
        $('#map_view').val(mapValue);
        nhmc.ctrl.hashParams({"map_view": mapValue});
        $('#view_tab_more_shown').attr('href', $('#view_tab_more_menu .view_tab_option[href="#' + mapValue + '"]').attr('href'));
        nhmc.ctrl.zoomToState(mapValue);
    });
    
    $('.view_tab_options_more').delegate('.view_tab_option:not(#view_tab_options_more_shown)', 'click', function() {
        var mapParams = $(this).attr('href').substring(1).split('-');
        var state = mapParams[0];
        var raceNumber = mapParams[1];
        $('#view_tab_options_more_shown').attr('href', $(this).attr('href'));
        displayRaceData(latestData[state], raceNumber);
    });
    
    var sidebarInit = function() {
        var shownMapValue = $('#map_view').val();
        var shownMapOption = $('#view_tab_more_menu .view_tab_option[href="#' + shownMapValue + '"]');
        $('.view_tab_more li').show();
        $('#view_tab_more_shown').text(shownMapOption.text()).attr('href', shownMapOption.attr('href'));
        shownMapOption.parent().hide();
        
        if ($('#legend_images').length == 0) {
            $('#legend_templates').append('<div id="legend_images"></div>');
        }
        
        $('#legend').show();
    };
    
    // This gets called every so often to update our copy of the data.
    var getMapData = function(state) {
        $.ajax({
            // FIXME: This should be changed to a non-testing path at some
            // point.
            url: 'http://www.pbs.org/newshour/vote2012/map/live_data_other/' + state + '_general.json',
            dataType: 'jsonp',
            jsonpCallback: state.toUpperCase(),
            success: function(data) {
                if (config.condenseCandidates) {
                    latestData[state] = condenseCandidates(data);
                } else {
                    latestData[state] = data;
                }
                latestFullData[state] = data;
                liveDataInit(latestData[state]);
                $(document).trigger('mapDataRetrieved', [state]);
            }
        });
    };
    
    // Are we automatically refreshing the data? If so, get that going.
    if (config.autoRefresh) {
        if (nhmc.autoRefreshIntervalId) {
            window.clearInterval(nhmc.autoRefreshIntervalId);
        }
        
        nhmc.autoRefreshIntervalId = window.setInterval(function() {
            getMapData($('#map_view').val());
        }, config.autoRefreshDelay);
        
        $('#live_refresh_on').removeClass('live_refresh_inactive').addClass('live_refresh_active');
        $('#live_refresh_off').removeClass('live_refresh_active').addClass('live_refresh_inactive');
    }
    
    // Support enabling and disabling auto-refresh. (Doubt we'll ever use
    // these, but you never know.)
    $('#live_refresh_on').click(function() {
        if ($('#live_refresh_on').hasClass('live_refresh_inactive')) {
            if (nhmc.autoRefreshIntervalId) {
                window.clearInterval(nhmc.autoRefreshIntervalId);
            }
            
            nhmc.autoRefreshIntervalId = window.setInterval(function() {
                getMapData($('#map_view').val());
            }, config.autoRefreshDelay);
            
            $('#live_refresh_on').removeClass('live_refresh_inactive').addClass('live_refresh_active');
            $('#live_refresh_off').removeClass('live_refresh_active').addClass('live_refresh_inactive');
        }
        return false;
    });
    $('#live_refresh_off').click(function() {
        if ($('#live_refresh_off').hasClass('live_refresh_inactive')) {
            if (nhmc.autoRefreshIntervalId) {
                window.clearInterval(nhmc.autoRefreshIntervalId);
            }
            
            $('#live_refresh_on').removeClass('live_refresh_active').addClass('live_refresh_inactive');
            $('#live_refresh_off').removeClass('live_refresh_inactive').addClass('live_refresh_active');
        }
        return false;
    });
    
    // Handle links to specific maps via the address's hash string.
    var parseHash = function() {
        var currentMapView = $('#map_view').val();
        
        var newHashParams = nhmc.ctrl.hashParams();
        var hashMapView = newHashParams['map_view'];
        
        if (typeof(hashMapView) != 'undefined' && currentMapView != hashMapView) {
            // Make sure it's a map view that's actually available to the user.
            var selectedOption = $('.view_tab_option[href="#' + hashMapView + '"]').last();
            if (selectedOption.length != 0) {
                selectedOption.click();
            } else {
                nhmc.ctrl.hashParams({"map_view": currentMapView});
                sidebarInit();
                getMapData(currentMapView);
            }
        } else {
            sidebarInit();
            getMapData(currentMapView);
        }
    };
    parseHash();
    if ('onhashchange' in window) {$(window).bind('hashchange', parseHash);}
});
