$(document).ready(function() {
    var config = {
        autoRefresh: true,
        autoRefreshDelay: 15 * 1000,
        balanceOfPowerStart: {
            senate: {
                republican: 30,  // 51 - (CA + DE + FL + HI + MD + MI + MN + MO + MT + NE + NJ + NM + NY + ND + OH + PA + RI + VA + WA + WV + WI)
                democratic: 37,  // 47 - (AZ + IN + ME + MA + MS + NV + TN + UT + TX + WY)
                thirdParty: 0    // 2 - (CT + VT)
            }
        },
        dataPath: 'http://www.pbs.org/newshour/vote2012/map/live_data_other/'
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
    
    // Renderers for each section of the page
    function renderPresidentialRace() {
        if ($.isEmptyObject(latestData)) {return;}
        var presidentData = latestData.electoralData["United States"];
        
        // Show precincts reporting.
        var precinctsPercent = Math.round(100 * presidentData.precincts[0] / presidentData.precincts[1]);
        // It ain't over til it's over, though; don't round up to 100 percent
        // reporting unless we mean it.
        if (precinctsPercent === 100 && presidentData.precincts[0] !== presidentData.precincts[1]) {
            precinctsPercent = 99;
        }
        $('#precincts-percent').text(precinctsPercent);
        
        // Set up vote totals and a results hash.
        var totalVotes = 0;
        var voteLookup = {};
        for (var i = 0, length = presidentData.breakdown.length; i < length; i++) {
            var candidateData = presidentData.breakdown[i];
            
            var lastName = candidateData[0];
            var voteCount = candidateData[1];
            var electoralVotes = candidateData[2];
            
            totalVotes += voteCount;
            voteLookup[lastName] = {
                electoral: electoralVotes,
                popular: voteCount
            };
        }
        
        // Show Obama's results data.
        var obamaData = voteLookup["Obama"];
        $('#obama-votes').text(formatThousands(obamaData.popular, 0));
        var obamaPercent = Math.round(100 * obamaData.popular / totalVotes);
        $('#obama-bar').css('width', Math.round(100 * obamaData.electoral / 538) + '%');
        if (totalVotes === 0) {
            $('#obama-percent').text("0");
        } else {
            $('#obama-percent').text(obamaPercent);
        }
        $('#obama-electoral').text(obamaData.electoral);
        if (obamaData.electoral < 270) {
            $('#obama-electoral-remaining').text(270 - obamaData.electoral);
        } else {
            $('#obama-electoral-remaining').text("0");
        }
        
        // Show Romney's results data.
        var romneyData = voteLookup["Romney"];
        $('#romney-votes').text(formatThousands(romneyData.popular, 0));
        var romneyPercent = Math.round(100 * romneyData.popular / totalVotes);
        $('#romney-bar').css('width', Math.round(100 * romneyData.electoral / 538) + '%');
        if (totalVotes === 0) {
            $('#romney-percent').text("0");
        } else {
            $('#romney-percent').text(romneyPercent);
        }
        $('#romney-electoral').text(romneyData.electoral);
        if (romneyData.electoral < 270) {
            $('#romney-electoral-remaining').text(270 - romneyData.electoral);
        } else {
            $('#romney-electoral-remaining').text("0");
        }
    }
    
    function renderSenateSeats() {
        var republicanStates = [];
        var democraticStates = [];
        
        for (var stateName in latestData.areas) {
            // Some of these are showing up as "U.S. Senate - 2012" and
            // other weird variants instead of just "U.S. Senate". Because
            // we know there aren't any states with multiple Senate races
            // (except, IIRC, for one that's for just a couple of months
            // that we aren't worrying about), we just look for any race
            // that starts with "U.S. Senate" and assume that's the one.
            var stateData = false;
            var raceNameStart = "U.S. Senate";
            for (var raceName in latestData.areas[stateName]) {
                if (raceName.slice(0, raceNameStart.length) == raceNameStart) {
                    stateData = latestData.areas[stateName][raceName];
                    break;
                }
            }
            if (!stateData) {continue;}
            
            // Set state colors, but only if they're called for the candidate.
            if (stateData.winner) {
                var winnerParty = latestData.parties[stateName][stateData.winner];
                if (winnerParty == 'GOP') {
                    republicanStates.push(stateName);
                } else if (winnerParty == 'Dem') {
                    democraticStates.push(stateName);
                }
            }
        }
        
        $('#dem-senate-won').text(democraticStates.length);
        $('#rep-senate-won').text(republicanStates.length);
        $('#dem-senate-total').text(config.balanceOfPowerStart.senate.democratic + democraticStates.length);
        $('#rep-senate-total').text(config.balanceOfPowerStart.senate.republican + republicanStates.length);
    }
    
    function renderHouseSeats() {
        var republicanSeats = 0;
        var democraticSeats = 0;
        var thirdPartySeats = 0;
        
        for (var stateName in latestData.areas) {
            var raceNameStart = "U.S. House";
            for (var raceName in latestData.areas[stateName]) {
                if (raceName.slice(0, raceNameStart.length) == raceNameStart) {
                    var stateData = latestData.areas[stateName][raceName];
                    
                    if (stateData.winner) {
                        var winnerParty = latestData.parties[stateName][stateData.winner];
                        if (winnerParty == 'GOP') {
                            republicanSeats += 1;
                        } else if (winnerParty == 'Dem') {
                            democraticSeats += 1;
                        } else {
                            thirdPartySeats += 1;
                        }
                    }
                }
            }
        }
        
        $('#dem-house-total').text(democraticSeats);
        $('#rep-house-total').text(republicanSeats);
    }
    
    // This gets called every so often to update our copy of the data.
    function loadData() {
        $.ajax({
            url: config.dataPath + 'us_general.json',
            dataType: 'jsonp',
            jsonpCallback: 'US',
            success: function(data) {
                latestData = data;
                renderPresidentialRace();
                renderSenateSeats();
                renderHouseSeats();
            }
        });
    }
    
    // Are we automatically refreshing the data? If so, get that going.
    if (config.autoRefresh) {
        if (autoRefreshIntervalId) {
            window.clearInterval(autoRefreshIntervalId);
        }
        autoRefreshIntervalId = window.setInterval(loadData, config.autoRefreshDelay);
    }
    
    // Here goes!
    loadData();
});
