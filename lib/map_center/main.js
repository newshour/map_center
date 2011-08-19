DEBUG = false; // set to false to disable debugging
old_console_log = console.log;
console.log = function() {
    if (DEBUG) {
        old_console_log.apply(this, arguments);
    }
}

var R;
// var po = org.polymaps;
// var map;
var lowerChart;
var mainChart;

var futureGarbage = [];
var activeDialogs = [];

var styleColors = {
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

var defaultAttributes = {
    'fill': styleColors['default'],
    'stroke': '#999'
};

var stateToUSPS = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}

var USPSToState = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'DC': 'District of Columbia',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
}

function zoomToState(state) {
    for (var i in usGeo) {
        console.log('Hiding ' + i);
        usGeo[i].statePath.hide();
        if (!$.isEmptyObject(usGeo[i].countyPaths)) {
            console.log('County paths detected.');
            for (j in usGeo[i].countyPaths) {
                console.log('Hiding ' + j);
                usGeo[i].countyPaths[j].hide();
            }
        }
    }
    
    console.log('state = ' + state);
    if (state != 'us_all' && state != 'us_geo' && state != 'conus') {
        state = USPSToState[state.toUpperCase()];
        console.log('state = ' + state);
        if (!$.isEmptyObject(usGeo[state].countyPaths)) {
            console.log('Existing county paths detected.');
            for (j in usGeo[state].countyPaths) {
                console.log('Showing ' + j);
                usGeo[state].countyPaths[j].show();
            }
        } else {
            console.log('No existing county paths detected.');
            for (j in usGeo[state].counties) {
                console.log('Preparing to draw ' + j + ':');
                usGeo[state].countyPaths[j] = R.path(usGeo[state].counties[j]);
                usGeo[state].countyPaths[j].attr(defaultAttributes).translate(0, -300);
                console.log('Path drawn with default attributes.');
                $(usGeo[state].countyPaths[j].node).attr({'class': j.replace(/ /g, '_')});
                $(usGeo[state].countyPaths[j].node).data({'county': j.replace(/ /g, '_')});
                // console.log('Class ' + j.replace(/ /g, '_') + ' assigned: ' + usGeo[state].countyPaths[j].node.getAttribute('class'));
            }
        }
    } else if (state == 'us_all') {
        console.log('"state" = ' + state);
        for (var i in usGeo) {
            console.log('Showing ' + i);
            usGeo[i].statePath.show();
        }
    }
};

function setStateColors(states, color) {
    if (styleColors[color]) {color = styleColors[color];}
    for (var i in states) {
        usGeo[states[i].replace(/_/g, ' ')].statePath.attr({'fill': color});
    }
}

function setCountyColors(state, counties, color) {
    if (styleColors[color]) {color = styleColors[color];}
    for (var i in counties) {
        usGeo[state.replace(/_/g, ' ')].countyPaths[counties[i].replace(/ /g, '_')].attr({'fill': color});
    }
}

function clearCharts() {
    if (lowerChart) {if (lowerChart.destroy) {lowerChart.destroy();}}
    if (mainChart) {if (mainChart.destroy) {mainChart.destroy();}}
}

function clearGarbage() {
    for (i=0; i<futureGarbage.length; i++) {futureGarbage[i].remove();}
}

function closeDialogs() {
    for (i=0; i<activeDialogs.length; i++) {activeDialogs[i].dialog('close');}
}

function clearClickHandlers() {
    $.each(usGeo, function(state, stateObj) {
        $(stateObj.statePath.node).unbind('click');
        if (!$.isEmptyObject(usGeo[state].countyPaths)) {
            $.each(stateObj.counties, function(county, countyPathData) {
                countyEscaped = county.replace(/ /g, '_');
                $(stateObj.countyPaths[countyEscaped].node).unbind('click');
            });
        }
    });
}

function clearPathColors() {
    $.each(usGeo, function(state, stateObj) {
        setStateColors([state], 'default');
        if (!$.isEmptyObject(usGeo[state].countyPaths)) {
            $.each(stateObj.counties, function(county, countyPathData) {
                setCountyColors(state, [county], 'default');
            });
        }
    });
}

function clearMap() {
    clearClickHandlers();
    clearPathColors();
    
    zoomToState($('#map_view').val());
    
    clearCharts();
    closeDialogs();
    clearGarbage();
    
    $('#view_map a').click();
    $('#view_map, #view_chart').hide();
    
    return false;
}

function renderLegend(title, items) {
    $('#legend').append([
        '<table id="main_legend"><caption>', title, 
        '</caption><tbody></tbody></table>',
    ].join(''));
    
    for (i=0; i<items.length; i++) {
        $('#main_legend tbody').append([
            '<tr><td>', items[i][0], 
            '</td><td><span class="legend_color" style="background-color: ', 
            styleColors[items[i][1]], ';">&nbsp;</span></td></tr>',
        ].join(''));
    }
    futureGarbage.push($('#legend'));
    
    $('#legend').hide();
    $('#legend').slideDown(500);
}

function logClicks(e) {
    var bodyMarginLeft = $('body').css('margin-left');
    var bodyMarginTop = $('body').css('margin-top');
    console.log(
        (
            e.pageX - R.canvas.clientLeft - 
            parseInt(bodyMarginLeft.substring(0, bodyMarginLeft.indexOf('px')))
        ) + 
        ', ' + 
        (
            e.pageY - R.canvas.clientLeft - 
            parseInt(bodyMarginTop.substring(0, bodyMarginTop.indexOf('px')))
        )
    );
}
function enableClickLog() {$(R.canvas).bind('click', logClicks);}
function disableClickLog() {$(R.canvas).unbind('click', logClicks);}

function mapCenterInit() {
    console.log('Initialization started.');
    R = Raphael('map', 768, 495);
    console.log('Map canvas created.');
    for (var i in usGeo) {
        console.log('Preparing to draw ' + i + ':');
        usGeo[i].statePath = R.path(usGeo[i].state);
        usGeo[i].statePath.attr(defaultAttributes);
        console.log('Path drawn with default attributes.');
        // $(usGeo[i].statePath.node).attr({'class': i.replace(/ /g, '_')});
        $(usGeo[i].statePath.node).data({'state': i.replace(/ /g, '_')});
        // console.log('Class ' + i.replace(/ /g, '_') + ' assigned: ' + usGeo[i].statePath.node.getAttribute('class'));
        
        usGeo[i].countyPaths = {};
        console.log('countyPaths object created.');
    }
    
    console.log('Zooming to ' + $('#map_view').val() + ':');
    zoomToState($('#map_view').val());
    $('#map_view').change(function() {zoomToState($(this).val());});
    
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
    
    $('#clear_map a').click(clearMap);
    console.log('Initialization complete.');
}
$(document).ready(function() {
    console.log('Document is ready. Waiting to initialize application.');
    // window.setTimeout(mapCenterInit, 500);
    mapCenterInit();
});
