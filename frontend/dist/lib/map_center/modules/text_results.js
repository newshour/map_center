$(document).ready(function() {
    var config = {
        autoRefresh: true,
        autoRefreshDelay: 15 * 1000,
        dataPath: 'http://www.pbs.org/newshour/vote2012/map/live_data_other/',
        friendlyRaceNames: {
            "U.S. House - District 1": "U.S. House 1",
            "U.S. House - District 2": "U.S. House 2",
            "U.S. House - District 3": "U.S. House 3",
            "U.S. House - District 4": "U.S. House 4",
            "U.S. House - District 5": "U.S. House 5",
            "U.S. House - District 6": "U.S. House 6",
            "U.S. House - District 7": "U.S. House 7",
            "U.S. House - District 8": "U.S. House 8",
            "U.S. House - District 9": "U.S. House 9",
            "U.S. House - District 10": "U.S. House 10",
            "U.S. House - District 11": "U.S. House 11",
            "U.S. House - District 12": "U.S. House 12",
            "U.S. House - District 13": "U.S. House 13",
            "U.S. House - District 14": "U.S. House 14",
            "U.S. House - District 15": "U.S. House 15",
            "U.S. House - District 16": "U.S. House 16",
            "U.S. House - District 17": "U.S. House 17",
            "U.S. House - District 18": "U.S. House 18",
            "U.S. House - District 19": "U.S. House 19",
            "U.S. House - District 20": "U.S. House 20",
            "U.S. House - District 21": "U.S. House 21",
            "U.S. House - District 22": "U.S. House 22",
            "U.S. House - District 23": "U.S. House 23",
            "U.S. House - District 24": "U.S. House 24",
            "U.S. House - District 25": "U.S. House 25",
            "U.S. House - District 26": "U.S. House 26",
            "U.S. House - District 27": "U.S. House 27",
            "U.S. House - District 28": "U.S. House 28",
            "U.S. House - District 29": "U.S. House 29",
            "U.S. House - District 30": "U.S. House 30",
            "U.S. House - District 31": "U.S. House 31",
            "U.S. House - District 32": "U.S. House 32",
            "U.S. House - District 33": "U.S. House 33",
            "U.S. House - District 34": "U.S. House 34",
            "U.S. House - District 35": "U.S. House 35",
            "U.S. House - District 36": "U.S. House 36",
            "U.S. House - District 37": "U.S. House 37",
            "U.S. House - District 38": "U.S. House 38",
            "U.S. House - District 39": "U.S. House 39",
            "U.S. House - District 40": "U.S. House 40",
            "U.S. House - District 41": "U.S. House 41",
            "U.S. House - District 42": "U.S. House 42",
            "U.S. House - District 43": "U.S. House 43",
            "U.S. House - District 44": "U.S. House 44",
            "U.S. House - District 45": "U.S. House 45",
            "U.S. House - District 46": "U.S. House 46",
            "U.S. House - District 47": "U.S. House 47",
            "U.S. House - District 48": "U.S. House 48",
            "U.S. House - District 49": "U.S. House 49",
            "U.S. House - District 50": "U.S. House 50",
            "U.S. House - District 51": "U.S. House 51",
            "U.S. House - District 52": "U.S. House 52",
            "U.S. House - District 53": "U.S. House 53",
            "U.S. Senate - (2006)": "U.S. Senate",
            "U.S. Senate - 2012": "U.S. Senate",
            "Referendum - 74 - Same-Sex Marriage": "Allow same-sex marriage",
            "Question - 6 - Allow Same Sex Marriage": "Allow same-sex marriage",
            "Question - 1 - Yes Same Sex Mrg": "Allow same-sex marriage",
            "Amendment - 1 - No Same Sex Marriage": "Ban same-sex marriage"
        }
    };
    
    var autoRefreshIntervalId = null;
    var latestData = {};
    
    // General-purpose utility functions
    function formatThousands(value, decimalPlaces, alwaysDecimalize) {
        // Set default decimal formatting values if undefined
        decimalPlaces = (typeof decimalPlaces == 'undefined') ? 1 : decimalPlaces;
        alwaysDecimalize = (typeof alwaysDecimalize == 'undefined') ? false : alwaysDecimalize;
        
        var wholePart = Math.floor(Math.abs(value)) + '';  // coerce to string
        
        var signPart = '';
        if (value < 0) {signPart = '-';}
        
        var decimalPart = '';
        if (alwaysDecimalize || value % 1 != 0) {
            decimalPart = (Math.abs(value) % 1).toFixed(decimalPlaces);
            decimalPart = decimalPart.substring(1);  // remove leading zero
        }
        
        var withCommas = wholePart;
        var commasToAdd = Math.floor(withCommas.length / 3);
        if (withCommas.length % 3 == 0) {commasToAdd -= 1;}
        for (var i = 0; i < commasToAdd; i++) {
            var firstComma = withCommas.indexOf(',');
            if (firstComma >= 0) {
                withCommas = withCommas.substring(0, firstComma-3) +
                    ',' + withCommas.substring(firstComma-3);
            } else {
                withCommas = withCommas.substring(0, withCommas.length-3) +
                    ',' + withCommas.substring(withCommas.length-3);
            }
        }
        return signPart + withCommas + decimalPart;
    }
    
    function formatDate(year, month, day, hour, minute) {
        var monthAbbrs = {
            1: 'Jan.',
            2: 'Feb.',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'Aug.',
            9: 'Sept.',
            10: 'Oct.',
            11: 'Nov.',
            12: 'Dec.'
        };
        var timeStringParts = [];
        
        // Convert hour from 24-hour time.
        if (hour > 12) {timeStringParts.push((hour - 12) + '');}
        else if (hour == 0) {timeStringParts.push('12');}
        else {timeStringParts.push(hour + '');}
        
        // Add minute, zero-padding if necessary
        if (minute != 0) {
            if (minute < 10) {timeStringParts.push(':0' + minute);}
            else {timeStringParts.push(':' + minute);}
        }
        
        // Add a.m. or p.m.
        if (hour < 12) {timeStringParts.push(' a.m., ');}
        else {timeStringParts.push(' p.m., ');}
        
        // Add month and day
        timeStringParts.push(monthAbbrs[month] + ' ' + day);
        
        // Done!
        return timeStringParts.join('');
    }
    
    function startsWith(string, starting) {
        return string.slice(0, starting.length) === starting;
    }
    
    var endingNumber = /^(.*?)(\d+)$/;
    
    // Data processing and rendering
    function renderStateData(data, stateName) {
        if (stateName === 'United States') {
            return;
        }
        
        var context = {
            races: [],
            stateName: stateName
        };
        
        var stateData = data.areas[stateName];
        for (var raceName in stateData) {
            var raceData = stateData[raceName];
            var raceContext = {
                candidates: [],
                percentPrecincts: Math.round(100 * raceData.precincts[0] / raceData.precincts[1]),
                raceName: config.friendlyRaceNames[raceName] || raceName
            };
            
            // It ain't over til it's over.
            if (raceContext.percentPrecincts === 100 && raceData.precincts[0] !== raceData.precincts[1]) {
                raceContext.percentPrecincts = 99;
            } else if (isNaN(raceContext.percentPrecincts)) {
                raceContext.percentPrecincts = 100;
            }
            
            var totalVotes = 0;
            for (var i = 0, length = raceData.breakdown.length; i < length; i++) {
                var candidateName = raceData.breakdown[i][0];
                var candidateVotes = raceData.breakdown[i][1];
                // FIXME: Figure out what to do about the presidential race.
                
                var candidateContext = {
                    winner: false,
                    isOdd: !!(i % 2),
                    name: candidateName,
                    voteCount: candidateVotes,
                    percentVotes: 0,
                };
                
                if (data.parties[stateName][candidateName] === "GOP") {
                    candidateContext.party = "gop";
                } else if (data.parties[stateName][candidateName] === "Dem") {
                    candidateContext.party = "dem";
                } else {
                    candidateContext.party = "ind";
                }
                
                totalVotes += candidateVotes;
                if (raceData.winner === candidateName) {
                    candidateContext.winner = true;
                }
                
                raceContext.candidates.push(candidateContext);
            }
            
            for (var i = 0, length = raceContext.candidates.length; i < length; i++) {
                var candidateContext = raceContext.candidates[i];
                candidateContext.percentVotes = Math.round(100 * candidateContext.voteCount / totalVotes);
                if (isNaN(candidateContext.percentVotes)) {
                    if (raceContext.percentPrecincts === 100) {
                        candidateContext.percentVotes = 100;
                    } else {
                        candidateContext.percentVotes = 0;
                    }
                }
                
                candidateContext.voteCount = formatThousands(candidateContext.voteCount, 0);
            }
            
            context.races.push(raceContext);
        }
        
        context.races.sort(function(a, b) {
            // President, governor, Senate, House, other
            if (a.raceName === 'President') {
                return -100;
            } else if (b.raceName === 'President') {
                return 100;
            }
            
            if (a.raceName === 'Governor') {
                return -90;
            } else if (b.raceName === 'Governor') {
                return 90;
            }
            
            if (a.raceName === 'U.S. Senate') {
                return -80;
            } else if (b.raceName === 'U.S. Senate') {
                return 80;
            }
            
            if (startsWith(a.raceName, 'U.S. House') && !startsWith(b.raceName, 'U.S. House')) {
                return -70;
            } else if (!startsWith(a.raceName, 'U.S. House') && startsWith(b.raceName, 'U.S. House')) {
                return 70;
            }
            
            var aMatches = endingNumber.exec(a.raceName);
            var bMatches = endingNumber.exec(b.raceName);
            if ((aMatches && bMatches) && (aMatches[1] === bMatches[1])) {
                return parseInt(aMatches[2], 10) - parseInt(bMatches[2], 10);
            }
            
            if (a.raceName < b.raceName) {
                return -1;
            } else if (a.raceName > b.raceName) {
                return 1;
            } else {
                return 0;
            }
        });
        $('#results').html(ich.races(context));
    }
    
    // This gets called every so often to update our copy of the data.
    var loadData = function() {
        $.ajax({
            url: config.dataPath + 'us_general.json',
            dataType: 'jsonp',
            jsonpCallback: 'US',
            success: function(data) {
                latestData = data;
                renderStateData(latestData, $('#results-state option').filter(':selected').val());
            }
        });
    };
    
    // Are we automatically refreshing the data? If so, get that going.
    if (config.autoRefresh) {
        if (autoRefreshIntervalId) {
            window.clearInterval(autoRefreshIntervalId);
        }
        autoRefreshIntervalId = window.setInterval(loadData, config.autoRefreshDelay);
    }
    
    // Bind the event handler for changing states.
    $('#results-state').change(function() {
        var newStateName = $(this).find('option').filter(':selected').val();
        if (!$.isEmptyObject(latestData)) {
            renderStateData(latestData, newStateName);
        } else {
            loadData();
        }
    });
    
    loadData();
});
