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
                        "wi_1",
                        3748
                    ],
                    [
                        "wi_0",
                        3298
                    ],
                    [
                        "wi_2",
                        124
                    ]
                ],
                "55003": [
                    [
                        "wi_0",
                        3664
                    ],
                    [
                        "wi_1",
                        2205
                    ],
                    [
                        "wi_2",
                        80
                    ]
                ],
                "55005": [
                    [
                        "wi_1",
                        8486
                    ],
                    [
                        "wi_0",
                        6746
                    ],
                    [
                        "wi_2",
                        288
                    ]
                ],
                "55007": [
                    [
                        "wi_0",
                        4185
                    ],
                    [
                        "wi_1",
                        2961
                    ],
                    [
                        "wi_2",
                        96
                    ]
                ],
                "55009": [
                    [
                        "wi_1",
                        49567
                    ],
                    [
                        "wi_0",
                        37549
                    ],
                    [
                        "wi_2",
                        1274
                    ]
                ],
                "55011": [
                    [
                        "wi_1",
                        2610
                    ],
                    [
                        "wi_0",
                        2174
                    ],
                    [
                        "wi_2",
                        95
                    ]
                ],
                "55013": [
                    [
                        "wi_1",
                        3479
                    ],
                    [
                        "wi_0",
                        2555
                    ],
                    [
                        "wi_2",
                        85
                    ]
                ],
                "55015": [
                    [
                        "wi_1",
                        11152
                    ],
                    [
                        "wi_0",
                        7065
                    ],
                    [
                        "wi_2",
                        288
                    ]
                ],
                "55017": [
                    [
                        "wi_1",
                        11901
                    ],
                    [
                        "wi_0",
                        8753
                    ],
                    [
                        "wi_2",
                        504
                    ]
                ],
                "55019": [
                    [
                        "wi_1",
                        6368
                    ],
                    [
                        "wi_0",
                        3844
                    ],
                    [
                        "wi_2",
                        293
                    ]
                ],
                "55021": [
                    [
                        "wi_1",
                        11059
                    ],
                    [
                        "wi_0",
                        10014
                    ],
                    [
                        "wi_2",
                        312
                    ]
                ],
                "55023": [
                    [
                        "wi_0",
                        3062
                    ],
                    [
                        "wi_1",
                        2792
                    ],
                    [
                        "wi_2",
                        107
                    ]
                ],
                "55025": [
                    [
                        "wi_0",
                        149699
                    ],
                    [
                        "wi_1",
                        68238
                    ],
                    [
                        "wi_2",
                        2336
                    ]
                ],
                "55027": [
                    [
                        "wi_1",
                        20568
                    ],
                    [
                        "wi_0",
                        10138
                    ],
                    [
                        "wi_2",
                        427
                    ]
                ],
                "55029": [
                    [
                        "wi_1",
                        6932
                    ],
                    [
                        "wi_0",
                        6719
                    ],
                    [
                        "wi_2",
                        219
                    ]
                ],
                "55031": [
                    [
                        "wi_0",
                        8703
                    ],
                    [
                        "wi_1",
                        6255
                    ],
                    [
                        "wi_2",
                        235
                    ]
                ],
                "55033": [
                    [
                        "wi_1",
                        7282
                    ],
                    [
                        "wi_0",
                        5972
                    ],
                    [
                        "wi_2",
                        304
                    ]
                ],
                "55035": [
                    [
                        "wi_0",
                        18454
                    ],
                    [
                        "wi_1",
                        18018
                    ],
                    [
                        "wi_2",
                        661
                    ]
                ],
                "55037": [
                    [
                        "wi_1",
                        1197
                    ],
                    [
                        "wi_0",
                        612
                    ],
                    [
                        "wi_2",
                        24
                    ]
                ],
                "55039": [
                    [
                        "wi_1",
                        24407
                    ],
                    [
                        "wi_0",
                        13145
                    ],
                    [
                        "wi_2",
                        405
                    ]
                ],
                "55041": [
                    [
                        "wi_1",
                        1790
                    ],
                    [
                        "wi_0",
                        1565
                    ],
                    [
                        "wi_2",
                        45
                    ]
                ],
                "55043": [
                    [
                        "wi_1",
                        8611
                    ],
                    [
                        "wi_0",
                        7573
                    ],
                    [
                        "wi_2",
                        310
                    ]
                ],
                "55045": [
                    [
                        "wi_0",
                        6567
                    ],
                    [
                        "wi_1",
                        6391
                    ],
                    [
                        "wi_2",
                        229
                    ]
                ],
                "55047": [
                    [
                        "wi_1",
                        4488
                    ],
                    [
                        "wi_0",
                        2262
                    ],
                    [
                        "wi_2",
                        232
                    ]
                ],
                "55049": [
                    [
                        "wi_0",
                        4750
                    ],
                    [
                        "wi_1",
                        3867
                    ],
                    [
                        "wi_2",
                        129
                    ]
                ],
                "55051": [
                    [
                        "wi_1",
                        1336
                    ],
                    [
                        "wi_0",
                        1139
                    ],
                    [
                        "wi_2",
                        28
                    ]
                ],
                "55053": [
                    [
                        "wi_1",
                        3428
                    ],
                    [
                        "wi_0",
                        3219
                    ],
                    [
                        "wi_2",
                        129
                    ]
                ],
                "55055": [
                    [
                        "wi_1",
                        19155
                    ],
                    [
                        "wi_0",
                        11909
                    ],
                    [
                        "wi_2",
                        466
                    ]
                ],
                "55057": [
                    [
                        "wi_1",
                        4502
                    ],
                    [
                        "wi_0",
                        3358
                    ],
                    [
                        "wi_2",
                        128
                    ]
                ],
                "55059": [
                    [
                        "wi_1",
                        25136
                    ],
                    [
                        "wi_0",
                        23312
                    ],
                    [
                        "wi_2",
                        562
                    ]
                ],
                "55061": [
                    [
                        "wi_1",
                        4577
                    ],
                    [
                        "wi_0",
                        3345
                    ],
                    [
                        "wi_2",
                        152
                    ]
                ],
                "55063": [
                    [
                        "wi_1",
                        20754
                    ],
                    [
                        "wi_0",
                        20639
                    ],
                    [
                        "wi_2",
                        684
                    ]
                ],
                "55065": [
                    [
                        "wi_1",
                        2926
                    ],
                    [
                        "wi_0",
                        2566
                    ],
                    [
                        "wi_2",
                        102
                    ]
                ],
                "55067": [
                    [
                        "wi_1",
                        4481
                    ],
                    [
                        "wi_0",
                        2754
                    ],
                    [
                        "wi_2",
                        90
                    ]
                ],
                "55069": [
                    [
                        "wi_1",
                        6201
                    ],
                    [
                        "wi_0",
                        4872
                    ],
                    [
                        "wi_2",
                        258
                    ]
                ],
                "55071": [
                    [
                        "wi_1",
                        18234
                    ],
                    [
                        "wi_0",
                        11784
                    ],
                    [
                        "wi_2",
                        357
                    ]
                ],
                "55073": [
                    [
                        "wi_1",
                        28516
                    ],
                    [
                        "wi_0",
                        20028
                    ],
                    [
                        "wi_2",
                        970
                    ]
                ],
                "55075": [
                    [
                        "wi_1",
                        8222
                    ],
                    [
                        "wi_0",
                        6127
                    ],
                    [
                        "wi_2",
                        207
                    ]
                ],
                "55077": [
                    [
                        "wi_1",
                        3483
                    ],
                    [
                        "wi_0",
                        2384
                    ],
                    [
                        "wi_2",
                        133
                    ]
                ],
                "55078": [
                    [
                        "wi_0",
                        586
                    ],
                    [
                        "wi_1",
                        166
                    ],
                    [
                        "wi_2",
                        0
                    ]
                ],
                "55079": [
                    [
                        "wi_0",
                        209932
                    ],
                    [
                        "wi_1",
                        128612
                    ],
                    [
                        "wi_2",
                        2473
                    ]
                ],
                "55081": [
                    [
                        "wi_1",
                        7570
                    ],
                    [
                        "wi_0",
                        5199
                    ],
                    [
                        "wi_2",
                        320
                    ]
                ],
                "55083": [
                    [
                        "wi_1",
                        8131
                    ],
                    [
                        "wi_0",
                        5380
                    ],
                    [
                        "wi_2",
                        189
                    ]
                ],
                "55085": [
                    [
                        "wi_1",
                        8773
                    ],
                    [
                        "wi_0",
                        6762
                    ],
                    [
                        "wi_2",
                        331
                    ]
                ],
                "55087": [
                    [
                        "wi_1",
                        35143
                    ],
                    [
                        "wi_0",
                        29223
                    ],
                    [
                        "wi_2",
                        893
                    ]
                ],
                "55089": [
                    [
                        "wi_1",
                        29879
                    ],
                    [
                        "wi_0",
                        13233
                    ],
                    [
                        "wi_2",
                        269
                    ]
                ],
                "55091": [
                    [
                        "wi_1",
                        1279
                    ],
                    [
                        "wi_0",
                        1093
                    ],
                    [
                        "wi_2",
                        35
                    ]
                ],
                "55093": [
                    [
                        "wi_1",
                        7067
                    ],
                    [
                        "wi_0",
                        5925
                    ],
                    [
                        "wi_2",
                        316
                    ]
                ],
                "55095": [
                    [
                        "wi_1",
                        8842
                    ],
                    [
                        "wi_0",
                        5752
                    ],
                    [
                        "wi_2",
                        298
                    ]
                ],
                "55097": [
                    [
                        "wi_0",
                        14463
                    ],
                    [
                        "wi_1",
                        12794
                    ],
                    [
                        "wi_2",
                        420
                    ]
                ],
                "55099": [
                    [
                        "wi_1",
                        3284
                    ],
                    [
                        "wi_0",
                        2858
                    ],
                    [
                        "wi_2",
                        148
                    ]
                ],
                "55101": [
                    [
                        "wi_1",
                        40813
                    ],
                    [
                        "wi_0",
                        31333
                    ],
                    [
                        "wi_2",
                        645
                    ]
                ],
                "55103": [
                    [
                        "wi_1",
                        3293
                    ],
                    [
                        "wi_0",
                        2866
                    ],
                    [
                        "wi_2",
                        87
                    ]
                ],
                "55105": [
                    [
                        "wi_0",
                        27424
                    ],
                    [
                        "wi_1",
                        23813
                    ],
                    [
                        "wi_2",
                        976
                    ]
                ],
                "55107": [
                    [
                        "wi_1",
                        3045
                    ],
                    [
                        "wi_0",
                        2170
                    ],
                    [
                        "wi_2",
                        187
                    ]
                ],
                "55109": [
                    [
                        "wi_1",
                        17298
                    ],
                    [
                        "wi_0",
                        10329
                    ],
                    [
                        "wi_2",
                        510
                    ]
                ],
                "55111": [
                    [
                        "wi_1",
                        11044
                    ],
                    [
                        "wi_0",
                        10741
                    ],
                    [
                        "wi_2",
                        381
                    ]
                ],
                "55113": [
                    [
                        "wi_1",
                        3766
                    ],
                    [
                        "wi_0",
                        2650
                    ],
                    [
                        "wi_2",
                        81
                    ]
                ],
                "55115": [
                    [
                        "wi_1",
                        8663
                    ],
                    [
                        "wi_0",
                        5487
                    ],
                    [
                        "wi_2",
                        223
                    ]
                ],
                "55117": [
                    [
                        "wi_1",
                        29657
                    ],
                    [
                        "wi_0",
                        16720
                    ],
                    [
                        "wi_2",
                        497
                    ]
                ],
                "55119": [
                    [
                        "wi_1",
                        4212
                    ],
                    [
                        "wi_0",
                        2370
                    ],
                    [
                        "wi_2",
                        193
                    ]
                ],
                "55121": [
                    [
                        "wi_0",
                        4928
                    ],
                    [
                        "wi_1",
                        4898
                    ],
                    [
                        "wi_2",
                        195
                    ]
                ],
                "55123": [
                    [
                        "wi_1",
                        5441
                    ],
                    [
                        "wi_0",
                        5278
                    ],
                    [
                        "wi_2",
                        211
                    ]
                ],
                "55125": [
                    [
                        "wi_1",
                        6595
                    ],
                    [
                        "wi_0",
                        3773
                    ],
                    [
                        "wi_2",
                        171
                    ]
                ],
                "55127": [
                    [
                        "wi_1",
                        22733
                    ],
                    [
                        "wi_0",
                        11870
                    ],
                    [
                        "wi_2",
                        516
                    ]
                ],
                "55129": [
                    [
                        "wi_1",
                        3533
                    ],
                    [
                        "wi_0",
                        2974
                    ],
                    [
                        "wi_2",
                        105
                    ]
                ],
                "55131": [
                    [
                        "wi_1",
                        44222
                    ],
                    [
                        "wi_0",
                        14276
                    ],
                    [
                        "wi_2",
                        475
                    ]
                ],
                "55133": [
                    [
                        "wi_1",
                        134608
                    ],
                    [
                        "wi_0",
                        52684
                    ],
                    [
                        "wi_2",
                        986
                    ]
                ],
                "55135": [
                    [
                        "wi_1",
                        10596
                    ],
                    [
                        "wi_0",
                        7072
                    ],
                    [
                        "wi_2",
                        256
                    ]
                ],
                "55137": [
                    [
                        "wi_1",
                        5178
                    ],
                    [
                        "wi_0",
                        3284
                    ],
                    [
                        "wi_2",
                        152
                    ]
                ],
                "55139": [
                    [
                        "wi_1",
                        33044
                    ],
                    [
                        "wi_0",
                        27141
                    ],
                    [
                        "wi_2",
                        1056
                    ]
                ],
                "55141": [
                    [
                        "wi_1",
                        15626
                    ],
                    [
                        "wi_0",
                        12023
                    ],
                    [
                        "wi_2",
                        625
                    ]
                ]
            },
            "breakdown": [
                [
                    "wi_1",
                    1128941
                ],
                [
                    "wi_0",
                    1004303
                ],
                [
                    "wi_2",
                    27588
                ]
            ],
            "candidates": {
                "wi_0": "Tom Barrett",
                "wi_1": "Scott Walker",
                "wi_2": "Other"
            },
            "electionYear": "2010",
            "parties": {
                "wi_0": "D",
                "wi_1": "R"
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
        candidateImages: {},
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
