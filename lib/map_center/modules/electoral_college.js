var electoralVotes = {
    '2012': {
        "Alabama": 9,
        "Alaska": 3,
        "Arizona": 11,
        "Arkansas": 6,
        "California": 55,
        "Colorado": 9,
        "Connecticut": 7,
        "Delaware": 3,
        "District of Columbia": 3,
        "Florida": 29,
        "Georgia": 16,
        "Hawaii": 4,
        "Idaho": 4,
        "Illinois": 20,
        "Indiana": 11,
        "Iowa": 6,
        "Kansas": 6,
        "Kentucky": 8,
        "Louisiana": 8,
        "Maine": 4,
        "Maryland": 10,
        "Massachusetts": 11,
        "Michigan": 16,
        "Minnesota": 10,
        "Mississippi": 6,
        "Missouri": 10,
        "Montana": 3,
        "Nebraska": 5,
        "Nevada": 6,
        "New Hampshire": 4,
        "New Jersey": 14,
        "New Mexico": 5,
        "New York": 29,
        "North Carolina": 15,
        "North Dakota": 3,
        "Ohio": 18,
        "Oklahoma": 7,
        "Oregon": 7,
        "Pennsylvania": 20,
        "Rhode Island": 4,
        "South Carolina": 9,
        "South Dakota": 3,
        "Tennessee": 11,
        "Texas": 38,
        "Utah": 6,
        "Vermont": 3,
        "Virginia": 13,
        "Washington": 12,
        "West Virginia": 5,
        "Wisconsin": 10,
        "Wyoming": 3
    }
};

