namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");

namespace("nhmcStatic");

nhmc.mapSpecificInit = function() {
    var staticCategories = nhmcStatic.categories;
    var staticAreaLists = nhmcStatic.areaLists;
    
    var staticBreaks = nhmcStatic.breaks;
    var staticAreas = nhmcStatic.areas;
    
    var staticColors = nhmcStatic.colors;
    
    // add local references for performance reasons
    var countyGeo = nhmc.geo.countyGeo;
    var usGeo = nhmc.geo.usGeo;
    var FIPSToCounty = nhmc.config.FIPSToCounty;
    
    function staticTypesInit() {
        $('#legend').append('<ul id="static_legend"></ul>');
        nhmc.cleanup.futureGarbage.push($('#static_legend'));
        $('#legend').show();
        
        if (staticCategories) {
            function fillAreas(i, clearFill) {
            // default clearFill to false
            clearFill = (typeof clearFill == 'undefined') ? false : clearFill;
            var areaType = staticCategories[i];
            var areaList = staticAreaLists[areaType];
            if (clearFill) {
                var areaFill = nhmc.config.styleColors['default'];
            } else {
                var areaFill = staticColors[areaType];
            }
            for (var j = 0, length = areaList.length; j < length; j++) {
                // areaList contains either county FIPS codes or state names.
                var areaId = areaList[j];
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
        
        for (var i = 0, length = staticCategories.length; i < length; i++) {
                var areaType = staticCategories[i];
                $('#static_legend').append('<li style="background-color: ' + staticColors[staticCategories[i]] + ';"><a href="#" id="static_legend_' + i + '" class="county_type selected">' + areaType + '</a></li>');
                fillAreas(i);
            }
            $('#static_legend').append('<li><a href="#" id="static_legend_show_all" class="control_all">Show all</a></li>');
            $('#static_legend').append('<li><a href="#" id="static_legend_clear_all" class="control_all">Clear all</a></li>');
            
            $('#static_legend .county_type').click(function() {
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
                    for (var i = 0, length = staticCategories.length; i < length; i++) {
                        fillAreas(i, false);
                        $('#static_legend_' + i).addClass('selected');
                    }
                } else {
                    for (var i = 0, length = staticCategories.length; i < length; i++) {
                        fillAreas(i, true);
                        $('#static_legend_' + i).removeClass('selected');
                    }
                }
                return false;
            });
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
    staticTypesInit();
};
