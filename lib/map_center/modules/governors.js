namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");
namespace("nhmc.tooltips");

$(document).one('coreInitialized', function() {
    // Add local references for performance reasons
    var countyGeo = nhmc.geo.countyGeo;
    var usGeo = nhmc.geo.usGeo;
    var FIPSToCounty = nhmc.config.FIPSToCounty;
    
    // Local storage for results data
    var resultsData = {
        "WI": {
            "areas": {
                "55001": [
                    [
                        "WI_1",
                        3748
                    ],
                    [
                        "WI_0",
                        3298
                    ],
                    [
                        "WI_2",
                        119
                    ]
                ],
                "55003": [
                    [
                        "WI_0",
                        3664
                    ],
                    [
                        "WI_1",
                        2205
                    ],
                    [
                        "WI_2",
                        74
                    ]
                ],
                "55005": [
                    [
                        "WI_1",
                        8486
                    ],
                    [
                        "WI_0",
                        6746
                    ],
                    [
                        "WI_2",
                        280
                    ]
                ],
                "55007": [
                    [
                        "WI_0",
                        4185
                    ],
                    [
                        "WI_1",
                        2961
                    ],
                    [
                        "WI_2",
                        94
                    ]
                ],
                "55009": [
                    [
                        "WI_1",
                        49567
                    ],
                    [
                        "WI_0",
                        37549
                    ],
                    [
                        "WI_2",
                        1177
                    ]
                ],
                "55011": [
                    [
                        "WI_1",
                        2610
                    ],
                    [
                        "WI_0",
                        2174
                    ],
                    [
                        "WI_2",
                        94
                    ]
                ],
                "55013": [
                    [
                        "WI_1",
                        3479
                    ],
                    [
                        "WI_0",
                        2555
                    ],
                    [
                        "WI_2",
                        83
                    ]
                ],
                "55015": [
                    [
                        "WI_1",
                        11152
                    ],
                    [
                        "WI_0",
                        7065
                    ],
                    [
                        "WI_2",
                        265
                    ]
                ],
                "55017": [
                    [
                        "WI_1",
                        11901
                    ],
                    [
                        "WI_0",
                        8753
                    ],
                    [
                        "WI_2",
                        490
                    ]
                ],
                "55019": [
                    [
                        "WI_1",
                        6368
                    ],
                    [
                        "WI_0",
                        3844
                    ],
                    [
                        "WI_2",
                        286
                    ]
                ],
                "55021": [
                    [
                        "WI_1",
                        11059
                    ],
                    [
                        "WI_0",
                        10014
                    ],
                    [
                        "WI_2",
                        300
                    ]
                ],
                "55023": [
                    [
                        "WI_0",
                        3062
                    ],
                    [
                        "WI_1",
                        2792
                    ],
                    [
                        "WI_2",
                        105
                    ]
                ],
                "55025": [
                    [
                        "WI_0",
                        149699
                    ],
                    [
                        "WI_1",
                        68238
                    ],
                    [
                        "WI_2",
                        2162
                    ]
                ],
                "55027": [
                    [
                        "WI_1",
                        20568
                    ],
                    [
                        "WI_0",
                        10138
                    ],
                    [
                        "WI_2",
                        398
                    ]
                ],
                "55029": [
                    [
                        "WI_1",
                        6932
                    ],
                    [
                        "WI_0",
                        6719
                    ],
                    [
                        "WI_2",
                        200
                    ]
                ],
                "55031": [
                    [
                        "WI_0",
                        8703
                    ],
                    [
                        "WI_1",
                        6255
                    ],
                    [
                        "WI_2",
                        224
                    ]
                ],
                "55033": [
                    [
                        "WI_1",
                        7282
                    ],
                    [
                        "WI_0",
                        5972
                    ],
                    [
                        "WI_2",
                        296
                    ]
                ],
                "55035": [
                    [
                        "WI_0",
                        18454
                    ],
                    [
                        "WI_1",
                        18018
                    ],
                    [
                        "WI_2",
                        605
                    ]
                ],
                "55037": [
                    [
                        "WI_1",
                        1197
                    ],
                    [
                        "WI_0",
                        612
                    ],
                    [
                        "WI_2",
                        24
                    ]
                ],
                "55039": [
                    [
                        "WI_1",
                        24407
                    ],
                    [
                        "WI_0",
                        13145
                    ],
                    [
                        "WI_2",
                        374
                    ]
                ],
                "55041": [
                    [
                        "WI_1",
                        1790
                    ],
                    [
                        "WI_0",
                        1565
                    ],
                    [
                        "WI_2",
                        43
                    ]
                ],
                "55043": [
                    [
                        "WI_1",
                        8611
                    ],
                    [
                        "WI_0",
                        7573
                    ],
                    [
                        "WI_2",
                        300
                    ]
                ],
                "55045": [
                    [
                        "WI_0",
                        6567
                    ],
                    [
                        "WI_1",
                        6391
                    ],
                    [
                        "WI_2",
                        211
                    ]
                ],
                "55047": [
                    [
                        "WI_1",
                        4488
                    ],
                    [
                        "WI_0",
                        2262
                    ],
                    [
                        "WI_2",
                        229
                    ]
                ],
                "55049": [
                    [
                        "WI_0",
                        4750
                    ],
                    [
                        "WI_1",
                        3867
                    ],
                    [
                        "WI_2",
                        122
                    ]
                ],
                "55051": [
                    [
                        "WI_1",
                        1336
                    ],
                    [
                        "WI_0",
                        1139
                    ],
                    [
                        "WI_2",
                        27
                    ]
                ],
                "55053": [
                    [
                        "WI_1",
                        3428
                    ],
                    [
                        "WI_0",
                        3219
                    ],
                    [
                        "WI_2",
                        122
                    ]
                ],
                "55055": [
                    [
                        "WI_1",
                        19155
                    ],
                    [
                        "WI_0",
                        11909
                    ],
                    [
                        "WI_2",
                        417
                    ]
                ],
                "55057": [
                    [
                        "WI_1",
                        4502
                    ],
                    [
                        "WI_0",
                        3358
                    ],
                    [
                        "WI_2",
                        124
                    ]
                ],
                "55059": [
                    [
                        "WI_1",
                        25136
                    ],
                    [
                        "WI_0",
                        23312
                    ],
                    [
                        "WI_2",
                        524
                    ]
                ],
                "55061": [
                    [
                        "WI_1",
                        4577
                    ],
                    [
                        "WI_0",
                        3345
                    ],
                    [
                        "WI_2",
                        145
                    ]
                ],
                "55063": [
                    [
                        "WI_1",
                        20754
                    ],
                    [
                        "WI_0",
                        20639
                    ],
                    [
                        "WI_2",
                        637
                    ]
                ],
                "55065": [
                    [
                        "WI_1",
                        2926
                    ],
                    [
                        "WI_0",
                        2566
                    ],
                    [
                        "WI_2",
                        96
                    ]
                ],
                "55067": [
                    [
                        "WI_1",
                        4481
                    ],
                    [
                        "WI_0",
                        2754
                    ],
                    [
                        "WI_2",
                        87
                    ]
                ],
                "55069": [
                    [
                        "WI_1",
                        6201
                    ],
                    [
                        "WI_0",
                        4872
                    ],
                    [
                        "WI_2",
                        248
                    ]
                ],
                "55071": [
                    [
                        "WI_1",
                        18234
                    ],
                    [
                        "WI_0",
                        11784
                    ],
                    [
                        "WI_2",
                        339
                    ]
                ],
                "55073": [
                    [
                        "WI_1",
                        28516
                    ],
                    [
                        "WI_0",
                        20028
                    ],
                    [
                        "WI_2",
                        936
                    ]
                ],
                "55075": [
                    [
                        "WI_1",
                        8222
                    ],
                    [
                        "WI_0",
                        6127
                    ],
                    [
                        "WI_2",
                        199
                    ]
                ],
                "55077": [
                    [
                        "WI_1",
                        3483
                    ],
                    [
                        "WI_0",
                        2384
                    ],
                    [
                        "WI_2",
                        126
                    ]
                ],
                "55078": [
                    [
                        "WI_0",
                        586
                    ],
                    [
                        "WI_1",
                        166
                    ],
                    [
                        "WI_2",
                        0
                    ]
                ],
                "55079": [
                    [
                        "WI_0",
                        209932
                    ],
                    [
                        "WI_1",
                        128612
                    ],
                    [
                        "WI_2",
                        2056
                    ]
                ],
                "55081": [
                    [
                        "WI_1",
                        7570
                    ],
                    [
                        "WI_0",
                        5199
                    ],
                    [
                        "WI_2",
                        301
                    ]
                ],
                "55083": [
                    [
                        "WI_1",
                        8131
                    ],
                    [
                        "WI_0",
                        5380
                    ],
                    [
                        "WI_2",
                        177
                    ]
                ],
                "55085": [
                    [
                        "WI_1",
                        8773
                    ],
                    [
                        "WI_0",
                        6762
                    ],
                    [
                        "WI_2",
                        312
                    ]
                ],
                "55087": [
                    [
                        "WI_1",
                        35143
                    ],
                    [
                        "WI_0",
                        29223
                    ],
                    [
                        "WI_2",
                        832
                    ]
                ],
                "55089": [
                    [
                        "WI_1",
                        29879
                    ],
                    [
                        "WI_0",
                        13233
                    ],
                    [
                        "WI_2",
                        242
                    ]
                ],
                "55091": [
                    [
                        "WI_1",
                        1279
                    ],
                    [
                        "WI_0",
                        1093
                    ],
                    [
                        "WI_2",
                        35
                    ]
                ],
                "55093": [
                    [
                        "WI_1",
                        7067
                    ],
                    [
                        "WI_0",
                        5925
                    ],
                    [
                        "WI_2",
                        308
                    ]
                ],
                "55095": [
                    [
                        "WI_1",
                        8842
                    ],
                    [
                        "WI_0",
                        5752
                    ],
                    [
                        "WI_2",
                        285
                    ]
                ],
                "55097": [
                    [
                        "WI_0",
                        14463
                    ],
                    [
                        "WI_1",
                        12794
                    ],
                    [
                        "WI_2",
                        399
                    ]
                ],
                "55099": [
                    [
                        "WI_1",
                        3284
                    ],
                    [
                        "WI_0",
                        2858
                    ],
                    [
                        "WI_2",
                        144
                    ]
                ],
                "55101": [
                    [
                        "WI_1",
                        40813
                    ],
                    [
                        "WI_0",
                        31333
                    ],
                    [
                        "WI_2",
                        585
                    ]
                ],
                "55103": [
                    [
                        "WI_1",
                        3293
                    ],
                    [
                        "WI_0",
                        2866
                    ],
                    [
                        "WI_2",
                        86
                    ]
                ],
                "55105": [
                    [
                        "WI_0",
                        27424
                    ],
                    [
                        "WI_1",
                        23813
                    ],
                    [
                        "WI_2",
                        929
                    ]
                ],
                "55107": [
                    [
                        "WI_1",
                        3045
                    ],
                    [
                        "WI_0",
                        2170
                    ],
                    [
                        "WI_2",
                        185
                    ]
                ],
                "55109": [
                    [
                        "WI_1",
                        17298
                    ],
                    [
                        "WI_0",
                        10329
                    ],
                    [
                        "WI_2",
                        489
                    ]
                ],
                "55111": [
                    [
                        "WI_1",
                        11044
                    ],
                    [
                        "WI_0",
                        10741
                    ],
                    [
                        "WI_2",
                        363
                    ]
                ],
                "55113": [
                    [
                        "WI_1",
                        3766
                    ],
                    [
                        "WI_0",
                        2650
                    ],
                    [
                        "WI_2",
                        79
                    ]
                ],
                "55115": [
                    [
                        "WI_1",
                        8663
                    ],
                    [
                        "WI_0",
                        5487
                    ],
                    [
                        "WI_2",
                        211
                    ]
                ],
                "55117": [
                    [
                        "WI_1",
                        29657
                    ],
                    [
                        "WI_0",
                        16720
                    ],
                    [
                        "WI_2",
                        469
                    ]
                ],
                "55119": [
                    [
                        "WI_1",
                        4212
                    ],
                    [
                        "WI_0",
                        2370
                    ],
                    [
                        "WI_2",
                        191
                    ]
                ],
                "55121": [
                    [
                        "WI_0",
                        4928
                    ],
                    [
                        "WI_1",
                        4898
                    ],
                    [
                        "WI_2",
                        186
                    ]
                ],
                "55123": [
                    [
                        "WI_1",
                        5441
                    ],
                    [
                        "WI_0",
                        5278
                    ],
                    [
                        "WI_2",
                        203
                    ]
                ],
                "55125": [
                    [
                        "WI_1",
                        6595
                    ],
                    [
                        "WI_0",
                        3773
                    ],
                    [
                        "WI_2",
                        162
                    ]
                ],
                "55127": [
                    [
                        "WI_1",
                        22733
                    ],
                    [
                        "WI_0",
                        11870
                    ],
                    [
                        "WI_2",
                        489
                    ]
                ],
                "55129": [
                    [
                        "WI_1",
                        3533
                    ],
                    [
                        "WI_0",
                        2974
                    ],
                    [
                        "WI_2",
                        101
                    ]
                ],
                "55131": [
                    [
                        "WI_1",
                        44222
                    ],
                    [
                        "WI_0",
                        14276
                    ],
                    [
                        "WI_2",
                        437
                    ]
                ],
                "55133": [
                    [
                        "WI_1",
                        134608
                    ],
                    [
                        "WI_0",
                        52684
                    ],
                    [
                        "WI_2",
                        949
                    ]
                ],
                "55135": [
                    [
                        "WI_1",
                        10596
                    ],
                    [
                        "WI_0",
                        7072
                    ],
                    [
                        "WI_2",
                        244
                    ]
                ],
                "55137": [
                    [
                        "WI_1",
                        5178
                    ],
                    [
                        "WI_0",
                        3284
                    ],
                    [
                        "WI_2",
                        146
                    ]
                ],
                "55139": [
                    [
                        "WI_1",
                        33044
                    ],
                    [
                        "WI_0",
                        27141
                    ],
                    [
                        "WI_2",
                        976
                    ]
                ],
                "55141": [
                    [
                        "WI_1",
                        15626
                    ],
                    [
                        "WI_0",
                        12023
                    ],
                    [
                        "WI_2",
                        577
                    ]
                ]
            },
            "breakdown": [
                [
                    "WI_1",
                    1128941
                ],
                [
                    "WI_0",
                    1004303
                ],
                [
                    "WI_2",
                    25730
                ]
            ],
            "candidates": {
                "WI_0": "Tom Barrett",
                "WI_1": "Scott Walker",
                "WI_2": "Other"
            },
            "electionYear": "2010",
            "parties": {
                "WI_0": "D",
                "WI_1": "R"
            }
        }
    };
    
    // Configuration details, including support for override by declaring
    // values in nhmcGovernorsConfig
    var config = {
        bigCandidates: 2,
        partyColors: {
           "D": "#000099",
           "R": "#990000",
           "O": "#838282"
        },
        candidateImages: {
            "Tom Barrett": "lib/images/state_races/wi/barrett.jpg",
            "Scott Walker": "lib/images/state_races/wi/walker.jpg"
        },
        flyoutsEnabled: false,
        strokeHighlight: "#9F1C20",
        tooltipsEnabled: true
    };
    if (typeof(nhmcGovernorsConfig) != 'undefined') {
        $.extend(true, config, nhmcGovernorsConfig);
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
    var numericalSort = function(a, b) {
        return parseInt(a, 10) - parseInt(b, 10);
    };
    
    // Show a particular race from within our overall data object. This
    // includes rendering the legend and coloring the map areas.
    var displayRaceData = function(state) {
        nhmc.cleanup.clearPathColors();
        var raceData = resultsData[state.toUpperCase()];
        if (typeof(raceData) == 'undefined') {return;}
        
        // Fill all areas on the map that the specified candidate has won.
        var fillAreas = function(candidateId, clearFill) {
            // Default clearFill to false if not provided
            clearFill = (typeof clearFill == 'undefined') ? false : clearFill;
            
            // Are we clearing these out (i.e., filling with the default color)?
            if (clearFill || config.blankMap) {
                var areaFill = nhmc.config.defaultAttributes.fill;
            } else {
                var areaFill = config.partyColors[
                    raceData.parties[candidateId]
                ] || nhmc.config.defaultAttributes.fill;
            }
            
            // Color each area appropriately.
            for (var areaId in raceData.areas) {
                // Are we:
                //     * in an area where this candidate is winning?
                //     * in an area with results in?
                // If so, color the area.
                if (candidateId == raceData.areas[areaId][0][0]
                        && raceData.areas[areaId][0][1] != 0) {
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
            var candidateName = raceData.candidates[candidateId];
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
                config.partyColors[
                    raceData.parties[candidateId]
                ] || nhmc.config.defaultAttributes.fill
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
            if (config.candidateImages[raceData.candidates[candidateId]]) {
                var candidateImage = $('#legend_images .candidate_image_' + candidateId);
                if (candidateImage.length) {
                    legendEntry.find('.candidate_image')
                        .replaceWith(candidateImage.clone());
                } else {
                    legendEntry.find('.candidate_image')
                        .attr(
                            'src',
                            config.candidateImages[raceData.candidates[candidateId]]
                        ).addClass('candidate_image_' + candidateId).clone()
                        .appendTo('#legend_images');
                }
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
                var stateUSPS = $('#map_view').val().toUpperCase();
                if (this.nhmcData.county_fips != undefined) {
                    thisFIPS = this.nhmcData.county_fips;
                    thisCounty = nhmc.config.FIPSToCounty[thisFIPS][1];
                    thisState = nhmc.config.FIPSToCounty[thisFIPS][0];
                } else if (this.nhmcData.county != undefined) {
                    thisState = nhmc.config.USPSToState[stateUSPS];
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
                var areaResults = resultsData[stateUSPS].areas[areaName] || [];
                
                // Show a breakdown of the results.
                // 
                // Total the votes cast in this area so we can figure out
                // percentages for each candidate.
                var areaTotalVotes = 0;
                for (var i = 0, length = areaResults.length; i < length; i++) {
                    areaTotalVotes += areaResults[i][1];
                }
                
                // Clear out the list of candidates...
                var tooltipCandidates = tooltipContent.find('.tooltip_candidates');
                tooltipCandidates.empty();
                
                // ...and fill it back up.
                for (var i = 0, length = areaResults.length; i < length; i++) {
                    var candidateId = areaResults[i][0];
                    
                    // What's the candidate's last name?
                    var candidateName = resultsData[stateUSPS].candidates[candidateId];
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
                        config.partyColors[
                            raceData.parties[candidateId]
                        ] || nhmc.config.defaultAttributes.fill
                    );
                    
                    // What percentage of the total votes in this area did
                    // the candidate receive?
                    var candidateVotePercent = 100 * (
                        areaResults[i][1] / areaTotalVotes
                    );
                    if (areaTotalVotes == 0) {candidateVotePercent = 0;}
                    
                    // Fill in vote numbers for the candidate.
                    tooltipEntry.find('.tooltip_candidate_vote_count')
                        .text(formatThousands(areaResults[i][1]));
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
        if (config.tooltipsEnabled && nhmc.tooltips.hoverHandlerTokens.length == 0) {
            nhmc.tooltips.init();
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
    
    var sidebarInit = function() {
        var shownMapValue = $('#map_view').val();
        var shownMapOption = $('#view_tab_more_menu .view_tab_option[href="#' + shownMapValue + '"]');
        $('.view_tab_more li').show();
        $('#view_tab_more_shown').text(shownMapOption.text()).attr('href', shownMapOption.attr('href'));
        shownMapOption.parent().hide();
        
        $('#legend').show();
        $('#sidebar_election_year').text(resultsData[shownMapValue.toUpperCase()].electionYear);
    };
    
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
                displayRaceData(currentMapView);
            }
        } else {
            sidebarInit();
            displayRaceData(currentMapView);
        }
    };
    parseHash();
    if ('onhashchange' in window) {$(window).bind('hashchange', parseHash);}
});
