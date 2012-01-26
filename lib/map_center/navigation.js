$(document).ready(function() {
    function getFilename(url) {
        if (url.indexOf('\\') == -1) {var pathDelimiter = '/';}
        else {var pathDelimiter = '\\';}
        
        return url.substring(url.lastIndexOf(pathDelimiter) + 1);
    }
    
    var navObjects = [{
        featured: true,
        title: "Live primary results",
        href: "live.html",
        id: "live"
    }, {
        featured: false,
        title: "Past primary and caucus results",
        href: "past_primaries.html",
        id: "past"
    }, {
        featured: false,
        title: "Electoral College calculator",
        href: "calc.html",
        id: "electoral"
    }, {
        featured: false,
        title: "2008 general election",
        href: "08general.html",
        id: "08general"
    }, {
        featured: false,
        title: "Ethnic backgrounds",
        href: "ethnicity.html",
        id: "ethnicity"
    }, {
        featured: false,
        title: "Diversity in America",
        href: "diversity.html",
        id: "diversity"
    }, {
        featured: false,
        title: "Jobless by county",
        href: "unemployment.html",
        id: "jobless"
    }, {
        featured: false,
        title: "Population density",
        href: "population_density.html",
        id: "population"
    }, {
        featured: false,
        title: "Patchwork Nation counties",
        href: "patchwork_types.html",
        id: "patchwork"
    }];
    
    var currentFilename = getFilename(window.location.href);
    var isBroadcast = currentFilename.indexOf('-broadcast') != -1;
    
    $('#nav_container').empty();
    for (var i = 0, length = navObjects.length; i < length; i++) {
        var navObject = navObjects[i];
        
        if (isBroadcast) {
            var navObjectHref = navObject.href.replace('.html', '-broadcast.html');
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
});
