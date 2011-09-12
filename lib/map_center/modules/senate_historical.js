$(document).ready(function() {
    var senators = {
        rr: ['Alabama', 'Arizona', 'Georgia', 'Idaho', 'Indiana', 'Kansas', 'Kentucky', 'Maine', 'Mississippi', 'Oklahoma', 'South Carolina', 'Tennessee', 'Texas', 'Utah', 'Wyoming'],
        dd: ['California', 'Colorado', 'Delaware', 'Hawaii', 'Maryland', 'Michigan', 'Minnesota', 'Montana', 'New Jersey', 'New Mexico', 'New York', 'Oregon', 'Rhode Island', 'Virginia', 'Washington', 'West Virginia'],
        rd: ['Alaska', 'Arkansas', 'Florida', 'Iowa', 'Illinois', 'Louisiana', 'Massachusetts', 'Missouri', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'Nevada', 'Ohio', 'Pennsylvania', 'South Dakota', 'Wisconsin'],
        di: ['Connecticut', 'Vermont']
    };
    
    $('#displays').append('<li id="senate_current"><a href="#">Show Senate breakdown</a></li>');
    $('#senate_current a').click(function() {
        clearMap();
        renderLegend('Current Senate by party', [
            ['Two Republicans', 'red'],
            ['Two Democrats', 'blue'],
            ['One Republican, one Democrat', 'purple'],
            ['One Democrat, one independent', 'orange']
        ]);
        setStateColors(senators.rr, 'red');
        setStateColors(senators.dd, 'blue');
        setStateColors(senators.rd, 'purple');
        setStateColors(senators.di, 'orange');
        
        $('#view_chart').show();
        
        nhmc.charts.mainChart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart',
                width: 768,
                height: 486,
                type: 'pie'
            },
            credits: {
                text: 'Source: Senate.gov',
                href: 'http://senate.gov/general/contact_information/senators_cfm.cfm?OrderBy=state&Sort=ASC'
            },
            legend: {enabled: false},
            series: [{
                data: [{
                    name: 'Republicans',
                    color: styleColors['red'],
                    y: 51
                }, {
                    name: 'Democrats',
                    color: styleColors['blue'],
                    y: 47
                }, {
                    name: 'Independents',
                    color: styleColors['yellow'],
                    y: 2
                }],
                type: 'pie',
                name: 'Senators'
            }],
            title: {text: 'Current Senate by party'},
            tooltip: {enabled: false}
        });
        
        return false;
    });
});