namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");
namespace("nhmc.tooltips");

namespace("nhmcStatic");

nhmc.mapSpecificInit = function() {
    // add local references for performance reasons
    var countyGeo = nhmc.geo.countyGeo;
    var usGeo = nhmc.geo.usGeo;
    var FIPSToCounty = nhmc.config.FIPSToCounty;
    
    function staticTypesInit() {
        var mapView = $('#map_view').val();
        
        $('#legend').append('<ul id="static_legend"></ul>');
        nhmc.cleanup.futureGarbage.push($('#static_legend'));
        $('#legend').show();
        
        if (nhmcStatic.categories) {
            function fillAreas(i, clearFill) {
                // default clearFill to false
                clearFill = (typeof clearFill == 'undefined') ? false : clearFill;
                var areaType = nhmcStatic.categories[i];
                var areaList = nhmcStatic.areaLists[areaType];
                if (clearFill) {
                    var areaFill = nhmc.config.styleColors['default'];
                } else {
                    var areaFill = nhmcStatic.colors[areaType];
                }
                for (var j = 0, length = areaList.length; j < length; j++) {
                    // areaList contains either county FIPS codes or state names.
                    var areaId = areaList[j];
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
        
            for (var i = 0, length = nhmcStatic.categories.length; i < length; i++) {
                var areaType = nhmcStatic.categories[i];
                $('#static_legend').append('<li style="background-color: ' + nhmcStatic.colors[nhmcStatic.categories[i]] + ';"><a href="#" id="static_legend_' + i + '" class="area_type selected">' + areaType + '</a></li>');
                fillAreas(i);
            }
            $('#static_legend').append('<li><a href="#" id="static_legend_show_all" class="control_all">Show all</a></li>');
            $('#static_legend').append('<li><a href="#" id="static_legend_clear_all" class="control_all">Clear all</a></li>');
            
            $('#static_legend .area_type').click(function() {
                var areaTypeId = parseInt($(this).attr('id').substring(14));
                var selected = $(this).hasClass('selected');
                if (selected) {
                    fillAreas(areaTypeId, true);
                    $(this).removeClass('selected');
                } else {
                    fillAreas(areaTypeId, false);
                    $(this).addClass('selected');
                }
                return false;
            });
            
            $('#static_legend .control_all').click(function() {
                var show = $(this).attr('id') == 'static_legend_show_all';
                if (show) {
                    for (var i = 0, length = nhmcStatic.categories.length; i < length; i++) {
                        fillAreas(i, false);
                        $('#static_legend_' + i).addClass('selected');
                    }
                } else {
                    for (var i = 0, length = nhmcStatic.categories.length; i < length; i++) {
                        fillAreas(i, true);
                        $('#static_legend_' + i).removeClass('selected');
                    }
                }
                return false;
            });
        } else if (nhmcStatic.breaks) {
            // Color each area appropriately.
            for (var areaId in nhmcStatic.areas) {
                for (var i = 0, length = nhmcStatic.breaks.length; i < length; i++) {
                    if (nhmcStatic.areas[areaId] <= nhmcStatic.breaks[i]) {
                        var areaFill = nhmcStatic.colors[i];
                        
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
                        break;
                    }
                }
            }
            
            // Render the legend.
            for (var i = 0, length = nhmcStatic.breaks.length; i < length; i++) {
                var breakText = '';
                var breakSuffix = nhmcStatic.suffix || '';
                if (i == 0) {
                    breakText = '&lt;' + nhmcStatic.breaks[i].toFixed(1) + breakSuffix;
                } else if (i == length - 1) {
                    breakText = '&ge;' + nhmcStatic.breaks[i - 1].toFixed(1) + breakSuffix;
                } else {
                    breakText = nhmcStatic.breaks[i].toFixed(1) + breakSuffix + '&ndash;' + nhmcStatic.breaks[i + 1].toFixed(1) + breakSuffix;
                }
                
                $('#static_legend').append('<li style="background-color: ' + nhmcStatic.colors[i] + ';"><span id="static_legend_' + i + '" class="area_type">' + breakText + '</span></li>');
            }
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
                staticTypesInit();
            }
        }
        intervalId = window.setInterval(pollDrawingFlag, 50);
    });
    
    var shownMapValue = $('#map_view').val();
    var shownMapOption = $('#view_tab_more_menu .view_tab_option[href="#' + shownMapValue + '"]');
    $('.view_tab_more li').show();
    $('#view_tab_more_shown').text(shownMapOption.text()).attr('href', shownMapOption.attr('href'));
    shownMapOption.parent().hide();
    
    nhmc.tooltips.render = function() {
        $('#tooltip').remove();
        
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
            tooltipText.push('<p>' + thisCounty + ': ');
        } else if (thisCounty != '') {
            tooltipText.push('<p>' + thisCounty + ', ' + thisState + ': ');
        } else {
            tooltipText.push('<p>' + thisState + ': ');
        }
        if (nhmcStatic.categories) {
            var areaName = thisCounty != '' ? thisFIPS : thisState;
            for (var category in nhmcStatic.areaLists) {
                if (nhmcStatic.areaLists[category].indexOf(areaName) != -1) {
                    tooltipText.push(category + '</p>');
                    break;
                }
            }
        } else if (nhmcStatic.breaks) {
            if (thisCounty != '') {
                tooltipText.push(nhmcStatic.areas[thisFIPS] + (nhmcStatic.suffix || '') + '</p>');
            } else {
                tooltipText.push(nhmcStatic.areas[thisState] + (nhmcStatic.suffix || '') + '</p>');
            }
        }
        tooltipText.push('</div>');
        $('body').append(tooltipText.join(''));
        if (Modernizr.touch) {nhmc.tooltips.addClose();}
    };
    nhmc.tooltips.init();
    
    staticTypesInit();
};
