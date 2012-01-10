(function() {
    // declare namespaces
    namespace("nhmc");
    namespace("nhmc.config");
    
    var config = {
        featuredState: 'nh',
        
        autoRefresh: true,
        autoRefreshDelay: 1000 * 15,
        condenseCandidates: true,
        showCandidates: [
            "Mitt Romney",
            "Rick Santorum",
            "Ron Paul",
            "Jon Huntsman",
            "Michele Bachmann",
            "Newt Gingrich",
            "Rick Perry"
        ]
    };
    
    $(document).ready(function() {
        // defaultState defaults to first visible state in 
        //  #state_menu if featuredState isn't defined above
        var defaultState = typeof(config.featuredState) != 'undefined' ? config.featuredState : $('#state_menu a').first().attr('href').substring(1);
        
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
        };
        
        function condenseCandidates(data) {
            var condensedData = {
                "breakdown": [],
                "winners": {},
                "candidates": {},
                "test": data.test,
                "precincts": data.precincts,
                "lastUpdated": data.lastUpdated,
                "areas": {}
            };
            
            var shouldCondenseCandidate = {};
            var otherCandidateId = '';
            for (var candidateId in data.candidates) {
                if (config.showCandidates.indexOf(data.candidates[candidateId]) != -1) {
                    shouldCondenseCandidate[candidateId] = false;
                    condensedData.candidates[candidateId] = data.candidates[candidateId];
                } else {
                    shouldCondenseCandidate[candidateId] = true;
                }
                
                if (data.candidates[candidateId] == 'Other') {
                    otherCandidateId = candidateId;
                    condensedData.candidates[candidateId] = "Other";
                }
            }
            
            if (!otherCandidateId) {
                otherCandidateId = 'other';
                condensedData.candidates[otherCandidateId] = "Other";
            }
            
            for (var areaId in data.winners) {
                if (shouldCondenseCandidate[data.winners[areaId]]) {
                    condensedData.winners[areaId] = otherCandidateId;
                } else {
                    condensedData.winners[areaId] = data.winners[areaId];
                }
            }
            
            for (var areaId in data.areas) {
                var oldAreaData = data.areas[areaId];
                var condensedAreaData = {
                    precincts: oldAreaData.precincts,
                    data: []
                }
                
                var otherTotal = 0;
                for (var i = 0, length = oldAreaData.data.length; i < length; i++) {
                    if (shouldCondenseCandidate[oldAreaData.data[i][0]]) {
                        otherTotal += oldAreaData.data[i][1];
                    } else {
                        condensedAreaData.data.push(oldAreaData.data[i]);
                    }
                }
                condensedAreaData.data.push([
                    otherCandidateId,
                    otherTotal
                ]);
                
                condensedData.areas[areaId] = condensedAreaData;
            }
            condensedData.breakdown = condensedData.areas[nhmc.config.USPSToState[$('#state_selected a').attr('href').substring(1).toUpperCase()]].data;
            
            return condensedData;
        }
        
        function renderData(data) {
            var monthAbbrs = {
                // These are Python datetime month keys, not JavaScript ones (which
                //  differ by one). Don't worry, I'm not forgetting.
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
            // Name these parts so they don't drive me crazy
            var now = {
                hour: data.lastUpdated[3],
                minute: data.lastUpdated[4],
                month: data.lastUpdated[1],
                day: data.lastUpdated[2]
            };
            // Convert hour from 24-hour time
            if (now.hour > 12) {timeStringParts.push((now.hour - 12) + '');}
            else if (now.hour == 0) {timeStringParts.push('12');}
            else {timeStringParts.push(now.hour + '');}
            // Add minute, zero-padding if necessary
            if (now.minute != 0) {
                if (now.minute < 10) {timeStringParts.push(':0' + now.minute);}
                else {timeStringParts.push(':' + now.minute);}
            }
            // Add a.m. or p.m.
            if (now.hour < 12) {timeStringParts.push(' a.m., ');}
            else {timeStringParts.push(' p.m., ');}
            // Add month and day
            timeStringParts.push(monthAbbrs[now.month] + ' ' + now.day);
            // Stick it all on the page!
            $('#last_updated').text(timeStringParts.join(''));
            
            $('#precincts_percent').text((100 * data.precincts[0] / data.precincts[1]).toFixed(1));
            $('#precincts_reporting').text(data.precincts[0]);
            $('#precincts_total').text(data.precincts[1]);
            
            var stateTotalVotes = 0;
            for (var i = 0, length = data.breakdown.length; i < length; i++) {
                stateTotalVotes += data.breakdown[i][1];
            }
            $('#results').empty();
            for (var i = 0, length = data.breakdown.length; i < length; i++) {
                var candidateId = data.breakdown[i][0];
                
                var candidateName = data.candidates[candidateId];
                var candidateNameParts = candidateName.split(' ');
                var candidateLastName = candidateNameParts[candidateNameParts.length - 1];
                
                var candidateVotePercent = 100 * data.breakdown[i][1] / stateTotalVotes;
                if (stateTotalVotes == 0) {candidateVotePercent = 0;}
                
                var resultEntry = $('#results_templates .result').clone().appendTo('#results');
                
                resultEntry.children('.candidate_vote_count').text(formatThousands(data.breakdown[i][1]));
                resultEntry.children('.candidate_votes').text(candidateVotePercent.toFixed(1) + '%');
                
                resultEntry.children('.candidate_name').children('.candidate_name_first').text(candidateNameParts.slice(0, -1).join(' '));
                resultEntry.children('.candidate_name').children('.candidate_name_last').text(candidateLastName);
                if (candidateLastName.toLowerCase() == 'preference') {
                    resultEntry.children('.candidate_name').children('.candidate_name_first').show();
                }
                
                if (data.winners[nhmc.config.USPSToState[$('#state_selected a').attr('href').substring(1).toUpperCase()]] == candidateId) {
                    resultEntry.children('.candidate_won').show();
                }
            }
            
            if (data.test) {
                $('#data_status').text('test');
            } else if (!data.test) {
                $('#data_status').text('results');
            }
        }
        
        function loadData(state) {
            $.ajax({
                url: 'http://www.pbs.org/newshour/vote2012/map/live_data/' + state + '.json',
                dataType: 'jsonp',
                jsonpCallback: state,
                success: function(data) {
                    if (config.condenseCandidates) {
                        renderData(condenseCandidates(data));
                    } else {
                        renderData(data);
                    }
                }
            });
        }
        
        $('#state_selected a').attr('href', '#' + defaultState).text($('#state_menu .state_option[href="#' + defaultState + '"]').text());
        $('#state_selected a').click(function() {
            $('#state_menu').slideToggle(250);
            return false;
        });
        
        $('#state_menu .state_option').click(function() {
            $('#state_selected a').attr('href', $(this).attr('href')).text($(this).text());
            $('#state_menu').slideUp(250);
            loadData($(this).attr('href').substring(1));
            return false;
        });
        
        loadData(defaultState);
        
        var autoRefreshIntervalId = null;
        if (config.autoRefresh) {
            if (autoRefreshIntervalId) {
                window.clearInterval(autoRefreshIntervalId);
            }
            
            autoRefreshIntervalId = window.setInterval(function() {
                loadData($('#state_selected a').attr('href').substring(1));
            }, config.autoRefreshDelay);
        }
    });
})();
