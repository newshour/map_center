// declare namespaces
var nhmc = new Object();
nhmc.geo = new Object();
nhmc.charts = new Object();
nhmc.config = new Object();
nhmc.cleanup = new Object();
nhmc.ctrl = new Object();

var R;
var countyGeo = {};
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
    $('#loading').hide();
    for (var i in usGeo) {
        usGeo[i].statePath.hide();
        if (usGeo[i].label) {usGeo[i].label.hide();}
        if (!$.isEmptyObject(usGeo[i].countyPaths)) {
            for (j in usGeo[i].countyPaths) {
                usGeo[i].countyPaths[j].hide();
            }
        }
    }
    for (var i in countyGeo) {countyGeo[i].hide();}
    
    if (state != 'us_all' && state != 'us_geo' && state != 'us_counties' && state != 'conus') {
        state = USPSToState[state.toUpperCase()];
        if (!$.isEmptyObject(usGeo[state].countyPaths)) {
            $('#loading').show();
            
            var keys = [];
            for (var j in usGeo[state].countyPaths) {keys.push(j);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 5;
            function reloadMoreOfState() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var j=startBreak; j<endBreak; j++) {
                        usGeo[state].countyPaths[keys[j]].show();
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(reloadMoreOfState, 500 / totalSteps);
        } else {
            $('#loading').show();
            
            var keys = [];
            for (var j in usGeo[state].counties) {keys.push(j);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 5;
            function loadMoreOfState() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var j=startBreak; j<endBreak; j++) {
                        usGeo[state].countyPaths[keys[j]] = R.path(usGeo[state].counties[keys[j]]);
                        usGeo[state].countyPaths[keys[j]].attr(defaultAttributes).translate(0, -300);
                        $(usGeo[state].countyPaths[keys[j]].node).data({'county': keys[j].replace(/ /g, '_')});
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(loadMoreOfState, 500 / totalSteps);
        }
    } else if (state == 'us_all') {
        for (var i in usGeo) {
            usGeo[i].statePath.show();
            if (usGeo[i].label) {usGeo[i].label.show();}
        }
    } else if (state == 'us_counties') {
        if (!$.isEmptyObject(countyGeo)) {
            $('#loading').show();
            
            var keys = [];
            for (var i in countyGeo) {keys.push(i);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 25;
            function reloadMoreCounties() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var i=startBreak; i<endBreak; i++) {
                        countyGeo[keys[i]].show();
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(reloadMoreCounties, 5000 / totalSteps);
        } else {
            $('#loading').show();
            
            var keys = [];
            for (var i in allCounties) {keys.push(i);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 25;
            function loadMoreCounties() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var i=startBreak; i<endBreak; i++) {
                        countyGeo[keys[i]] = R.path(allCounties[keys[i]]);
                        countyGeo[keys[i]].attr(defaultAttributes);
                        $(countyGeo[keys[i]].node).data({'county_fips': keys[i]});
                    }
                    step++;
                } else {
                    window.clearInterval(intervalId);
                    $('#loading').hide();
                }
            }
            intervalId = window.setInterval(loadMoreCounties, 5000 / totalSteps);
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
    $('#loading').hide();
    
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

nhmc.mapCenterInit = function() {
    R = Raphael('map', 768, 495);
    for (var i in usGeo) {
        usGeo[i].statePath = R.path(usGeo[i].state);
        usGeo[i].statePath.attr(defaultAttributes);
        $(usGeo[i].statePath.node).data({'state': i.replace(/ /g, '_')});
        
        usGeo[i].countyPaths = {};
    }
    var arial = R.getFont('Arial');
    usGeo['District of Columbia'].label = R.print(742, 253, "DC", arial, 14).attr({'fill': '#000'});
    usGeo['Delaware'].label = R.print(742, 228, "DE", arial, 14).attr({'fill': '#000'});
    usGeo['Connecticut'].label = R.print(742, 203, "CT", arial, 14).attr({'fill': '#000'});
    usGeo['Rhode Island'].label = R.print(742, 178, "RI", arial, 14).attr({'fill': '#000'});
    
    $('#loading').hide();
    
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
};
$(document).ready(function() {
    nhmc.mapCenterInit();
});
