var nhmcStaticBreakFormatter = function(thisBreak, prevBreak, isLastBreak, breakPrefix, breakSuffix, breakDecimals) {
    if (prevBreak == null && thisBreak == 1) {
        return "1 story";
    } else if (prevBreak == thisBreak - 1 && !isLastBreak) {
        if (thisBreak == 1) {return "1 story";}
        else {return thisBreak + " stories";}
    } else if (isLastBreak) {
        return "&ge;" + (prevBreak + 1) + " stories";
    } else {
        return (prevBreak + 1) + "&ndash;" + thisBreak + " stories";
    }
};
var nhmcStaticTooltipFormatter = function(thisFIPS, thisState, thisCounty, countyOnly, currentData) {
    if (currentData.areas[thisState]) {
        var pluralized = currentData.areas[thisState] > 1 ? " stories</p>" : " story</p>";
        return "<p>" + thisState + ":<br />" + currentData.areas[thisState] + pluralized;
    } else {
        return "<p>" + thisState + ":<br />No stories</p>";
    }
};

$(document).one('coreInitialized', function() {
    var listStories = function() {
        $('.stories-dialog').dialog('destroy');
        var stateName = this.nhmcData.state;
        var storiesHTML = '<div class="stories-dialog" title="Stories from ' + stateName + '"><ul id="stories-list">';
        for (var i = 0, length = nhmcStatic.stories[stateName].length; i < length; i++) {
            var storyData = nhmcStatic.stories[stateName][i];
            storiesHTML += '<li>' + storyData.correspondent + ': <a href="' + storyData.url + '" target="_blank">' + storyData.headline + '</a></li>';
        }
        storiesHTML += '</ul></div>';
        $(storiesHTML).dialog();
    };
    for (var stateName in nhmcStatic.areas) {
        if (nhmc.geo.usGeo[stateName]) {
            nhmc.cleanup.clickHandlerTokens.push(nhmc.geo.usGeo[stateName].statePath.connect('onclick', nhmc.geo.usGeo[stateName].statePath, listStories));
        }
    }
});

