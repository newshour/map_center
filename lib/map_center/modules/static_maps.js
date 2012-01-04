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
    
    var currentData = {};
    
    function staticTypesInit(data) {
        var mapView = $('#map_view').val();
        $('#legend_entries').empty();
        currentData = data;
        
        if (data.categories) {
            function fillAreas(i, clearFill) {
                // default clearFill to false
                clearFill = (typeof clearFill == 'undefined') ? false : clearFill;
                var areaType = data.categories[i];
                var areaList = data.areaLists[areaType];
                if (clearFill) {
                    var areaFill = nhmc.config.styleColors['default'];
                } else {
                    var areaFill = data.colors[areaType];
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
        
            for (var i = 0, length = data.categories.length; i < length; i++) {
                var areaType = data.categories[i];
                var legendEntry = $('#legend_templates .category_entry').clone().appendTo('#legend_entries');
                legendEntry.children('.entry_color').css('background-color', data.colors[data.categories[i]]);
                legendEntry.children('.category_name').text(areaType);
                fillAreas(i);
            }
        } else if (data.breaks) {
            // Color each area appropriately.
            for (var areaId in data.areas) {
                for (var i = 0, length = data.breaks.length; i < length; i++) {
                    if (data.areas[areaId] <= data.breaks[i]) {
                        var areaFill = data.colors[i];
                        
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
            for (var i = 0, length = data.breaks.length; i < length; i++) {
                var breakText = '';
                var breakPrefix = data.prefix || '';
                var breakSuffix = data.suffix || '';
                var breakDecimals = data.decimalPlaces || 0;
                if (i == 0) {
                    breakText = '&lt;' + breakPrefix + data.breaks[i].toFixed(breakDecimals) + breakSuffix;
                } else if (i == length - 1) {
                    breakText = '&ge;' + breakPrefix + data.breaks[i - 1].toFixed(breakDecimals) + breakSuffix;
                } else {
                    breakText = breakPrefix + data.breaks[i - 1].toFixed(breakDecimals) + breakSuffix + '&ndash;' + breakPrefix + data.breaks[i].toFixed(breakDecimals) + breakSuffix;
                }
                
                $('#static_legend').append('<li style="background-color: ' + data.colors[i] + ';"><span id="static_legend_' + i + '" class="area_type">' + breakText + '</span></li>');
                var legendEntry = $('#legend_templates .break_entry').clone().appendTo('#legend_entries');
                legendEntry.children('.entry_color').css('background-color', data.colors[i]);
                legendEntry.children('.break_text').html(breakText);
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
                staticTypesInit(typeof(nhmcStatic.areas) == 'undefined' ? nhmcStatic[0] : nhmcStatic);
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
        if (currentData.categories) {
            var areaName = thisCounty != '' ? thisFIPS : thisState;
            for (var category in currentData.areaLists) {
                if (currentData.areaLists[category].indexOf(areaName) != -1) {
                    tooltipText.push(category + '</p>');
                    break;
                }
            }
        } else if (currentData.breaks) {
            if (thisCounty != '') {
                tooltipText.push((currentData.prefix || '') + currentData.areas[thisFIPS] + (currentData.suffix || '') + '</p>');
            } else {
                tooltipText.push((currentData.prefix || '') + currentData.areas[thisState] + (currentData.suffix || '') + '</p>');
            }
        }
        tooltipText.push('</div>');
        $('body').append(tooltipText.join(''));
        if (Modernizr.touch) {nhmc.tooltips.addClose();}
    };
    nhmc.tooltips.init();
    
    $('#legend').show();
    staticTypesInit(typeof(nhmcStatic.areas) == 'undefined' ? nhmcStatic[0] : nhmcStatic);
};
