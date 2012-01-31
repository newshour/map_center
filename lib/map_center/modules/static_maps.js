namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");
namespace("nhmc.tooltips");

namespace("nhmcStatic");

$(document).one('coreInitialized', function() {
    // add local references for performance reasons
    var countyGeo = nhmc.geo.countyGeo;
    var usGeo = nhmc.geo.usGeo;
    var FIPSToCounty = nhmc.config.FIPSToCounty;
    
    var currentData = {};
    
    if (typeof(nhmcStaticFlyouts) != 'undefined') {
        var flyoutConfig = $.extend(true, {
            corner: 'nw',
            width: 200,
            strokeHighlight: "#9F1C20"
        }, nhmcStaticFlyouts);
    } else {
        var flyoutConfig = null;
    }
    
    function staticTypesInit(data) {
        var mapView = $('#map_view').val();
        $('#legend_entries').empty();
        currentData = data;
        
        if (typeof(data.seriesName) != 'undefined') {
            $('.static_map_name').text(data.seriesName);
        }
        
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
                legendEntry.find('.entry_color').css('background-color', data.colors[data.categories[i]]);
                legendEntry.find('.category_name').text(areaType);
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
                            var stateObj = usGeo[areaId];
                            if (stateObj != undefined) {
                                stateObj.statePath.setFill(areaFill);
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
            
            var breakFormatter = typeof(nhmcStaticBreakFormatter) != 'undefined' ?nhmcStaticBreakFormatter : function(thisBreak, prevBreak, isLastBreak, breakPrefix, breakSuffix, breakDecimals) {
                if (isLastBreak) {
                    return '&ge;' + breakPrefix + prevBreak.toFixed(breakDecimals) + breakSuffix;
                } else if (prevBreak) {
                    return breakPrefix + prevBreak.toFixed(breakDecimals) + breakSuffix + '&ndash;' + breakPrefix + thisBreak.toFixed(breakDecimals) + breakSuffix;
                } else {
                    return '&lt;' + breakPrefix + thisBreak.toFixed(breakDecimals) + breakSuffix;
                }
            };
            
            var breakPrefix = data.prefix || '';
            var breakSuffix = data.suffix || '';
            var breakDecimals = data.decimalPlaces || 0;
            
            // Render the legend.
            for (var i = 0, length = data.breaks.length; i < length; i++) {
                if (i == 0) {
                    var breakText = breakFormatter(data.breaks[i], null, false, breakPrefix, breakSuffix, breakDecimals);
                } else if (i == length - 1) {
                    var breakText = breakFormatter(data.breaks[i], data.breaks[i - 1], true, breakPrefix, breakSuffix, breakDecimals);
                } else {
                    var breakText = breakFormatter(data.breaks[i], data.breaks[i - 1], false, breakPrefix, breakSuffix, breakDecimals);
                }
                
                var legendEntry = $('#legend_templates .break_entry').clone().appendTo('#legend_entries');
                legendEntry.find('.entry_color').css('background-color', data.colors[i]);
                legendEntry.find('.break_text').html(breakText);
            }
        }
    }
    
    $('.view_tab_more .view_tab_option').click(function() {
        var dataIndex = $('#view_tab_options_more_shown').length == 0 ? 0 : parseInt($('#view_tab_options_more_shown').attr('href').substring(8));
        
        $(document).one('drawingComplete', function() {
            staticTypesInit(typeof(nhmcStatic[dataIndex]) == 'undefined' ? nhmcStatic : nhmcStatic[dataIndex]);
        });
        
        var mapValue = $(this).attr('href').substring(1);
        $('#map_view').val(mapValue);
        $('#view_tab_more_shown').attr('href', '#' + mapValue);
        nhmc.ctrl.zoomToState(mapValue);
    });
    $('.view_tab_options_more .view_tab_option').click(function() {
        var dataIndex = parseInt($(this).attr('href').substring(8));
        $('#view_tab_options_more_shown').attr('href', '#static_' + dataIndex);
        
        staticTypesInit(typeof(nhmcStatic[dataIndex]) == 'undefined' ? nhmcStatic : nhmcStatic[dataIndex]);
    });
    
    var shownMapValue = $('#map_view').val();
    var shownMapOption = $('#view_tab_more_menu .view_tab_option[href="#' + shownMapValue + '"]');
    $('.view_tab_more li').show();
    $('#view_tab_more_shown').text(shownMapOption.text()).attr('href', shownMapOption.attr('href'));
    shownMapOption.parent().hide();
    
    var tooltipFormatter = typeof(nhmcStaticTooltipFormatter) != 'undefined' ? nhmcStaticTooltipFormatter : function(thisFIPS, thisState, thisCounty, countyOnly, currentData) {
        var tooltipText = [];
        if (countyOnly) {
            tooltipText.push('<p>' + thisCounty + ': <br />');
        } else if (thisCounty != '') {
            tooltipText.push('<p>' + thisCounty + ', ' + thisState + ': <br />');
        } else {
            tooltipText.push('<p>' + thisState + ': <br />');
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
            if (typeof(currentData.areas[thisFIPS]) == 'undefined') {
                tooltipText.push('Unavailable');
            } else if (thisCounty != '') {
                tooltipText.push((currentData.prefix || '') + currentData.areas[thisFIPS].toFixed(currentData.decimalPlaces || 0) + (currentData.suffix || '') + '</p>');
            } else {
                tooltipText.push((currentData.prefix || '') + currentData.areas[thisState].toFixed(currentData.decimalPlaces || 0) + (currentData.suffix || '') + '</p>');
            }
        }
        return tooltipText.join('');
    };
    
    nhmc.tooltips.render = function() {
        $('#tooltip').remove();
        
        var thisFIPS = '';
        var thisState = '';
        var thisCounty = '';
        var countyOnly = false;
        
        if (this.nhmcData.county_fips != undefined) {
            thisFIPS = this.nhmcData.county_fips;
            if (typeof(nhmc.config.FIPSToCounty[thisFIPS]) != 'undefined') {
                thisCounty = nhmc.config.FIPSToCounty[thisFIPS][1];
                thisState = nhmc.config.FIPSToCounty[thisFIPS][0];
            }
        } else if (this.nhmcData.county != undefined) {
            thisState = nhmc.config.USPSToState[$('#map_view').val().toUpperCase()];
            thisCounty = this.nhmcData.county;
            thisFIPS = nhmc.config.countyToFIPS[thisState][thisCounty];
            countyOnly = true;
        } else {
            thisState = this.nhmcData.state;
        }
        
        if (flyoutConfig) {
            this.setStroke({
                color: flyoutConfig.strokeHighlight,
                width: 3
            });
            this.moveToFront();
            if (typeof(nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]) != 'undefined') {
                for (var i in nhmc.geo.usGeo[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].cityPaths) {
                    var path = nhmc.geo.usGeo[nhmc.config.USPSToState[$('#map_view').val().toUpperCase()]].cityPaths[i];
                    path.moveToFront();
                }
            }
        }
        
        $('body').append('<div id="tooltip"' + (flyoutConfig ? ' class="tooltip_flyout"' : '') + '>' + tooltipFormatter(thisFIPS, thisState, thisCounty, countyOnly, currentData) + '</div>');
        if (Modernizr.touch) {nhmc.tooltips.addClose();}
    };
    if (flyoutConfig) {
        nhmc.tooltips.position = function(e) {
            var tooltip = $('#tooltip');
            
            var mapPosition = $('#map').position();
            
            if (flyoutConfig.corner == 'se') {
                var leftCoord = mapPosition.left + $('#map').width() - config.flyoutWidth - 25;
                var topCoord = mapPosition.top + $('#map').height() - tooltip.height();
            } else if (flyoutConfig.corner == 'ne') {
                var leftCoord = mapPosition.left + $('#map').width() - config.flyoutWidth - 25;
                var topCoord = mapPosition.top;
            } else if (flyoutConfig.corner == 'sw') {
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
                    'width': flyoutConfig.width
                }, 500)
            } else {
                $('#tooltip').width(flyoutConfig.width);
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
    }
    if (nhmc.tooltips.hoverHandlerTokens.length == 0) {
        nhmc.tooltips.init();
    }
    
    $('#legend').show();
    
    var dataIndex = $('#view_tab_options_more_shown').length == 0 ? 0 : parseInt($('#view_tab_options_more_shown').attr('href').substring(8));
    staticTypesInit(typeof(nhmcStatic[dataIndex]) == 'undefined' ? nhmcStatic : nhmcStatic[dataIndex]);
});