var nhmcStatic = {
    "breaks": [1, 2, 3, 100],
    "colors": ["#fed98e", "#fe9929", "#d95f0e", "#993404"],
    "areas": {"Iowa": 2, "Colorado": 3, "California": 1, "Pennsylvania": 2, "Florida": 3, "Virginia": 4, "North Carolina": 3, "Ohio": 3, "New Hampshire": 2, "Missouri": 1, "Wisconsin": 1, "Indiana": 1, "Nevada": 1},
    "stories": {"Wisconsin": [{"headline": "Wisconsin Recall Election Watched for National Repurcussions ", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/wiscrace_06-04.html", "state": "Wisconsin", "correspondent": "Jeffrey Brown"}], "Iowa": [{"headline": "GOP Hopefuls Woo Iowans at State Fair Ahead of Straw Poll", "url": "http://www.pbs.org/newshour/bb/politics/july-dec11/iowa1_08-12.html", "state": "Iowa", "correspondent": "Gwen Ifill"}, {"headline": "In Battleground Iowa, Early Voting Turnout Is Key", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/iowa_10-03.html", "state": "Iowa", "correspondent": "Hari Sreenivasan"}], "Colorado": [{"headline": "Colorado Voters Facing Deluge of Campaign Ads", "url": "http://www.pbs.org/newshour/rundown/2012/09/colorado-voters-facing-deluge-of-campaign-ads.html", "state": "Colorado", "correspondent": "Ari Shapiro"}, {"headline": "Political Ad Spending Doubled in 2012, More Drastically in Battleground States", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/campaign_09-24.html", "state": "Colorado", "correspondent": "Ari Shapiro"}, {"headline": "Campaigns Court Colorado Hispanics in Unpredictable Contest", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/latinovote_05-29.html", "state": "Colorado", "correspondent": "Gwen Ifill"}], "Pennsylvania": [{"headline": "Will Pennsylvania Conservatives Come Around to Romney? ", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/romney_04-23.html", "state": "Pennsylvania", "correspondent": "Judy Woodruff"}, {"headline": "Without a Photo ID, Some PA Voters Won't Count in November Under Strict Law", "url": "http://www.pbs.org/newshour/bb/law/july-dec12/pennsylvania_07-24.html", "state": "Pennsylvania", "correspondent": "Ray Suarez"}], "New Hampshire": [{"headline": "What Do New Hampshire's Voters Want in a Republican Nominee?", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/roundtable_01-06.html", "state": "New Hampshire", "correspondent": "Gwen Ifill"}, {"headline": "New Hampshire's Unaffiliated Voters Have a Knack for Deciding Late", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/nhpreview_01-09.html", "state": "New Hampshire", "correspondent": "Gwen Ifill"}], "Florida": [{"headline": "Obama Campaign Faces Challenges in Efforts to Woo Florida Voters", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/florida_07-23.html", "state": "Florida", "correspondent": "Judy Woodruff"}, {"headline": "Tax Cuts, Deregulation Among Republican Election Priorities", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/tampa_08-24.html", "state": "Florida", "correspondent": "Paul Solman"}, {"headline": "After First Debate, Florida Voters Discuss Convincibility, Consistency", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/florida_10-04.html", "state": "Florida", "correspondent": "Ray Suarez"}], "Virginia": [{"headline": "Campaigns Vie for Virginia Voters, Especially Women", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/virginia_08-15.html", "state": "Virginia", "correspondent": "Judy Woodruff"}, {"headline": "Gov. McDonnell Showcases Va. Economy as Romney Considers VP", "url": "http://www.pbs.org/newshour/rundown/2012/06/bob-mcdonnell-showcases-va-economy-as-romney-considers-vp-choices.html", "state": "Virginia", "correspondent": "Kwame Holman"}, {"headline": "Undecided Voters Weigh in on Romney's Convention Speech", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/undecided_08-31.html", "state": "Virginia", "correspondent": "Ray Suarez"}, {"headline": "Undecided Voters Weigh in on Obama's Convention Speech", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/undecideds_09-07.html", "state": "Virginia", "correspondent": "Ray Suarez"}], "North Carolina": [{"headline": "North Carolina Up for Grabs in 2012 as Voter Enthusiasm Wanes", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/northcarolina_10-02.html", "state": "North Carolina", "correspondent": "Jeffrey Brown"}, {"headline": "Making Sen$e of Health Care: Competing Claims on Campaign Trail About Reform", "url": "http://www.pbs.org/newshour/bb/health/july-dec12/makingsense_09-11.html", "state": "North Carolina", "correspondent": "Paul Solman"}, {"headline": "Dems Economic Platform: Support of Small Business, Education", "url": "http://www.pbs.org/newshour/bb/business/july-dec12/makingsense_08-31.html", "state": "North Carolina", "correspondent": "Paul Solman"}], "California": [{"headline": "Obama's Shift on Gay Marriage Lucrative for Campaign", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/gayvote_07-16.html", "state": "California", "correspondent": "Spencer Michels"}], "Missouri": [{"headline": "Missouri Senate Seat in Play as Akin and McCaskill Fight for the Middle", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/missouri_10-05.html", "state": "Missouri", "correspondent": "Gwen Ifill"}], "Indiana": [{"headline": "Indiana Sen. Lugar Targeted for Defeat by His Own Party", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/indiana_04-13.html", "state": "Indiana", "correspondent": "Gwen Ifill"}], "Ohio": [{"headline": "Battleground Ohio: As Obama, Romney Make Pitch, Are Voters Listening?", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/ohiopolitics_06-18.html", "state": "Ohio", "correspondent": "Gwen Ifill"}, {"headline": "Super Tuesday: How Ohio Is Shaping the Republican Race", "url": "http://www.pbs.org/newshour/bb/politics/jan-june12/campaign_03-05.html", "state": "Ohio", "correspondent": "Judy Woodruff"}, {"headline": "In Swing States, Elusive Youth Voters are Jaded, Undecided ", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/ohio_09-26.html", "state": "Ohio", "correspondent": "Judy Woodruff"}], "Nevada": [{"headline": "Overlooked Asian-American Vote Could Factor in Nevada, Other Battleground States", "url": "http://www.pbs.org/newshour/bb/politics/july-dec12/nevada_07-31.html", "state": "Nevada", "correspondent": "Hari Sreenivasan"}]}
};
