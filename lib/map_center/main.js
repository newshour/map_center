// Add Object.keys support for length checking in associative arrays
if(!Object.keys) Object.keys = function(o){
    if (o !== Object(o))
        throw new TypeError('Object.keys called on non-object');
    var ret=[],p;
    for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
    return ret;
}
// Add Array.indexOf support for checking for presence of items
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

// declare namespaces
namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.geo.usGeo");
namespace("nhmc.charts");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");
namespace("nhmc.tooltips");

nhmc.R = null;
nhmc.surface = null;
nhmc.geo.countyGeo = {};
nhmc.ctrl.scaleFactors = {};
nhmc.charts.lowerChart = null;
nhmc.charts.mainChart = null;

nhmc.cleanup.futureGarbage = [];
nhmc.cleanup.activeDialogs = [];
nhmc.cleanup.clickHandlerTokens = [];
nhmc.cleanup.currentlyDrawing = false;

nhmc.mapSpecificInit = function() {};

nhmc.config.defaultDimensions = {
    // These are tied to the original drawing dimensions. If you want to change
    // the size of the map, do it in main.css and not here. It's okay if they 
    // disagree as long as they're proportional.
    height: 486,
    width: 768
};
nhmc.config.countySteps = {
    national: 15,
    state: 5
};
nhmc.config.styleColors = {
    'default': '#f7f5f5',
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
    'stroke': '#b2b4b3'
};
nhmc.config.cityLabels = {
    backgroundOpacity: 0.75,
    backgroundPadding: [2, -2, 5, 5],  // top, right (text end), bottom, left (circle end)
    hideBackgrounds: true,
    labelNudge: -3,  // pixels to move the text label (positive is down)
    labelOpacity: 0.75,
    labelSize: 18,  // font size of city label text in pixels
    markerOpacity: 0.75,
    markerRadius: 4
};

