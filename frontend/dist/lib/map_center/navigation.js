$(document).ready(function() {
    // Change the contents of the navObjects array to change the contents of
    //  the top navigation.
    var navObjects = [{
    	featured: true,
    	title: "Listen To Me Election Videos",
        href: "listen-to-me.html",
        id: "past"
    }, {	
        featured: false,
        title: "Past primary and caucus results",
        href: "past_primaries.html",
        id: "past"
    }, {
        featured: false,
        title: "State winners",
        href: "primary_winners.html",
        id: "winners"
    }, {
        featured: false,
        title: "Electoral College calculator",
        href: "calc.html#states=lrGSpRqGBlvGnqBlKp",
        id: "electoral"
    }, {
        featured: false,
        title: "Historical results",
        href: "electoral_college.html",
        id: "electoral_historical"
    }, {
        featured: false,
        title: "2008 general election",
        href: "08general.html",
        id: "08general"
    }, {
        featured: false,
        title: "Unemployed",
        href: "unemployment.html",
        id: "jobless"
    }, {
        featured: false,
        title: "Change in unemployed",
        href: "unemployment_change.html",
        id: "unemployment_change"
    }, {
        featured: false,
        title: "Union workers",
        href: "unions.html",
        id: "unions"
    }, {
        featured: false,
        title: "Foreclosures",
        href: "foreclosures.html",
        id: "foreclosures"
    }, {
        featured: false,
        title: "Median income",
        href: "income.html",
        id: "income"
    }, {
        featured: false,
        title: "Bachelor's degrees",
        href: "bachelors.html",
        id: "bachelors"
    }, {
        featured: false,
        title: "Population density",
        href: "population_density.html",
        id: "population"
    }, {
        featured: false,
        title: "Evangelical Protestants",
        href: "evangelical.html",
        id: "evangelical"
    }, {
        featured: false,
        title: "2008 Hispanic voters",
        href: "hispanic_voters.html",
        id: "hispanic"
    }, {
        featured: false,
        title: "Ethnicity",
        href: "ethnicity.html",
        id: "ethnicity"
    }, {
        featured: false,
        title: "Diversity in America",
        href: "diversity.html",
        id: "diversity"
    }, {
        featured: false,
        title: "Patchwork Nation counties",
        href: "patchwork_types.html",
        id: "patchwork"
    }, {
        featured: false,
        title: "Voter ID laws",
        href: "voter_id.html",
        id: "voter_id"
    }, {
        featured: false,
        title: "Wisconsin recall results",
        href: "wi_recall.html",
        id: "wi_recall"
    }, {
        featured: false,
        title: "Embed Map",
        href: "embed/index.html",
        id: "embed"
    }];
    
    function getFilename(url) {
        if (url.indexOf('\\') == -1) {var pathDelimiter = '/';}
        else {var pathDelimiter = '\\';}
        
        var filename = url.substring(url.lastIndexOf(pathDelimiter) + 1);
        var hashIndex = filename.indexOf('#');
        if (hashIndex != -1) {
            return filename.substring(0, hashIndex);
        } else {
            return filename;
        }
    }
    
    var currentFilename = getFilename(window.location.href);
    var isBroadcast = currentFilename.indexOf('-broadcast') != -1;
    var isMobile = currentFilename.indexOf('-mobile') != -1;
    
    $('#nav_container').empty();
    for (var i = 0, length = navObjects.length; i < length; i++) {
        var navObject = navObjects[i];
        
        if (isBroadcast) {
            var navObjectHref = navObject.href.replace('.html', '-broadcast.html');
        } else if (isMobile) {
            var navObjectHref = navObject.href.replace('.html', '-mobile.html');
        } else {
            var navObjectHref = navObject.href;
        }
        
        var navElem = $('<div class="nav_option"><a></a></div>');
        navElem.find('a').attr({
            "href": navObjectHref,
            "id": 'nav_option_' + navObject.id
        }).text(navObject.title);
        
        if (currentFilename == navObjectHref) {
            navElem.addClass('nav_option_active');
        } else if (navObject.featured) {
            navElem.addClass('nav_option_featured');
        }
        
        $('#nav_container').append(navElem);
    }
    
    $('#nav-main').roto();
    
    $('#nav_toggle a').click(function() {
        var currentlyOpen = $('#nav_toggle').hasClass('open');
        if (currentlyOpen) {
            $('#nav_outer').slideUp(200, function() {
                $('#nav_toggle').removeClass('open').addClass('closed');
                $('#nav_toggle a').text('More Maps');
            });
        } else {
            $('#nav_outer').slideDown(200, function() {
                $('#nav_toggle').removeClass('closed').addClass('open');
                $('#nav_toggle a').text('Close');
            });
        }
        return false;
    });
    if (isBroadcast) {$('#nav_toggle a').click();}  // Close it now!
    $('.nav_option a').click(function() {
        // avoid iOS switch to Safari from app view
        if (typeof(self) == 'undefined') {
            parent.location = $(this).attr('href');
        } else {
            self.location = $(this).attr('href');
        }
        return false;
    });
});
