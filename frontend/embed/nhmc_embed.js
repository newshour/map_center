var embedNHMC = function(embedWidth, mapModule, mapView, staticMapsType, staticMapsIndex, justReturnMarkup) {
    // Coerce justReturnMarkup to false if not provided
    justReturnMarkup = typeof(justReturnMarkup) != 'undefined' ? justReturnMarkup : false;
    
    var calcHeight = function() {
        var titleHeight = 40;  // For #view_info h1 and #view_info padding
        if (embedWidth < 660) {  // Add logo
            titleHeight += 58 * (embedWidth * 0.96) / 659;
        } else {
            titleHeight += 58;
        }
        
        if (embedWidth <= 799) {  // Figure out how tall the map is
            var mapWidth = embedWidth;
        } else {
            var mapWidth = embedWidth * 0.65;
            if (mapWidth > 768) {mapWidth = 768;}
        }
        var mapHeight = mapWidth * 486 / 768;
        
        if (mapModule != 'electoral_college') {  // Data source attribution
            var attribHeight = 2 * 12;  // #content_area h2
        } else {
            var attribHeight = 0;
            titleHeight += 20;  // 2008 note
        }
        
        if (embedWidth <= 349) {
            if (mapModule == 'electoral_college') {
                var sidebarHeight = 185;
                titleHeight += 35;
            }
            else if (mapModule == 'past_primaries') {var sidebarHeight = 210;}
            else {
                if (staticMapsType == '08general') {
                    var sidebarHeight = 365;
                } else if (staticMapsType == 'patchwork_types') {
                    var sidebarHeight = 430;
                } else {
                    var sidebarHeight = 245;
                }
            }
        } else if (embedWidth <= 399) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 175;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 340;}
            else {
                if (staticMapsType == '08general') {
                    var sidebarHeight = 315;
                } else if (staticMapsType == 'patchwork_types') {
                    var sidebarHeight = 430;
                } else {
                    var sidebarHeight = 195;
                }
            }
        } else if (embedWidth <= 599) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 165;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 340;}
            else {
                if (staticMapsType == '08general') {
                    var sidebarHeight = 195;
                } else if (staticMapsType == 'patchwork_types') {
                    var sidebarHeight = 255;
                } else {
                    var sidebarHeight = 185;
                }
            }
        } else if (embedWidth <= 649) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 160;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 470;}
            else {
                if (staticMapsType == '08general') {
                    var sidebarHeight = 205;
                } else if (staticMapsType == 'patchwork_types') {
                    var sidebarHeight = 230;
                } else {
                    var sidebarHeight = 165;
                }
            }
        } else if (embedWidth <= 840) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 350;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 605;}
            else {
                if (staticMapsType == '08general') {
                    var sidebarHeight = 265;
                } else if (staticMapsType == 'patchwork_types') {
                    var sidebarHeight = 375;
                } else {
                    var sidebarHeight = 265;
                }
            }
        } else {
            if (mapModule == 'electoral_college') {var sidebarHeight = 350;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 555;}
            else {
                if (staticMapsType == '08general') {
                    var sidebarHeight = 265;
                } else if (staticMapsType == 'patchwork_types') {
                    var sidebarHeight = 375;
                } else {
                    var sidebarHeight = 265;
                }
            }
        }
        
        var leftHeight = titleHeight + mapHeight + attribHeight;
        var rightHeight = titleHeight + 10 + sidebarHeight;
        if (embedWidth <= 799) {
            leftHeight += 24 + sidebarHeight;
            rightHeight = 0;
        }
        var maxHeight = Math.max(leftHeight, rightHeight);
        
        return maxHeight;
    };
    
    var makeId = function() {
        var idParts = ['nhmc'];
        idParts.push({
            'static_maps': 'sm',
            'past_primaries': 'pp',
            'electoral_college': 'ec'
        }[mapModule]);
        idParts.push(mapView);
        if (staticMapsType) {
            idParts.push({
                '08general': '08',
                'bachelors': 'bs',
                'diversity': 'di',
                'ethnicity': 'et',
                'evangelical': 'ev',
                'foreclosures': 'fc',
                'income': 'in',
                'patchwork_types': 'pn',
                'population_density': 'pd',
                'primary_winners': 'pw',
                'senate_six': 'sr',
                'social_security': 'ss',
                'unemployment': 'ue'
            }[staticMapsType]);
        }
        if (staticMapsIndex) {idParts.push(staticMapsIndex);}
        return idParts.join('-');
    };
    
    var scripts = document.getElementsByTagName('script');
    var thisScript = scripts[scripts.length - 1];
    var scriptParent = thisScript.parentNode;
    
    var iframeSrc = "http://www.pbs.org/newshour/vote2012/map/embed/embed.php?map_module=" + mapModule;
    if (mapView) {
        iframeSrc += "&map_view=" + mapView;
    }
    if (staticMapsType) {
        iframeSrc += "&static_maps_type=" + staticMapsType;
    }
    if (staticMapsIndex) {
        iframeSrc += "&static_maps_index=" + staticMapsIndex;
    }
    if (mapModule == 'electoral_college') {
        iframeSrc += "#states=lrGSpRqGBlvGnqBlKp";
    }
    
    if (!justReturnMarkup) {
        var iframe = document.createElement('iframe');
        iframe.scrolling = 'no'; iframe.frameBorder = 0;
        iframe.width = embedWidth; iframe.height = calcHeight();
        iframe.id = makeId();
        iframe.src = iframeSrc;
        scriptParent.appendChild(iframe);
    } else {
        return ['<iframe src="', iframeSrc, '" scrolling="no" frameborder="0" width="', embedWidth, '" height="', calcHeight(), '" id="', makeId(), '"></iframe>'].join('');
    }
};