nhmc.ctrl.addCity = function(cityName, cityData) {
    // Figure out where we're putting this city's circle
    //  (marker) and how big it should be.
    var cityMarkerData = {
        cx: cityData[0][0],
        cy: cityData[0][1],
        r: nhmc.config.cityLabels.markerRadius
    };
    // Go ahead and draw that circle.
    var cityMarker = nhmc.surface.createCircle(cityMarkerData)
        .setFill({
            r: 0,
            g: 0,
            b: 0,
            a: nhmc.config.cityLabels.markerOpacity
        });
    
    // Add the city's name.
    var cityLabelData = {
        x: cityMarkerData.cx + (2 * cityMarkerData.r),
        y: cityMarkerData.cy + (nhmc.config.cityLabels.labelSize / 2) + nhmc.config.cityLabels.labelNudge,
        text: cityName.toUpperCase()
    };
    var cityLabel = nhmc.surface.createText(cityLabelData).setFont({
        family: 'Arial',
        size: nhmc.config.cityLabels.labelSize + 'px',
        weight: 'bold'
    }).setFill({
        r: 0,
        g: 0,
        b: 0,
        a: nhmc.config.cityLabels.labelOpacity
    });
    cityLabelData.width = cityLabel.getTextWidth();
    
    // Is the label going to go past the right of the map?
    if ((cityLabelData.x + cityLabelData.width + nhmc.config.cityLabels.backgroundPadding[1]) > nhmc.config.defaultDimensions.width) {
        // If so, move it to the left of the marker instead.
        cityLabelData.x = cityMarkerData.cx - (2 * cityMarkerData.r);
        cityLabelData.align = 'end';
        cityLabel.setShape(cityLabelData);
    }
    
    if (!nhmc.config.cityLabels.hideBackgrounds) {
        // Figure out where the background behind these will go.
        var cityBGData = {
            x: cityMarkerData.cx - cityMarkerData.r - nhmc.config.cityLabels.backgroundPadding[3],
            y: cityLabelData.y - nhmc.config.cityLabels.labelSize - nhmc.config.cityLabels.backgroundPadding[0],
            width: cityLabelData.width + (2 * cityMarkerData.r) + (2 * cityMarkerData.r) + nhmc.config.cityLabels.backgroundPadding[1] + nhmc.config.cityLabels.backgroundPadding[3],
            height: nhmc.config.cityLabels.labelSize + nhmc.config.cityLabels.backgroundPadding[0] + nhmc.config.cityLabels.backgroundPadding[2]
        };
        if (cityLabelData.align == 'end') {
            cityBGData.x = cityLabelData.x - cityLabelData.width - nhmc.config.cityLabels.backgroundPadding[1];
        }
        // Go ahead and draw that background,
        var cityBackground = nhmc.surface.createRect(cityBGData)
            .setFill({
                r: 255,
                g: 255,
                b: 255,
                a: nhmc.config.cityLabels.backgroundOpacity
            });
    }
    
    // Put everything in one group for easy manipulation,
    var cityGroup = nhmc.surface.createGroup()
        .add(cityMarker)
        .add(cityLabel)
        .moveToFront();
    if (!nhmc.config.cityLabels.hideBackgrounds) {cityGroup.add(cityBackground);}
    // and arrange everything correctly front-to-back.
    cityMarker.moveToFront();
    cityLabel.moveToFront();
    
    return cityGroup;
};
nhmc.ctrl.zoomToState = function(state) {
    nhmc.cleanup.currentlyDrawing = true;
    $('#loading').hide();
    
    // Make note of whether we're using tooltips
    var tooltipsActive = false;
    if (nhmc.tooltips.hoverHandlerTokens.length > 0) {tooltipsActive = true;}
    
    // Clear map and legend content
    nhmc.cleanup.clearMap();
    // Remove existing paths from surface
    for (var i in nhmc.geo.usGeo) {
        if (typeof(nhmc.geo.usGeo[i].statePath) != 'undefined') {
            nhmc.surface.remove(nhmc.geo.usGeo[i].statePath);
        }
        if (nhmc.geo.usGeo[i].label) {nhmc.surface.remove(nhmc.geo.usGeo[i].label);}
        if (!$.isEmptyObject(nhmc.geo.usGeo[i].countyPaths)) {
            for (j in nhmc.geo.usGeo[i].countyPaths) {
                nhmc.surface.remove(nhmc.geo.usGeo[i].countyPaths[j]);
            }
        }
        if (!$.isEmptyObject(nhmc.geo.usGeo[i].cityPaths)) {
            for (j in nhmc.geo.usGeo[i].cityPaths) {
                nhmc.surface.remove(nhmc.geo.usGeo[i].cityPaths[j]);
            }
        }
    }
    for (var i in nhmc.geo.countyGeo) {nhmc.surface.remove(nhmc.geo.countyGeo[i]);}
    
    // Get ready for scaling just in case that's necessary
    var newScaleFactor = ($('#map').width() / nhmc.config.defaultDimensions.width);
    var scalingNecessary = newScaleFactor != 1;
    var scaleMatrix = dojox.gfx.matrix.scaleAt(newScaleFactor, newScaleFactor, 0, 0);
    nhmc.ctrl.scaleFactors[state] = newScaleFactor;
    
    function renderStateMap() {
        if (Object.keys(nhmc.geo.usGeo[state].countyPaths).length == Object.keys(nhmc.geo.usGeo[state].counties).length) {
            
            var keys = [];
            for (var j in nhmc.geo.usGeo[state].countyPaths) {keys.push(j);}
            
            var intervalId;
            var step = 0;
            var totalSteps = nhmc.config.countySteps.state;
            function reloadMoreOfState() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    step++;
                    for (var j=startBreak; j<endBreak; j++) {
                        nhmc.surface.add(nhmc.geo.usGeo[state].countyPaths[keys[j]]);
                        if (scalingNecessary) {
                            nhmc.geo.usGeo[state].countyPaths[keys[j]].setTransform(scaleMatrix);
                        }
                    }
                } else {
                    window.clearInterval(intervalId);
                    
                    for (var cityName in nhmc.geo.usGeo[state].cityPaths) {
                        nhmc.surface.add(nhmc.geo.usGeo[state].cityPaths[cityName]);
                        if (scalingNecessary) {
                            nhmc.geo.usGeo[state].cityPaths[cityName].setTransform(scaleMatrix);
                        }
                    }
                    
                    nhmc.cleanup.currentlyDrawing = false;
                    $('#loading').hide();
                    if (tooltipsActive) {nhmc.tooltips.init();}
                }
            }
            intervalId = window.setInterval(reloadMoreOfState, 1);
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
                    step++;
                    for (var j=startBreak; j<endBreak; j++) {
                        nhmc.geo.usGeo[state].countyPaths[keys[j]] = nhmc.surface.createPath(nhmc.geo.usGeo[state].counties[keys[j]]);
                        nhmc.geo.usGeo[state].countyPaths[keys[j]].setFill(nhmc.config.defaultAttributes.fill).setStroke(nhmc.config.defaultAttributes.stroke);
                        nhmc.geo.usGeo[state].countyPaths[keys[j]].nhmcData = {'county': keys[j]};
                        if (scalingNecessary) {
                            nhmc.geo.usGeo[state].countyPaths[keys[j]].setTransform(scaleMatrix);
                        }
                    }
                } else {
                    window.clearInterval(intervalId);
                    
                    for (var cityName in nhmc.geo.usGeo[state].cities) {
                        nhmc.geo.usGeo[state].cityPaths[cityName] = nhmc.ctrl.addCity(cityName, nhmc.geo.usGeo[state].cities[cityName]);
                        if (scalingNecessary) {
                            nhmc.geo.usGeo[state].cityPaths[cityName].setTransform(scaleMatrix);
                        }
                    }
                    
                    nhmc.cleanup.currentlyDrawing = false;
                    $('#loading').hide();
                    if (tooltipsActive) {nhmc.tooltips.init();}
                }
            }
            intervalId = window.setInterval(loadMoreOfState, 1);
        }
    }
    
    // Handle maps as appropriate
    if (state != 'us_all' && state != 'us_counties') {
        $('#loading').show();
        state = nhmc.config.USPSToState[state.toUpperCase()];
        if (typeof(nhmc.geo.usGeo[state]) != 'undefined') {
            renderStateMap();
        } else {
            $.ajax({
                dataType: 'jsonp',
                jsonpCallback: 'loadCounties',
                success: function(data) {
                    nhmc.geo.usGeo[state] = data;
                    nhmc.geo.usGeo[state].countyPaths = {};
                    nhmc.geo.usGeo[state].cityPaths = {};
                    renderStateMap();
                },
                url: 'http://s3.amazonaws.com/newshourroot/nhmc_geo_json/' + nhmc.config.stateToUSPS[state].toLowerCase() + '.json'
            });
        }
    } else if (state == 'us_all') {
        for (var i in nhmc.geo.usGeo) {
            nhmc.surface.add(nhmc.geo.usGeo[i].statePath);
            if (nhmc.geo.usGeo[i].label) {nhmc.surface.add(nhmc.geo.usGeo[i].label);}
            if (scalingNecessary) {
                nhmc.geo.usGeo[i].statePath.setTransform(scaleMatrix);
                if (nhmc.geo.usGeo[i].label) {
                    nhmc.geo.usGeo[i].label.setTransform(scaleMatrix);
                }
            }
            if (tooltipsActive) {nhmc.tooltips.init();}
        }
        nhmc.cleanup.currentlyDrawing = false;
    } else if (state == 'us_counties') {
        if (Object.keys(nhmc.geo.countyGeo).length == Object.keys(nhmc.geo.allCounties).length) {
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
                    step++;
                    for (var i=startBreak; i<endBreak; i++) {
                        nhmc.surface.add(countyGeo[keys[i]]);
                        if (scalingNecessary) {
                            countyGeo[keys[i]].setTransform(scaleMatrix);
                        }
                    }
                } else {
                    window.clearInterval(intervalId);
                    nhmc.cleanup.currentlyDrawing = false;
                    $('#loading').hide();
                    if (tooltipsActive) {nhmc.tooltips.init();}
                }
            }
            intervalId = window.setInterval(reloadMoreCounties, 1);
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
                    step++;
                    for (var i=startBreak; i<endBreak; i++) {
                        countyGeo[keys[i]] = surface.createPath(allCounties[keys[i]]);
                        countyGeo[keys[i]].setFill(defaultAttributes.fill).setStroke(defaultAttributes.stroke);
                        countyGeo[keys[i]].nhmcData = {'county_fips': keys[i]};
                        if (scalingNecessary) {
                            countyGeo[keys[i]].setTransform(scaleMatrix);
                        }
                    }
                } else {
                    window.clearInterval(intervalId);
                    nhmc.cleanup.currentlyDrawing = false;
                    $('#loading').hide();
                    if (tooltipsActive) {nhmc.tooltips.init();}
                }
            }
            intervalId = window.setInterval(loadMoreCounties, 1);
        }
    }
};
nhmc.ctrl.scaleStateMap = function(state, factor) {
    $('#loading').hide();
    
    // Find out how much we're currently scaled, and calculate the matrix to
    // resize us the desired amount from the top left corner. Two useful 
    // optimizations here: First, we don't have to scale anything at all if 
    // the current factor is the same as the desired one; second, we don't 
    // have to recompute this transformation matrix for every visible path.
    var currentScaleFactor = nhmc.ctrl.scaleFactors[state];
    var scaleMatrix = dojox.gfx.matrix.scaleAt(factor, factor, 0, 0);
    
    // Store new scale factor for future reference.
    nhmc.ctrl.scaleFactors[state] = factor;
    
    if (state != 'us_all' && state != 'us_counties') {
        state = nhmc.config.USPSToState[state.toUpperCase()];
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
                step++;
                for (var j=startBreak; j<endBreak; j++) {
                    nhmc.geo.usGeo[state].countyPaths[keys[j]].setTransform(scaleMatrix);
                }
            } else {
                window.clearInterval(intervalId);
                $('#loading').hide();
            }
        }
        intervalId = window.setInterval(reloadMoreOfState, 1);
    } else if (state == 'us_all') {
        for (var i in nhmc.geo.usGeo) {
            nhmc.geo.usGeo[i].statePath.setTransform(scaleMatrix);
            if (nhmc.geo.usGeo[i].label) {nhmc.geo.usGeo[i].label.setTransform(scaleMatrix);}
        }
    } else if (state == 'us_counties') {
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
                step++;
                for (var i=startBreak; i<endBreak; i++) {
                    countyGeo[keys[i]].setTransform(scaleMatrix);
                }
            } else {
                window.clearInterval(intervalId);
                $('#loading').hide();
            }
        }
        intervalId = window.setInterval(reloadMoreCounties, 1);
    }
};
nhmc.ctrl.scaleSurface = function(factor) {
    var initHeight = nhmc.config.defaultDimensions.height;
    var initWidth = nhmc.config.defaultDimensions.width;
    nhmc.surface.setDimensions(initWidth * factor, initHeight * factor);
    $('#map').width(initWidth * factor).height(initHeight * factor);
};
nhmc.ctrl.scaleCurrentMap = function(factor) {
    nhmc.ctrl.scaleStateMap($('#map_view').val(), factor);
    nhmc.ctrl.scaleSurface(factor);
};
nhmc.ctrl.setStateColors = function(states, color) {
    if (nhmc.config.styleColors[color]) {color = nhmc.config.styleColors[color];}
    for (var i in states) {
        nhmc.geo.usGeo[states[i]].statePath.setFill(color);
    }
};
nhmc.ctrl.setCountyColors = function(state, counties, color) {
    if (nhmc.config.styleColors[color]) {color = nhmc.config.styleColors[color];}
    var mapView = $('#map_view').val();
    if (mapView == 'us_counties') {
        for (var i in counties) {
            nhmc.geo.countyGeo[nhmc.config.countyToFIPS[state][counties[i]]].setFill(color);
        }
    } else {
        for (var i in counties) {
            nhmc.geo.usGeo[state].countyPaths[counties[i]].setFill(color);
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
        if (stateObj.statePath) {
            stateObj.statePath.setFill(nhmc.config.styleColors['default']);
        }
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
    
    nhmc.tooltips.destroy();
    nhmc.tooltips.unbindHover();
    
    $('#view_map a').click();
    $('#view_map, #view_chart').hide();
    
    return false;
};

nhmc.tooltips.xOffset = 10;
nhmc.tooltips.yOffset = 20;
nhmc.tooltips.hoverHandlerTokens = [];
nhmc.tooltips.render = function() {
    // NOTE: Override this function in modules that need it.
    //  Access information about the target area with this.nhmcData.
    $('#tooltip').remove();
    $('body').append('<div id="tooltip">' + 
    '<h3>' + '</h3>' + 
    '<p>' + '</p>' + 
    '</div>');
};
nhmc.tooltips.position = function(e) {
    var tooltip = $('#tooltip');
    
    if (e.pageX + tooltip.width() + nhmc.tooltips.yOffset <= $('body').width()) {
        tooltip.css('left', (e.pageX + nhmc.tooltips.yOffset) + 'px');
    } else {
        tooltip.css('left', (e.pageX - nhmc.tooltips.yOffset - tooltip.width()) + 'px');
    }
    if (e.pageY + tooltip.height() - nhmc.tooltips.xOffset <= $('body').height()) {
        tooltip.css('top', (e.pageY - nhmc.tooltips.xOffset) + 'px');
    } else {
        tooltip.css('top', (e.pageY - nhmc.tooltips.xOffset - tooltip.height()) + 'px');
    }
};
nhmc.tooltips.addClose = function() {
    $('<a href="#" id="tooltip_close" class="ui-icon ui-icon-closethick">Close</a>').prependTo('#tooltip').click(function() {
        nhmc.tooltips.destroy();
        nhmc.tooltips.bindHover();
        return false;
    });
};
nhmc.tooltips.destroy = function() {
    $('#tooltip').remove();
};
nhmc.tooltips.bindHover = function() {
    if (Modernizr && Modernizr.touch) {var touchCapable = true;}
    else {var touchCapable = false;}
    
    for (var i in nhmc.surface.children) {
        var child = nhmc.surface.children[i];
        
        if (typeof(child.getShape) == 'undefined' || child.getShape().type != "path") {continue;}
        
        if (touchCapable) {
            var renderToken = child.connect('onmouseenter', child, nhmc.tooltips.render);
            nhmc.tooltips.hoverHandlerTokens.push(renderToken);
            
            var positionToken = child.connect('onmouseenter', child, nhmc.tooltips.position);
            nhmc.tooltips.hoverHandlerTokens.push(positionToken);
            
            var unbindToken = child.connect('onmouseenter', child, nhmc.tooltips.unbindHover);
            nhmc.tooltips.hoverHandlerTokens.push(unbindToken);
        } else {
            var renderToken = child.connect('onmouseenter', child, nhmc.tooltips.render);
            nhmc.tooltips.hoverHandlerTokens.push(renderToken);
            
            var initPositionToken = child.connect('onmouseenter', nhmc.tooltips.position);
            nhmc.tooltips.hoverHandlerTokens.push(initPositionToken);
            
            var destroyToken = child.connect('onmouseleave', nhmc.tooltips.destroy);
            nhmc.tooltips.hoverHandlerTokens.push(destroyToken);
            
            var positionToken = child.connect('onmousemove', nhmc.tooltips.position);
            nhmc.tooltips.hoverHandlerTokens.push(positionToken);
        }
    }
};
nhmc.tooltips.unbindHover = function() {
    for (var i = 0, length = nhmc.tooltips.hoverHandlerTokens.length; i < length; i++) {
        dojo.disconnect(nhmc.tooltips.hoverHandlerTokens[i]);
    }
};
nhmc.tooltips.init = function() {
    nhmc.tooltips.bindHover();
    // function manageTooltips(e) {
    //     nhmc.tooltips.render();
    //     nhmc.tooltips.unbindHover();
    //     nhmc.tooltips.addClose();
    //     nhmc.tooltips.position(e);
    // }
    // for (var i in nhmc.surface.children) {
    //     var child = nhmc.surface.children[i];
    // 
    //     if (typeof(child.getShape) == 'undefined' || child.getShape().type != "path") {continue;}
    //     
    //     var manageToken = child.connect('onclick', null, manageTooltips);
    //     nhmc.cleanup.clickHandlerTokens.push(manageToken);
    // }
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
    // Pick up any configuration overrides from the map page's <head>.
    if (typeof(nhmc_config) != 'undefined') {
        $.extend(true, nhmc.config, nhmc_config);
    }
    
    nhmc.cleanup.currentlyDrawing = true;
    for (var i in nhmc.geo.usGeo) {
        nhmc.geo.usGeo[i].statePath = nhmc.surface.createPath(nhmc.geo.usGeo[i].state);
        nhmc.geo.usGeo[i].statePath.setFill(nhmc.config.defaultAttributes.fill);
        nhmc.geo.usGeo[i].statePath.setStroke(nhmc.config.defaultAttributes.stroke);
        nhmc.geo.usGeo[i].statePath.nhmcData = {'state': i};
        
        nhmc.geo.usGeo[i].countyPaths = {};
        nhmc.geo.usGeo[i].cityPaths = {};
        
        if (i == 'District of Columbia') {
            nhmc.geo.usGeo['District of Columbia'].label = nhmc.surface.createText({x: 742, y: 258, text: "DC"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');
        } else if (i == 'Delaware') {
            nhmc.geo.usGeo['Delaware'].label = nhmc.surface.createText({x: 742, y: 233, text: "DE"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');
        } else if (i == 'Connecticut') {
            nhmc.geo.usGeo['Connecticut'].label = nhmc.surface.createText({x: 742, y: 208, text: "CT"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');
        } else if (i == 'Rhode Island') {
            nhmc.geo.usGeo['Rhode Island'].label = nhmc.surface.createText({x: 742, y: 183, text: "RI"}).setFont({family: 'Arial', size: '10pt'}).setFill('#000');
        }
    }
    
    for (var i in nhmc.config.USPSToState) {
        nhmc.ctrl.scaleFactors[i.toLowerCase()] = 1;
    }
    nhmc.ctrl.scaleFactors['us_all'] = 1;
    nhmc.ctrl.scaleFactors['us_counties'] = 1;
    
    nhmc.cleanup.currentlyDrawing = false;
    $('#loading').hide();
    
    $('#map_view').change(function() {
        var intervalId;
        
        function pollDrawingFlag() {
            if (!nhmc.cleanup.currentlyDrawing) {
                window.clearInterval(intervalId);
                nhmc.ctrl.zoomToState($('#map_view').val());
            }
        }
        
        intervalId = window.setInterval(pollDrawingFlag, 50);
    }).change();
    
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
    
    $('#map').resize(function() {
        nhmc.ctrl.scaleCurrentMap($(this).width() / nhmc.config.defaultDimensions.width);
    });
    
    $('#clear_map a').click(nhmc.cleanup.clearMap);
    
    $('#nav-main').roto();
    $('#nav_toggle a').click(function() {
        var currentlyOpen = $('#nav_toggle').hasClass('open');
        if (currentlyOpen) {
            $('#nav_outer').slideUp(500, function() {
                $('#nav_toggle').removeClass('open').addClass('closed');
                $('#nav_toggle a').text('More Maps');
            });
        } else {
            $('#nav_outer').slideDown(500, function() {
                $('#nav_toggle').removeClass('closed').addClass('open');
                $('#nav_toggle a').text('Close');
            });
        }
        return false;
    }).click();  // Bind the action and immediately trigger it
    $('.nav_option a').click(function() {
        // avoid iOS switch to Safari from app view
        parent.location = $(this).attr('href');
        return false;
    });
    
    $('#view_tab_more_toggle, #view_tab_options_more_toggle').click(function() {
        $(this).siblings('ul').slideToggle(500);
        return false;
    });
    $('.view_tab_option').click(function() {
        // Show the correct active tab
        $('.view_tab_active').removeClass('view_tab_active');
        if ($(this).parent().hasClass('view_tab')) {
            $(this).parent().addClass('view_tab_active');
        } else {
            $('.view_tab_more').addClass('view_tab_active');
            $('.view_tab li').show();
            $(this).parent().parent().parent().children('.view_tab_option').text($(this).text());
            $(this).parent().hide();
        }
        $('.view_tab ul').slideUp(500);
        return false;
    });
    
    // Ready? Let's do this.
    var intervalId;
    
    function pollDrawingFlag() {
        if (!nhmc.cleanup.currentlyDrawing) {
            window.clearInterval(intervalId);
            nhmc.mapSpecificInit();
        }
    }
    
    intervalId = window.setInterval(pollDrawingFlag, 50);
};
$(document).ready(function() {
    dojo.require('dojox.gfx');
    dojo.addOnLoad(function() {
        nhmc.surface = dojox.gfx.createSurface('map');
        nhmc.surface.whenLoaded(nhmc.mapCenterInit);
    });
});
