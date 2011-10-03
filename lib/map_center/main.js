// declare namespaces
namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");

nhmc.R = null;
nhmc.surface = null;
nhmc.geo.countyGeo = {};
nhmc.charts.lowerChart = null;
nhmc.charts.mainChart = null;

nhmc.cleanup.futureGarbage = [];
nhmc.cleanup.activeDialogs = [];
nhmc.cleanup.clickHandlerTokens = [];

nhmc.config.countySteps = {
    national: 15,
    state: 5
};

nhmc.config.styleColors = {
    'default': '#eeeeee',
    'red': '#990000',
    'blue': '#000099',
    'green': '#009900',
    'purple': '#660099',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#999999',
    'yellow': '#ffb90f',
    'magenta': '#990099',
    'cyan': '#009999',
    'orange': '#ff8c00'
};

nhmc.config.defaultAttributes = {
    'fill': nhmc.config.styleColors['default'],
    'stroke': nhmc.config.styleColors['gray']
};

nhmc.ctrl.zoomToState = function(state) {
    $('#loading').hide();
    nhmc.cleanup.clearMap();
    for (var i in nhmc.geo.usGeo) {
        nhmc.surface.remove(nhmc.geo.usGeo[i].statePath);
        if (nhmc.geo.usGeo[i].label) {nhmc.surface.remove(nhmc.geo.usGeo[i].label);}
        if (!$.isEmptyObject(nhmc.geo.usGeo[i].countyPaths)) {
            for (j in nhmc.geo.usGeo[i].countyPaths) {
                nhmc.surface.remove(nhmc.geo.usGeo[i].countyPaths[j]);
            }
        }
    }
    for (var i in nhmc.geo.countyGeo) {nhmc.surface.remove(nhmc.geo.countyGeo[i]);}
    
    if (state != 'us_all' && state != 'us_counties') {
        state = nhmc.config.USPSToState[state.toUpperCase()];
        if (!$.isEmptyObject(nhmc.geo.usGeo[state].countyPaths)) {
            $('#loading').show();
            
            var keys = [];
            for (var j in nhmc.geo.usGeo[state].countyPaths) {keys.push(j);}
            
            var intervalId;
            var step = 0;
            var totalSteps = nhmc.config.countySteps.state;
            function reloadMoreOfState() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var j=startBreak; j<endBreak; j++) {
                        nhmc.surface.add(nhmc.geo.usGeo[state].countyPaths[keys[j]]);
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(reloadMoreOfState, 0);
        } else {
            $('#loading').show();
            
            var keys = [];
            for (var j in nhmc.geo.usGeo[state].counties) {keys.push(j);}
            
            var intervalId;
            var step = 0;
            var totalSteps = nhmc.config.countySteps.state;
            function loadMoreOfState() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var j=startBreak; j<endBreak; j++) {
                        nhmc.geo.usGeo[state].countyPaths[keys[j]] = nhmc.surface.createPath(nhmc.geo.usGeo[state].counties[keys[j]]);
                        nhmc.geo.usGeo[state].countyPaths[keys[j]].setFill(nhmc.config.defaultAttributes.fill).setStroke(nhmc.config.defaultAttributes.stroke).setTransform(dojox.gfx.matrix.translate(0, -300));
                        $(nhmc.geo.usGeo[state].countyPaths[keys[j]].getNode()).data({'county': keys[j].replace(/ /g, '_')});
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(loadMoreOfState, 0);
        }
    } else if (state == 'us_all') {
        for (var i in nhmc.geo.usGeo) {
            nhmc.surface.add(nhmc.geo.usGeo[i].statePath);
            if (nhmc.geo.usGeo[i].label) {nhmc.surface.add(nhmc.geo.usGeo[i].label);}
        }
    } else if (state == 'us_counties') {
        if (!$.isEmptyObject(nhmc.geo.countyGeo)) {
            $('#loading').show();
            
            var keys = [];
            for (var i in nhmc.geo.countyGeo) {keys.push(i);}
            
            var intervalId;
            var step = 0;
            var totalSteps = nhmc.config.countySteps.national;
            function reloadMoreCounties() {
                var countyGeo = nhmc.geo.countyGeo;
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var i=startBreak; i<endBreak; i++) {
                        nhmc.surface.add(countyGeo[keys[i]]);
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(reloadMoreCounties, 0);
        } else {
            $('#loading').show();
            
            var keys = [];
            for (var i in nhmc.geo.allCounties) {keys.push(i);}
            
            var intervalId;
            var step = 0;
            var totalSteps = nhmc.config.countySteps.national;
            function loadMoreCounties() {
                var countyGeo = nhmc.geo.countyGeo;
                var surface = nhmc.surface;
                var defaultAttributes = nhmc.config.defaultAttributes;
                var allCounties = nhmc.geo.allCounties;
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var i=startBreak; i<endBreak; i++) {
                        countyGeo[keys[i]] = surface.createPath(allCounties[keys[i]]);
                        countyGeo[keys[i]].setFill(defaultAttributes.fill).setStroke(defaultAttributes.stroke);
                        $(countyGeo[keys[i]].getNode()).data({'county_fips': keys[i]});
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(loadMoreCounties, 0);
        }
    }
};

nhmc.ctrl.setStateColors = function(states, color) {
    if (nhmc.config.styleColors[color]) {color = nhmc.config.styleColors[color];}
    for (var i in states) {
        nhmc.geo.usGeo[states[i].replace(/_/g, ' ')].statePath.setFill(color);
    }
};

nhmc.ctrl.setCountyColors = function(state, counties, color) {
    if (nhmc.config.styleColors[color]) {color = nhmc.config.styleColors[color];}
    var mapView = $('#map_view').val();
    if (mapView == 'us_counties') {
        for (var i in counties) {
            nhmc.geo.countyGeo[nhmc.config.countyToFIPS[state.replace(/_/g, ' ')][counties[i].replace(/_/g, ' ')]].setFill(color);
        }
    } else {
        for (var i in counties) {
            nhmc.geo.usGeo[state.replace(/_/g, ' ')].countyPaths[counties[i].replace(/ /g, '_')].setFill(color);
        }
    }
};

nhmc.cleanup.clearCharts = function() {
    if (nhmc.charts.lowerChart) {if (nhmc.charts.lowerChart.destroy) {nhmc.charts.lowerChart.destroy();}}
    if (nhmc.charts.mainChart) {if (nhmc.charts.mainChart.destroy) {nhmc.charts.mainChart.destroy();}}
};

nhmc.cleanup.clearGarbage = function() {
    for (i=0; i<nhmc.cleanup.futureGarbage.length; i++) {nhmc.cleanup.futureGarbage[i].remove();}
};

nhmc.cleanup.closeDialogs = function() {
    for (i=0; i<nhmc.cleanup.activeDialogs.length; i++) {nhmc.cleanup.activeDialogs[i].dialog('close');}
};

nhmc.cleanup.clearClickHandlers = function() {
    for (var i = 0, end = nhmc.cleanup.clickHandlerTokens.length; i < end; i++) {
        dojo.disconnect(nhmc.cleanup.clickHandlerTokens[i]);
    }
};

nhmc.cleanup.clearPathColors = function() {
    $.each(nhmc.geo.usGeo, function(state, stateObj) {
        stateObj.statePath.setFill(nhmc.config.styleColors['default']);
        if (!$.isEmptyObject(nhmc.geo.usGeo[state].countyPaths)) {
            $.each(stateObj.countyPaths, function(county, countyPath) {
                countyPath.setFill(nhmc.config.styleColors['default']);
            });
        }
    });
    $.each(nhmc.geo.countyGeo, function(countyFIPS, countyPath) {
        countyPath.setFill(nhmc.config.styleColors['default']);
    });
};

nhmc.cleanup.clearMap = function() {
    $('#loading').hide();
    
    nhmc.cleanup.clearClickHandlers();
    nhmc.cleanup.clearPathColors();
    
    nhmc.cleanup.clearCharts();
    nhmc.cleanup.closeDialogs();
    nhmc.cleanup.clearGarbage();
    
    $('#view_map a').click();
    $('#view_map, #view_chart').hide();
    
    return false;
};

nhmc.ctrl.renderLegend = function(title, items) {
    $('#legend').append([
        '<table id="main_legend" class="legend"><caption>', title, 
        '</caption><tbody></tbody></table>',
    ].join(''));
    
    for (i=0; i<items.length; i++) {
        $('#main_legend tbody').append([
            '<tr><td>', items[i][0], 
            '</td><td><span class="legend_color" style="background-color: ', 
            nhmc.config.styleColors[items[i][1]], ';">&nbsp;</span></td></tr>',
        ].join(''));
    }
    nhmc.cleanup.futureGarbage.push($('#main_legend'));
    
    $('#legend').hide();
    $('#legend').slideDown(500);
};

nhmc.mapCenterInit = function() {
    for (var i in nhmc.geo.usGeo) {
        nhmc.geo.usGeo[i].statePath = nhmc.surface.createPath(nhmc.geo.usGeo[i].state);
        nhmc.geo.usGeo[i].statePath.setFill(nhmc.config.defaultAttributes.fill);
        nhmc.geo.usGeo[i].statePath.setStroke(nhmc.config.defaultAttributes.stroke);
        $(nhmc.geo.usGeo[i].statePath.getNode()).data({'state': i.replace(/ /g, '_')});
        
        nhmc.geo.usGeo[i].countyPaths = {};
    }
    nhmc.geo.usGeo['District of Columbia'].label = nhmc.surface.createText({x: 742, y: 258, text: "DC"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');
    nhmc.geo.usGeo['Delaware'].label = nhmc.surface.createText({x: 742, y: 233, text: "DE"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');;
    nhmc.geo.usGeo['Connecticut'].label = nhmc.surface.createText({x: 742, y: 208, text: "CT"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');;
    nhmc.geo.usGeo['Rhode Island'].label = nhmc.surface.createText({x: 742, y: 183, text: "RI"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');;
    
    $('#loading').hide();
    
    nhmc.ctrl.zoomToState($('#map_view').val());
    $('#map_view').change(function() {nhmc.ctrl.zoomToState($(this).val());});
    
    $('#view_chart a').click(function() {
        $('#map').slideUp(500);
        $('#chart').slideDown(500);
        $('#view_chart').hide();
        $('#view_map').show();
        return false;
    });
    $('#view_map a').click(function() {
        $('#chart').slideUp(500);
        $('#map').slideDown(500);
        $('#view_map').hide();
        $('#view_chart').show();
        return false;
    });
    
    $('#chart').hide();
    $('#view_map').hide();
    $('#view_chart').hide();
    
    $('#clear_map a').click(nhmc.cleanup.clearMap);
};
$(document).ready(function() {
    dojo.require('dojox.gfx');
    dojo.addOnLoad(function() {
        nhmc.surface = dojox.gfx.createSurface('map', 768, 495);
        nhmc.surface.whenLoaded(nhmc.mapCenterInit);
    });
});
