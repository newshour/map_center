// declare namespaces
var nhmc = new Object();
nhmc.geo = new Object();
nhmc.charts = new Object();
nhmc.config = new Object();
nhmc.cleanup = new Object();
nhmc.ctrl = new Object();

var R;
nhmc.geo.countyGeo = {};
nhmc.charts.lowerChart = undef;
nhmc.charts.mainChart = undef;

nhmc.cleanup.futureGarbage = [];
nhmc.cleanup.activeDialogs = [];

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
    'stroke': '#999'
};

nhmc.config.stateToUSPS = {
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

nhmc.config.USPSToState = {
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
    for (var i in nhmc.geo.usGeo) {
        nhmc.geo.usGeo[i].statePath.hide();
        if (nhmc.geo.usGeo[i].label) {nhmc.geo.usGeo[i].label.hide();}
        if (!$.isEmptyObject(nhmc.geo.usGeo[i].countyPaths)) {
            for (j in nhmc.geo.usGeo[i].countyPaths) {
                nhmc.geo.usGeo[i].countyPaths[j].hide();
            }
        }
    }
    for (var i in nhmc.geo.countyGeo) {nhmc.geo.countyGeo[i].hide();}
    
    if (state != 'us_all' && state != 'us_geo' && state != 'us_counties' && state != 'conus') {
        state = nhmc.config.USPSToState[state.toUpperCase()];
        if (!$.isEmptyObject(nhmc.geo.usGeo[state].countyPaths)) {
            $('#loading').show();
            
            var keys = [];
            for (var j in nhmc.geo.usGeo[state].countyPaths) {keys.push(j);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 5;
            function reloadMoreOfState() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var j=startBreak; j<endBreak; j++) {
                        nhmc.geo.usGeo[state].countyPaths[keys[j]].show();
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
            for (var j in nhmc.geo.usGeo[state].counties) {keys.push(j);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 5;
            function loadMoreOfState() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var j=startBreak; j<endBreak; j++) {
                        nhmc.geo.usGeo[state].countyPaths[keys[j]] = R.path(nhmc.geo.usGeo[state].counties[keys[j]]);
                        nhmc.geo.usGeo[state].countyPaths[keys[j]].attr(nhmc.config.defaultAttributes).translate(0, -300);
                        $(nhmc.geo.usGeo[state].countyPaths[keys[j]].node).data({'county': keys[j].replace(/ /g, '_')});
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
        for (var i in nhmc.geo.usGeo) {
            nhmc.geo.usGeo[i].statePath.show();
            if (nhmc.geo.usGeo[i].label) {nhmc.geo.usGeo[i].label.show();}
        }
    } else if (state == 'us_counties') {
        if (!$.isEmptyObject(nhmc.geo.countyGeo)) {
            $('#loading').show();
            
            var keys = [];
            for (var i in nhmc.geo.countyGeo) {keys.push(i);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 25;
            function reloadMoreCounties() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var i=startBreak; i<endBreak; i++) {
                        nhmc.geo.countyGeo[keys[i]].show();
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
            for (var i in nhmc.geo.allCounties) {keys.push(i);}
            
            var intervalId;
            var step = 0;
            var totalSteps = 25;
            function loadMoreCounties() {
                if (step < totalSteps) {
                    var startBreak = Math.floor(step * keys.length / totalSteps);
                    var endBreak = Math.floor((step + 1) * keys.length / totalSteps);
                    for (var i=startBreak; i<endBreak; i++) {
                        nhmc.geo.countyGeo[keys[i]] = R.path(nhmc.geo.allCounties[keys[i]]);
                        nhmc.geo.countyGeo[keys[i]].attr(nhmc.config.defaultAttributes);
                        $(nhmc.geo.countyGeo[keys[i]].node).data({'county_fips': keys[i]});
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
    if (nhmc.config.styleColors[color]) {color = nhmc.config.styleColors[color];}
    for (var i in states) {
        nhmc.geo.usGeo[states[i].replace(/_/g, ' ')].statePath.attr({'fill': color});
    }
}

function setCountyColors(state, counties, color) {
    if (nhmc.config.styleColors[color]) {color = nhmc.config.styleColors[color];}
    for (var i in counties) {
        nhmc.geo.usGeo[state.replace(/_/g, ' ')].countyPaths[counties[i].replace(/ /g, '_')].attr({'fill': color});
    }
}

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
    $.each(nhmc.geo.usGeo, function(state, stateObj) {
        $(stateObj.statePath.node).unbind('click');
        if (!$.isEmptyObject(nhmc.geo.usGeo[state].countyPaths)) {
            $.each(stateObj.counties, function(county, countyPathData) {
                countyEscaped = county.replace(/ /g, '_');
                $(stateObj.countyPaths[countyEscaped].node).unbind('click');
            });
        }
    });
};

nhmc.cleanup.clearPathColors = function() {
    $.each(nhmc.geo.usGeo, function(state, stateObj) {
        setStateColors([state], 'default');
        if (!$.isEmptyObject(nhmc.geo.usGeo[state].countyPaths)) {
            $.each(stateObj.counties, function(county, countyPathData) {
                setCountyColors(state, [county], 'default');
            });
        }
    });
};

nhmc.cleanup.clearMap = function() {
    $('#loading').hide();
    
    nhmc.cleanup.clearClickHandlers();
    nhmc.cleanup.clearPathColors();
    
    zoomToState($('#map_view').val());
    
    nhmc.cleanup.clearCharts();
    nhmc.cleanup.closeDialogs();
    nhmc.cleanup.clearGarbage();
    
    $('#view_map a').click();
    $('#view_map, #view_chart').hide();
    
    return false;
};

function renderLegend(title, items) {
    $('#legend').append([
        '<table id="main_legend"><caption>', title, 
        '</caption><tbody></tbody></table>',
    ].join(''));
    
    for (i=0; i<items.length; i++) {
        $('#main_legend tbody').append([
            '<tr><td>', items[i][0], 
            '</td><td><span class="legend_color" style="background-color: ', 
            nhmc.config.styleColors[items[i][1]], ';">&nbsp;</span></td></tr>',
        ].join(''));
    }
    nhmc.cleanup.futureGarbage.push($('#legend'));
    
    $('#legend').hide();
    $('#legend').slideDown(500);
}

nhmc.mapCenterInit = function() {
    R = Raphael('map', 768, 495);
    for (var i in nhmc.geo.usGeo) {
        nhmc.geo.usGeo[i].statePath = R.path(nhmc.geo.usGeo[i].state);
        nhmc.geo.usGeo[i].statePath.attr(nhmc.config.defaultAttributes);
        $(nhmc.geo.usGeo[i].statePath.node).data({'state': i.replace(/ /g, '_')});
        
        nhmc.geo.usGeo[i].countyPaths = {};
    }
    var arial = R.getFont('Arial');
    nhmc.geo.usGeo['District of Columbia'].label = R.print(742, 253, "DC", arial, 14).attr({'fill': '#000'});
    nhmc.geo.usGeo['Delaware'].label = R.print(742, 228, "DE", arial, 14).attr({'fill': '#000'});
    nhmc.geo.usGeo['Connecticut'].label = R.print(742, 203, "CT", arial, 14).attr({'fill': '#000'});
    nhmc.geo.usGeo['Rhode Island'].label = R.print(742, 178, "RI", arial, 14).attr({'fill': '#000'});
    
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
    
    $('#clear_map a').click(nhmc.cleanup.clearMap);
};
$(document).ready(function() {
    nhmc.mapCenterInit();
});
