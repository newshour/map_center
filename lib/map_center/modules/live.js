namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");
namespace("nhmc.tooltips");

nhmc.mapSpecificInit = function() {
    // add local references for performance reasons
    var countyGeo = nhmc.geo.countyGeo;
    var usGeo = nhmc.geo.usGeo;
    var FIPSToCounty = nhmc.config.FIPSToCounty;
    
    var latestData = {};
    var autoRefreshIntervalId = null;
    var config = {
        autoRefresh: true,
        autoRefreshDelay: 1000 * 60,
        bigCandidates: 3,
        candidateColors: {
           "Michele Bachmann": "#92681a",
           "Herman Cain": "#9f1c20",
           "Newt Gingrich": "#187d79",
           "Rick Santorum": "#6476a5",
           "Gary Johnson": "#e7298a",
           "Ron Paul": "#e7cb0a",
           "Jon Huntsman": "#7570b3",
           "Buddy Roemer": "#666666",
           "Mitt Romney": "#59b167",
           "Rick Perry": "#f67340",
           "No Preference": "#000000",
           "Other": "#d4d4d4"
        },
        candidateImages: {
            "Michele Bachmann": "lib/images/results/bachmann.jpg",
            "Herman Cain": "lib/images/results/cain.jpg",
            "Newt Gingrich": "lib/images/results/gingrich.jpg",
            "Rick Santorum": "lib/images/results/santorum.jpg",
            "Gary Johnson": "lib/images/results/johnson.jpg",
            "Ron Paul": "lib/images/results/paul.jpg",
            "Jon Huntsman": "lib/images/results/huntsman.jpg",
            "Buddy Roemer": "lib/images/results/roemer.jpg",
            "Mitt Romney": "lib/images/results/romney.jpg",
            "Rick Perry": "lib/images/results/perry.jpg",
            "No Preference": "lib/images/results/no.jpg",
            "Other": "lib/images/results/other.jpg"
        },
        condenseCandidates: false,
        showCandidates: [
            "Mitt Romney",
            "Rick Santorum",
            "Ron Paul",
            "Jon Huntsman",
            "Michele Bachmann",
            "Newt Gingrich",
            "Rick Perry"
        ]
    }
    
    function condenseCandidates(data) {
        var condensedData = {
            "breakdown": [],
            "winners": {},
            "candidates": {},
            "test": data.test,
            "precincts": data.precincts,
            "lastUpdated": data.lastUpdated,
            "areas": {}
        };
        
        var shouldCondenseCandidate = {};
        var otherCandidateId = '';
        for (var candidateId in data.candidates) {
            if (config.showCandidates.indexOf(data.candidates[candidateId]) != -1) {
                shouldCondenseCandidate[candidateId] = false;
                condensedData.candidates[candidateId] = data.candidates[candidateId];
            } else {
                shouldCondenseCandidate[candidateId] = true;
            }
            
            if (data.candidates[candidateId] == 'Other') {
                otherCandidateId = candidateId;
                condensedData.candidates[candidateId] = "Other";
            }
        }
        
        if (!otherCandidateId) {
            otherCandidateId = 'other';
            condensedData.candidates[otherCandidateId] = "Other";
        }
        
        for (var areaId in data.winners) {
            if (shouldCondenseCandidate[data.winners[areaId]]) {
                condensedData.winners[areaId] = otherCandidateId;
            } else {
                condensedData.winners[areaId] = data.winners[areaId];
            }
        }
        
        for (var areaId in data.areas) {
            var oldAreaData = data.areas[areaId];
            var condensedAreaData = {
                precincts: oldAreaData.precincts,
                data: []
            }
            
            var otherTotal = 0;
            for (var i = 0, length = oldAreaData.data.length; i < length; i++) {
                if (shouldCondenseCandidate[oldAreaData.data[i][0]]) {
                    otherTotal += oldAreaData.data[i][1];
                } else {
                    condensedAreaData.data.push(oldAreaData.data[i]);
                }
            }
            condensedAreaData.data.push([
                otherCandidateId,
                otherTotal
            ]);
            
            condensedData.areas[areaId] = condensedAreaData;
        }
        condensedData.breakdown = condensedData.areas[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].data;
        
        return condensedData;
    }
    
    function formatThousands(value, decimalPlaces, alwaysDecimalize) {
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
    
    function liveDataInit(data) {
        function fillAreas(candidateId, clearFill) {
            // default clearFill to false
            clearFill = (typeof clearFill == 'undefined') ? false : clearFill;
            
            if (clearFill) {
                var areaFill = nhmc.config.styleColors['default'];
            } else {
                var areaFill = config.candidateColors[data.candidates[candidateId]] || config.candidateColors['Other'];
            }
            
            for (var areaId in data.areas) {
                if (candidateId == data.areas[areaId].data[0][0] && data.areas[areaId].data[0][1] != 0) {
                // if (candidateId == data.areas[areaId].data[0][0]) {
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
        }
        
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
        // Name these parts so they don't drive me crazy
        var now = {
            hour: data.lastUpdated[3],
            minute: data.lastUpdated[4],
            month: data.lastUpdated[1],
            day: data.lastUpdated[2]
        };
        // Convert hour from 24-hour time
        if (now.hour > 12) {timeStringParts.push((now.hour - 12) + '');}
        else if (now.hour == 0) {timeStringParts.push('12');}
        else {timeStringParts.push(now.hour + '');}
        // Add minute, zero-padding if necessary
        if (now.minute != 0) {
            if (now.minute < 10) {timeStringParts.push(':0' + now.minute);}
            else {timeStringParts.push(':' + now.minute);}
        }
        // Add a.m. or p.m.
        if (now.hour < 12) {timeStringParts.push(' a.m., ');}
        else {timeStringParts.push(' p.m., ');}
        // Add month and day
        timeStringParts.push(monthAbbrs[now.month] + ' ' + now.day);
        // Stick it all on the page!
        $('#last_updated').text(timeStringParts.join(''));
        
        $('#precincts_percent').text((100 * data.precincts[0] / data.precincts[1]).toFixed(1));
        $('#precincts_reporting').text(data.precincts[0]);
        $('#precincts_total').text(data.precincts[1]);
        
        var stateTotalVotes = 0;
        for (var i = 0, length = data.breakdown.length; i < length; i++) {
            stateTotalVotes += data.breakdown[i][1];
        }
        $('#legend_candidates').empty();
        for (var i = 0, length = data.breakdown.length; i < length; i++) {
            var candidateId = data.breakdown[i][0];
            
            var candidateName = data.candidates[candidateId];
            var candidateNameParts = candidateName.split(' ');
            var candidateLastName = candidateNameParts[candidateNameParts.length - 1];
            
            var candidateVotePercent = 100 * data.breakdown[i][1] / stateTotalVotes;
            if (stateTotalVotes == 0) {candidateVotePercent = 0;}
            
            if (i <= config.bigCandidates - 1) {
                var legendEntry = $('#legend_templates .candidate_big').clone().appendTo('#legend_candidates');
            } else {
                var legendEntry = $('#legend_templates .candidate_small').clone().appendTo('#legend_candidates');
            }
            
            legendEntry.children('.candidate_color').css('background-color', config.candidateColors[data.candidates[candidateId]] || config.candidateColors['Other']);
            legendEntry.children('.candidate_vote_count').text(formatThousands(data.breakdown[i][1]));
            legendEntry.children('.candidate_votes').text(candidateVotePercent.toFixed(1) + '%');
            
            legendEntry.children('.candidate_name').children('.candidate_name_first').text(candidateNameParts.slice(0, -1).join(' '));
            legendEntry.children('.candidate_name').children('.candidate_name_last').text(candidateLastName);
            if (candidateLastName.toLowerCase() == 'preference') {
                legendEntry.children('.candidate_name').children('.candidate_name_first').show();
            }
            
            if (config.candidateImages[data.candidates[candidateId]]) {
                legendEntry.children('.candidate_image').attr('src', config.candidateImages[data.candidates[candidateId]]);
            }
            
            if (data.winners[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]] == candidateId) {
                legendEntry.children('.candidate_won').show();
            }
            fillAreas(candidateId);
        }
        
        nhmc.tooltips.render = function() {
            var thisFIPS = '';
            var thisState = '';
            var thisCounty = '';
            
            var latestStateData = latestData[$('#map_view').val()];
            
            if (this.nhmcData.county_fips != undefined) {
                thisFIPS = this.nhmcData.county_fips;
                thisCounty = nhmc.config.FIPSToCounty[thisFIPS][1];
                thisState = nhmc.config.FIPSToCounty[thisFIPS][0];
            } else if (this.nhmcData.county != undefined) {
                thisState = nhmc.config.USPSToState[$('#map_view').val().toUpperCase()];
                thisCounty = this.nhmcData.county;
                thisFIPS = nhmc.config.countyToFIPS[thisState][thisCounty];
            } else {
                thisState = this.nhmcData.state;
            }
            
            var tooltipText = [
                '<div id="tooltip">', 
            ];
            if (this.nhmcData.county != undefined) {
                tooltipText.push('<h3>' + thisCounty + '</h3>');
            } else if (thisCounty != '') {
                tooltipText.push('<h3>' + thisCounty + ', ' + thisState + '</h3>');
            } else {
                tooltipText.push('<h3>' + thisState + '</h3>');
            }
            var areaName = thisCounty != '' ? thisFIPS : thisState;
            var areaResults = latestStateData.areas[areaName];
            tooltipText.push('<p>' + areaResults.precincts[0] + ' of ' + areaResults.precincts[1] + ' precincts reporting</p>');
            if (areaResults.precincts[0] != 0) {
            // if (areaResults.data) {
                tooltipText.push('<table id="tooltip_results"><thead><tr><td class="tooltip_results_candidate">Candidate</td><td class="tooltip_results_votes">Votes</td></tr></thead><tbody>');
                for (var i = 0, length = areaResults.data.length; i < length; i++) {
                    var candidateResult = areaResults.data[i];
                    var candidateName = latestStateData.candidates[candidateResult[0]];
                    var candidateNameParts = candidateName.split(' ');
                    var candidateLastName = candidateNameParts[candidateNameParts.length - 1];
                    
                    if (candidateLastName.toLowerCase() == 'preference') {
                        candidateLastName = 'No Preference';
                    }
                    
                    tooltipText.push('<tr><td>' + candidateLastName + '</td>');
                    tooltipText.push('<td>' + formatThousands(candidateResult[1]) + '</td></tr>');
                }
                tooltipText.push('</tbody></table>');
            }
            tooltipText.push('</div>');
            $('body').append(tooltipText.join(''));
            
            if (Modernizr.touch) {nhmc.tooltips.addClose();}
        };
        if (nhmc.tooltips.hoverHandlerTokens.length == 0) {
            nhmc.tooltips.init();
        }
        
        if (data.test && $('#test_data').length == 0) {
            $('#view_info h1').append(' <span id="test_data">(test)</span>');
        } else if (!data.test) {
            $('#test_data').remove();
        }
    }
    
    $('.view_tab_option').click(function() {
        var mapValue = $(this).attr('href').substring(1);
        $('#map_view').val(mapValue);
        $('#view_tab_more_shown').attr('href', $('#view_tab_more_menu .view_tab_option[href="#' + mapValue + '"]').attr('href'));
        nhmc.ctrl.zoomToState(mapValue);
        
        var intervalId;
        function pollDrawingFlag() {
            if (!nhmc.cleanup.currentlyDrawing) {
                window.clearInterval(intervalId);
                sidebarInit();
                getMapData(mapValue);
            }
        }
        intervalId = window.setInterval(pollDrawingFlag, 50);
    });
    
    function sidebarInit() {
        var shownMapValue = $('#map_view').val();
        var shownMapOption = $('#view_tab_more_menu .view_tab_option[href="#' + shownMapValue + '"]');
        $('.view_tab_more li').show();
        $('#view_tab_more_shown').text(shownMapOption.text()).attr('href', shownMapOption.attr('href'));
        shownMapOption.parent().hide();
        
        $('#legend').show();
    }
    
    function getMapData(state) {
        // $('#loading').show();
        $.ajax({
            url: 'http://www.pbs.org/newshour/vote2012/map/live_data/' + state + '.json',
            dataType: 'jsonp',
            jsonpCallback: state,
            success: function(data) {
                if (config.condenseCandidates) {
                    latestData[state] = condenseCandidates(data);
                } else {
                    latestData[state] = data;
                }
                liveDataInit(latestData[state]);
                // $('#loading').hide();
            }
        });
    }
    
    if (config.autoRefresh) {
        if (autoRefreshIntervalId) {
            window.clearInterval(autoRefreshIntervalId);
        }
        
        autoRefreshIntervalId = window.setInterval(function() {
            getMapData($('#map_view').val());
        }, config.autoRefreshDelay);
        
        $('#live_refresh_on').removeClass('live_refresh_inactive').addClass('live_refresh_active');
        $('#live_refresh_off').removeClass('live_refresh_active').addClass('live_refresh_inactive');
    }
    
    $('#live_refresh_on').click(function() {
        if ($('#live_refresh_on').hasClass('live_refresh_inactive')) {
            if (autoRefreshIntervalId) {
                window.clearInterval(autoRefreshIntervalId);
            }
            
            autoRefreshIntervalId = window.setInterval(function() {
                getMapData($('#map_view').val());
            }, config.autoRefreshDelay);
            
            $('#live_refresh_on').removeClass('live_refresh_inactive').addClass('live_refresh_active');
            $('#live_refresh_off').removeClass('live_refresh_active').addClass('live_refresh_inactive');
        }
        return false;
    });
    $('#live_refresh_off').click(function() {
        if ($('#live_refresh_off').hasClass('live_refresh_inactive')) {
            if (autoRefreshIntervalId) {
                window.clearInterval(autoRefreshIntervalId);
            }
            
            $('#live_refresh_on').removeClass('live_refresh_active').addClass('live_refresh_inactive');
            $('#live_refresh_off').removeClass('live_refresh_inactive').addClass('live_refresh_active');
        }
        return false;
    });
    
    sidebarInit();
    getMapData($('#map_view').val());
};