$(document).ready(function() {
    $('#displays').append('<li id="electoral_college"><a href="#">Electoral College</a></li>');
    $('#electoral_college a').click(function() {
        var republican = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Georgia', 'Idaho', 'Kansas', 'Kentucky', 'Louisiana', 'Mississippi', 'Missouri', 'Montana', 'North Dakota', 'Oklahoma', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'West Virginia', 'Wyoming'];
        var democratic = ['California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Hawaii', 'Illinois', 'Indiana', 'Iowa', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'Ohio', 'Oregon', 'Pennsylvania', 'Rhode Island', 'Vermont', 'Virginia', 'Washington', 'Wisconsin'];
        setStateColors(republican, 'red');
        setStateColors(democratic, 'blue');
        
        var republicanVotes = 0;
        var democraticVotes = 0;
        
        for (i=0; i<republican.length; i++) {
            republicanVotes += electoralVotes['2012'][republican[i]];
        }
        for (i=0; i<democratic.length; i++) {
            democraticVotes += electoralVotes['2012'][democratic[i]];
        }
        
        setStateColors(['Nebraska'], 'purple');
        republicanVotes += 4;
        democraticVotes += 1;
        var nebraskaVotes = {
            republican: 4,
            democratic: 1,
            thirdParty: 0
        };
        
        setStateColors(['Maine'], 'blue');
        democraticVotes += 4;
        var maineVotes = {
            republican: 0,
            democratic: 4,
            thirdParty: 0
        };
        
        $([
            '<div id="nebraska_electoral" title="Choose Nebraska\'s votes">',
                '<p>',
                '<label for="nebraska_popular">Popular vote (worth 3):</label>',
                '<select id="nebraska_popular">',
                    '<option value="r" selected="selected">Republican</option>',
                    '<option value="d">Democratic</option>',
                    '<option value="t">Third party</option>',
                '</select>',
                '</p>',
                '<p>',
                '<label for="nebraska_4">Fourth vote:</label>',
                '<select id="nebraska_4">',
                    '<option value="r" selected="selected">Republican</option>',
                    '<option value="d">Democratic</option>',
                    '<option value="t">Third party</option>',
                '</select>',
                '</p>',
                '<p>',
                '<label for="nebraska_5">Fifth vote:</label>',
                '<select id="nebraska_5">',
                    '<option value="r">Republican</option>',
                    '<option value="d" selected="selected">Democratic</option>',
                    '<option value="t">Third party</option>',
                '</select>',
                '</p>',
            '</div>'
        ].join('')).dialog({
            autoOpen: false,
            beforeClose: function(e, ui) {
                $('#nebraska_popular').unbind('change');
                $('#nebraska_4').unbind('change');
                $('#nebraska_5').unbind('change');
            },
            height: 212,
            position: [200, 141],
            resizable: false,
            width: 400
        });
        futureGarbage.push($('#nebraska_electoral'));
        activeDialogs.push($('#nebraska_electoral'));
        $([
            '<div id="maine_electoral" title="Choose Maine\'s votes">',
                '<p>',
                '<label for="maine_popular">Popular vote (worth 3):</label>',
                '<select id="maine_popular">',
                    '<option value="r">Republican</option>',
                    '<option value="d" selected="selected">Democratic</option>',
                    '<option value="t">Third party</option>',
                '</select>',
                '</p>',
                '<p>',
                '<label for="maine_4">Fourth vote:</label>',
                '<select id="maine_4">',
                    '<option value="r">Republican</option>',
                    '<option value="d" selected="selected">Democratic</option>',
                    '<option value="t">Third party</option>',
                '</select>',
                '</p>',
            '</div>'
        ].join('')).dialog({
            autoOpen: false,
            beforeClose: function(e, ui) {
                $('#maine_popular').unbind('change');
                $('#maine_4').unbind('change');
            },
            height: 170,
            position: [200, 141],
            resizable: false,
            width: 400
        });
        futureGarbage.push($('#maine_electoral'));
        activeDialogs.push($('#maine_electoral'));
        
        lowerChart = new Highcharts.Chart({
            chart: {
                renderTo: 'lower_chart',
                defaultSeriesType: 'bar'
            },
            credits: {enabled: false},
            title: {text: 'Electoral votes'},
            xAxis: {
                categories: [' '],
                lineWidth: 0
            },
            yAxis: {
                endOnTick: false,
                max: 538,
                min: 0,
                tickInterval: 270,
                title: {text: ''}
            },
            series: [{
                name: 'Democratic',
                data: [{
                    color: styleColors['blue'],
                    y: democraticVotes
                }]
            }, {
                name: 'Third party',
                data: [{
                    color: styleColors['yellow'],
                    y: 0
                }]
            }, {
                name: 'Republican',
                data: [{
                    color: styleColors['red'],
                    y: republicanVotes
                }]
            }],
            legend: {enabled: false},
            plotOptions: {series: {stacking: 'normal'}},
            tooltip: {enabled: false}
        });
        
        for (var i in usGeo) {
            var stateClass = i.replace(/ /g, '_');
            switch (stateClass) {
                case 'Nebraska':
                    function nebraskaHandler(e) {
                        $('#nebraska_electoral').dialog('open');
                        
                        function updateNebraska() {
                            var oldBlue = lowerChart.series[0].data[0].y;
                            var oldRed = lowerChart.series[2].data[0].y;
                            var oldYellow = lowerChart.series[1].data[0].y;
                            
                            var newVotes = {
                                republican: 0,
                                democratic: 0,
                                thirdParty: 0
                            };
                            
                            // figure out new votes
                            switch ($('#nebraska_popular').val()) {
                                case 'r':
                                    newVotes.republican += 3;
                                    break;
                                case 'd':
                                    newVotes.democratic += 3;
                                    break;
                                case 't':  // fall through
                                default:
                                    newVotes.thirdParty += 3;
                                    break;
                            }
                            switch ($('#nebraska_4').val()) {
                                case 'r':
                                    newVotes.republican += 1;
                                    break;
                                case 'd':
                                    newVotes.democratic += 1;
                                    break;
                                case 't':  // fall through
                                default:
                                    newVotes.thirdParty += 1;
                                    break;
                            }
                            switch ($('#nebraska_5').val()) {
                                case 'r':
                                    newVotes.republican += 1;
                                    break;
                                case 'd':
                                    newVotes.democratic += 1;
                                    break;
                                case 't':  // fall through
                                default:
                                    newVotes.thirdParty += 1;
                                    break;
                            }
                            
                            lowerChart.series[0].setData([{
                                color: styleColors['blue'],
                                y: oldBlue - nebraskaVotes.democratic + newVotes.democratic
                            }]);
                            lowerChart.series[1].setData([{
                                color: styleColors['yellow'],
                                y: oldYellow - nebraskaVotes.thirdParty + newVotes.thirdParty
                            }]);
                            lowerChart.series[2].setData([{
                                color: styleColors['red'],
                                y: oldRed - nebraskaVotes.republican + newVotes.republican
                            }]);
                            nebraskaVotes = newVotes;
                            
                            switch ($('#nebraska_popular').val() + $('#nebraska_4').val() + $('#nebraska_5').val()) {
                                case 'rrr':
                                    setStateColors(['Nebraska'], 'red');
                                    break;
                                case 'ddd':
                                    setStateColors(['Nebraska'], 'blue');
                                    break;
                                case 'ttt':
                                    setStateColors(['Nebraska'], 'yellow');
                                    break;
                                case 'rrd':
                                case 'rdd':
                                case 'drr':
                                case 'drd':
                                case 'rdr':
                                case 'ddr':
                                    setStateColors(['Nebraska'], 'purple');
                                    break;
                                case 'rrt':
                                case 'rtr':
                                case 'rtt':
                                case 'trr':
                                case 'trt':
                                case 'ttr':
                                    setStateColors(['Nebraska'], 'orange');
                                    break;
                                case 'ddt':
                                case 'dtd':
                                case 'dtt':
                                case 'tdd':
                                case 'tdt':
                                case 'ttd':
                                    setStateColors(['Nebraska'], 'green');
                                    break;
                                case 'rdt':
                                case 'rtd':
                                case 'drt':
                                case 'dtr':
                                case 'trd':
                                case 'tdr':
                                    setStateColors(['Nebraska'], 'gray');
                                    break;
                            }
                        }
                        
                        $('#nebraska_popular').change(updateNebraska);
                        $('#nebraska_4').change(updateNebraska);
                        $('#nebraska_5').change(updateNebraska);
                    }
                    $(usGeo['Nebraska'].statePath.node).click(nebraskaHandler);
                    break;
                
                case 'Maine':
                    function maineHandler(e) {
                        $('#maine_electoral').dialog('open');
                        
                        function updateMaine() {
                            var oldBlue = lowerChart.series[0].data[0].y;
                            var oldRed = lowerChart.series[2].data[0].y;
                            var oldYellow = lowerChart.series[1].data[0].y;
                            
                            var newVotes = {
                                republican: 0,
                                democratic: 0,
                                thirdParty: 0
                            };
                            
                            // figure out new votes
                            switch ($('#maine_popular').val()) {
                                case 'r':
                                    newVotes.republican += 3;
                                    break;
                                case 'd':
                                    newVotes.democratic += 3;
                                    break;
                                case 't':  // fall through
                                default:
                                    newVotes.thirdParty += 3;
                                    break;
                            }
                            switch ($('#maine_4').val()) {
                                case 'r':
                                    newVotes.republican += 1;
                                    break;
                                case 'd':
                                    newVotes.democratic += 1;
                                    break;
                                case 't':  // fall through
                                default:
                                    newVotes.thirdParty += 1;
                                    break;
                            }
                            
                            lowerChart.series[0].setData([{
                                color: styleColors['blue'],
                                y: oldBlue - maineVotes.democratic + newVotes.democratic
                            }]);
                            lowerChart.series[1].setData([{
                                color: styleColors['yellow'],
                                y: oldYellow - maineVotes.thirdParty + newVotes.thirdParty
                            }]);
                            lowerChart.series[2].setData([{
                                color: styleColors['red'],
                                y: oldRed - maineVotes.republican + newVotes.republican
                            }]);
                            maineVotes = newVotes;
                            
                            switch ($('#maine_popular').val() + $('#maine_4').val()) {
                                case 'rr':
                                    setStateColors(['Maine'], 'red');
                                    break;
                                case 'dd':
                                    setStateColors(['Maine'], 'blue');
                                    break;
                                case 'tt':
                                    setStateColors(['Maine'], 'yellow');
                                    break;
                                case 'rd':  // fall through
                                case 'dr':
                                    setStateColors(['Maine'], 'purple');
                                    break;
                                case 'rt':  // fall through
                                case 'tr':
                                    setStateColors(['Maine'], 'orange');
                                    break;
                                case 'dt':  // fall through
                                case 'td':
                                    setStateColors(['Maine'], 'green');
                                    break;
                            }
                        }
                        
                        $('#maine_popular').change(updateMaine);
                        $('#maine_4').change(updateMaine);
                    }
                    $(usGeo['Maine'].statePath.node).click(maineHandler);
                    break;
                
                default:
                    function genericHandler() {
                        var state = $(this).data('state');
                        var stateUnescaped = state.replace(/_/g, ' ');
                        var votes = electoralVotes['2012'][stateUnescaped];
                        
                        var oldBlue = lowerChart.series[0].data[0].y;
                        var oldRed = lowerChart.series[2].data[0].y;
                        var oldYellow = lowerChart.series[1].data[0].y;
                        
                        switch (usGeo[stateUnescaped].statePath.attr('fill')) {
                            case styleColors['red']:
                                // this.attr({'fill': styleColors['blue']});
                                lowerChart.series[2].setData([{
                                    color: styleColors['red'],
                                    y: oldRed - votes
                                }]);
                                setStateColors([state], 'blue');
                                lowerChart.series[0].setData([{
                                    color: styleColors['blue'],
                                    y: oldBlue + votes
                                }]);
                                break;
                            case styleColors['blue']:
                                // this.attr({'fill': styleColors['yellow']});
                                lowerChart.series[0].setData([{
                                    color: styleColors['blue'],
                                    y: oldBlue - votes
                                }]);
                                setStateColors([state], 'yellow');
                                lowerChart.series[1].setData([{
                                    color: styleColors['yellow'],
                                    y: oldYellow + votes
                                }]);
                                break;
                            case styleColors['yellow']:  // fall through
                            default:
                                // this.attr({'fill': styleColors['red']});
                                lowerChart.series[1].setData([{
                                    color: styleColors['yellow'],
                                    y: oldYellow - votes
                                }]);
                                setStateColors([state], 'red');
                                lowerChart.series[2].setData([{
                                    color: styleColors['red'],
                                    y: oldRed + votes
                                }]);
                                break;
                        }
                    }
                    $(usGeo[i].statePath.node).click(genericHandler);
                    break;
            }
        }
        
        return false;
    });
});
