namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");
namespace("nhmc.tooltips");

nhmc.autoRefreshIntervalId = null;

nhmc.mapSpecificInit = function() {
    // add local references for performance reasons
    var countyGeo = nhmc.geo.countyGeo;
    var usGeo = nhmc.geo.usGeo;
    var FIPSToCounty = nhmc.config.FIPSToCounty;
    
    var latestData = {};
    var latestFullData = {};
    var config = {
        autoRefresh: true,
        autoRefreshDelay: 1000 * 15,
        bigCandidates: 3,
        blankMap: false,
        candidateColors: {
           "Michele Bachmann": "#838282",
           "Herman Cain": "#838282",
           "Newt Gingrich": "#bbe5c2",
           "Rick Santorum": "#6089b3",
           "Gary Johnson": "#e7298a",
           "Ron Paul": "#f1d174",
           "Jon Huntsman": "#581920",
           "Buddy Roemer": "#9f9f9f",
           "Mitt Romney": "#f18a5d",
           "Rick Perry": "#162e48",
           "No Preference": "#000000",
           "Other": "#838282"
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
        flyouts: null,  // set to string with desired corner (ne, nw, se, sw)
        flyoutWidth: 200,
        showCandidates: [
            "Mitt Romney",
            "Rick Santorum",
            "Ron Paul",
            "Jon Huntsman",
            "Michele Bachmann",
            "Newt Gingrich",
            "Rick Perry"
        ],
        strokeHighlight: "#9F1C20",
        tooltipsEnabled: true
    };
    
    if (typeof(nhmc_live_config) != 'undefined') {
        $.extend(true, config, nhmc_live_config);
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
            
            if (clearFill || config.blankMap) {
                var areaFill = nhmc.config.defaultAttributes.fill;
            } else {
                var areaFill = config.candidateColors[data.candidates[candidateId]] || config.candidateColors['Other'];
            }
            
            for (var areaId in data.areas) {
                if (candidateId == data.areas[areaId].data[0][0] && data.areas[areaId].data[0][1] != 0 && data.areas[areaId].precincts[0] != 0) {
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
            
            legendEntry.find('.candidate_color').css('background-color', config.candidateColors[data.candidates[candidateId]] || config.candidateColors['Other']);
            legendEntry.find('.candidate_vote_count').text(formatThousands(data.breakdown[i][1]));
            legendEntry.find('.candidate_votes').text(Math.round(candidateVotePercent) + '%');
            
            legendEntry.find('.candidate_name').find('.candidate_name_first').text(candidateNameParts.slice(0, -1).join(' '));
            legendEntry.find('.candidate_name').find('.candidate_name_last').text(candidateLastName);
            if (candidateLastName.toLowerCase() == 'preference') {
                legendEntry.find('.candidate_name').find('.candidate_name_first').show();
            }
            
            if (config.candidateImages[data.candidates[candidateId]]) {
                var candidateImage = $('#legend_images .candidate_image_' + candidateId);
                if (candidateImage.length) {
                    legendEntry.find('.candidate_image').replaceWith(candidateImage.clone());
                } else {
                    legendEntry.find('.candidate_image').attr('src', config.candidateImages[data.candidates[candidateId]]).addClass('candidate_image_' + candidateId).clone().appendTo('#legend_images');
                }
            }
            
            if (data.winners[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]] == candidateId) {
                legendEntry.find('.candidate_won').show();
            }
            fillAreas(candidateId);
        }
        
        if (config.flyouts) {
            nhmc.tooltips.render = function() {
                var thisFIPS = '';
                var thisState = '';
                var thisCounty = '';
                
                var latestStateData = latestData[$('#map_view').val()];
                
                this.setStroke({
                    color: config.strokeHighlight,
                    width: 3
                });
                this.moveToFront();
                for (var i in nhmc.geo.usGeo[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].cityPaths) {
                    var path = nhmc.geo.usGeo[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].cityPaths[i];
                    path.moveToFront();
                }
                
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
                
                var flyout = $('<div id="tooltip" class="tooltip_flyout"></div>').appendTo('body');
                var flyoutContent = $('#flyout .flyout_content').clone().appendTo('#tooltip');
                
                if (this.nhmcData.county != undefined) {
                    flyoutContent.find('.flyout_name').text(thisCounty);
                } else if (thisCounty != '') {
                    flyoutContent.find('.flyout_name').text(thisCounty + ', ' + thisState);
                } else {
                    flyoutContent.find('.flyout_name').text(thisState);
                }
                
                var areaName = thisCounty != '' ? thisFIPS : thisState;
                
                var areaResults = latestStateData.areas[areaName];
        
                flyoutContent.find('.flyout_precincts_percent').text((100 * areaResults.precincts[0] / areaResults.precincts[1]).toFixed(1));
                flyoutContent.find('.flyout_precincts_reporting').text(areaResults.precincts[0]);
                flyoutContent.find('.flyout_precincts_total').text(areaResults.precincts[1]);
                
                if (areaResults.precincts[0] != 0) {
                    var areaTotalVotes = 0;
                    for (var i = 0, length = areaResults.data.length; i < length; i++) {
                        areaTotalVotes += areaResults.data[i][1];
                    }
                    var flyoutCandidates = flyoutContent.find('.flyout_candidates');
                    flyoutCandidates.empty();
                    for (var i = 0, length = areaResults.data.length; i < length; i++) {
                        var candidateId = areaResults.data[i][0];
                        
                        var candidateName = latestStateData.candidates[candidateId];
                        var candidateNameParts = candidateName.split(' ');
                        var candidateLastName = candidateNameParts[candidateNameParts.length - 1];
                        
                        var candidateVotePercent = 100 * areaResults.data[i][1] / areaTotalVotes;
                        if (areaTotalVotes == 0) {candidateVotePercent = 0;}
                        
                        var legendEntry = flyoutContent.find('.flyout_templates .flyout_candidate').clone().appendTo(flyoutCandidates);
                        
                        legendEntry.find('.flyout_candidate_color').css('background-color', config.candidateColors[latestStateData.candidates[candidateId]] || config.candidateColors['Other']);
                        legendEntry.find('.flyout_candidate_vote_count').text(formatThousands(areaResults.data[i][1]));
                        legendEntry.find('.flyout_candidate_votes').text(Math.round(candidateVotePercent) + '%');
                        
                        legendEntry.find('.flyout_candidate_name_first').text(candidateNameParts.slice(0, -1).join(' '));
                        legendEntry.find('.flyout_candidate_name_last').text(candidateLastName);
                        if (candidateLastName.toLowerCase() == 'preference') {
                            legendEntry.find('.flyout_candidate_name_first').show();
                        }
                    }
                }
                
                if (Modernizr.touch) {nhmc.tooltips.addClose();}
            };
            
            nhmc.tooltips.position = function(e) {
                var tooltip = $('#tooltip');
                
                var mapPosition = $('#map').position();
                
                if (config.flyouts == 'se') {
                    var leftCoord = mapPosition.left + $('#map').width() - config.flyoutWidth - 25;
                    var topCoord = mapPosition.top + $('#map').height() - tooltip.height();
                } else if (config.flyouts == 'ne') {
                    var leftCoord = mapPosition.left + $('#map').width() - config.flyoutWidth - 25;
                    var topCoord = mapPosition.top;
                } else if (config.flyouts == 'sw') {
                    var leftCoord = mapPosition.left;
                    var topCoord = mapPosition.top + $('#map').height() - tooltip.height();
                } else {  // assume nw
                    var leftCoord = mapPosition.left;
                    var topCoord = mapPosition.top;
                }
                
                tooltip.css('left', leftCoord + 'px');
                tooltip.css('top', topCoord + 'px');
                
                // if (Modernizr && Modernizr.touch) {
                if (true) {
                    $('#tooltip').animate({
                        'width': config.flyoutWidth
                    }, 500)
                } else {
                    $('#tooltip').width(config.flyoutWidth);
                }
            };
            
            nhmc.tooltips.destroy = function() {
                $('#tooltip').remove();
                for (var i = 0, length = nhmc.surface.children.length; i < length; i++) {
                    var child = nhmc.surface.children[i];
                    if (typeof(child.nhmcData) != 'undefined') {
                        child.setStroke(nhmc.config.defaultAttributes.stroke);
                    }
                }
            };
            
            if (nhmc.tooltips.hoverHandlerTokens.length == 0) {
                nhmc.tooltips.init();
            }
        } else if (config.tooltipsEnabled) {
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
        }
        
        if (config.condenseCandidates && config.hoverExpandOther) {
            var otherElement = $('.candidate_small').filter(function(i) {
                var candidateName = $(this).find('.candidate_name');
                if (candidateName.find('.candidate_name_last').text() == 'Other' && candidateName.find('.candidate_name_first').text() == '') {
                    return true;
                } else {
                    return false;
                }
            });
            
            var otherTooltip = {};
            otherTooltip.xOffset = nhmc.tooltips.xOffset;
            otherTooltip.yOffset = nhmc.tooltips.yOffset;
            otherTooltip.render = function(e) {
                $('#other_tooltip').remove();
                
                var latestStateData = latestFullData[$('#map_view').val()];
                
                var tooltipText = [
                    '<div id="other_tooltip">', 
                ];
                tooltipText.push('<h3>Other candidates</h3>');
                var areaResults = latestStateData.breakdown;
                if (latestStateData.precincts[0] != 0) {
                    tooltipText.push('<table id="other_tooltip_results"><thead><tr><td class="other_tooltip_results_candidate">Candidate</td><td class="other_tooltip_results_votes">Votes</td></tr></thead><tbody>');
                    for (var i = 0, length = areaResults.length; i < length; i++) {
                        var candidateResult = areaResults[i];
                        var candidateName = latestStateData.candidates[candidateResult[0]];
                        if (config.showCandidates.indexOf(candidateName) == -1) {
                            var candidateNameParts = candidateName.split(' ');
                            var candidateLastName = candidateNameParts[candidateNameParts.length - 1];
                            
                            if (candidateLastName.toLowerCase() == 'preference') {
                                candidateLastName = 'No Preference';
                            }
                            
                            tooltipText.push('<tr><td>' + candidateLastName + '</td>');
                            tooltipText.push('<td>' + formatThousands(candidateResult[1]) + '</td></tr>');
                        }
                    }
                    tooltipText.push('</tbody></table>');
                }
                tooltipText.push('</div>');
                $('body').append(tooltipText.join(''));
                
                if (Modernizr.touch) {otherTooltip.addClose();}
                
                otherTooltip.position(e);
            };
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
        
        $('#legend_templates').append('<div id="legend_images"></div>');
        
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
                latestFullData[state] = data;
                liveDataInit(latestData[state]);
                // $('#loading').hide();
            }
        });
    }
    
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
    
    sidebarInit();
    getMapData($('#map_view').val());
};
