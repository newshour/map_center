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
    
    function liveDataInit(data) {
        function fillAreas(candidateId, clearFill) {
            // default clearFill to false
            clearFill = (typeof clearFill == 'undefined') ? false : clearFill;
            
            if (clearFill) {
                var areaFill = nhmc.config.styleColors['default'];
            } else {
                var areaFill = data.colors[candidateId];
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
        
        if ($('#precincts').length > 0) {$('#precincts').remove();}
        $('#live_legend').before('<p id="precincts"><span id="precincts_reporting">' + data.precincts[0] + '</span> of <span id="precincts_total">' + data.precincts[1] + '</span> precincts reporting</p>');
        for (var i = 0, length = data.breakdown.length; i < length; i++) {
            var candidateId = data.breakdown[i][0];
            $('#live_legend').append('<li style="background-color: ' + data.colors[candidateId] + ';"><a href="#" id="live_legend_' + candidateId + '" class="area_type selected">' + data.candidates[candidateId] + '</a></li>');
            fillAreas(candidateId);
        }
        $('#live_legend').append('<li><a href="#" id="live_legend_show_all" class="control_all">Show all</a></li>');
        $('#live_legend').append('<li><a href="#" id="live_legend_clear_all" class="control_all">Clear all</a></li>');
        $('#live_legend .area_type').click(function() {
            var candidateId = parseInt($(this).attr('id').substring(12));
            var selected = $(this).hasClass('selected');
            if (selected) {
                fillAreas(candidateId, true);
                $(this).removeClass('selected');
            } else {
                fillAreas(candidateId, false);
                $(this).addClass('selected');
            }
            return false;
        });
        $('#live_legend .control_all').click(function() {
            var show = $(this).attr('id') == 'live_legend_show_all';
            if (show) {
                for (var i = 0, length = data.breakdown.length; i < length; i++) {
                    var candidateId = data.breakdown[i][0];
                    fillAreas(candidateId, false);
                    $('#live_legend_' + candidateId).addClass('selected');
                }
            } else {
                for (var i = 0, length = data.breakdown.length; i < length; i++) {
                    var candidateId = data.breakdown[i][0];
                    fillAreas(candidateId, true);
                    $('#live_legend_' + candidateId).removeClass('selected');
                }
            }
            return false;
        });
        
        nhmc.tooltips.render = function() {
            var thisFIPS = '';
            var thisState = '';
            var thisCounty = '';
            
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
            var areaResults = data.areas[areaName];
            tooltipText.push('<p>' + areaResults.precincts[0] + ' of ' + areaResults.precincts[1] + ' precincts reporting</p>');
            if (areaResults.precincts[0] != 0) {
            // if (areaResults.data) {
                tooltipText.push('<table id="tooltip_results"><thead><tr><td class="tooltip_results_candidate">Candidate</td><td class="tooltip_results_votes">Votes</td></tr></thead><tbody>');
                for (var i = 0, length = areaResults.data.length; i < length; i++) {
                    var candidateResult = areaResults.data[i];
                    var candidateName = data.candidates[candidateResult[0]];
                    var candidateNameParts = candidateName.split(' ');
                    var candidateLastName = candidateNameParts[candidateNameParts.length - 1];
                    tooltipText.push('<tr><td>' + candidateLastName + '</td>');
                    tooltipText.push('<td>' + candidateResult[1] + '</td></tr>');
                }
                tooltipText.push('</tbody></table>');
            }
            tooltipText.push('</div>');
            $('body').append(tooltipText.join(''));
            nhmc.tooltips.addClose();
        };
        nhmc.tooltips.init();
        
        if (data.test) {
            $('#view_info h1').append(' <span id="test_data">(test)</span>');
        } else {
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
        
        $('#legend').append('<ul id="live_legend"></ul>');
        nhmc.cleanup.futureGarbage.push($('#live_legend'));
        $('#legend').show();
    }
    
    function getMapData(state) {
        $.ajax({
            url: 'http://www.pbs.org/newshour/vote2012/map/live_data/' + state + '.json',
            dataType: 'jsonp',
            jsonpCallback: state,
            success: function(data) {
                latestData[state] = data;
                liveDataInit(data);
            }
        });
    }
    
    sidebarInit();
    getMapData($('#map_view').val());
};
