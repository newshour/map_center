var embedNHMC = function(embedWidth, mapModule, mapView, staticMapsType, staticMapsIndex) {
    var calcHeight = function() {
        var titleHeight = 40;  // For #view_info h1 and #view_info padding
        
        if (mapModule == 'electoral_college') {
            var instructionsHeight = 22;  // For #content_area h2
        } else {
            var instructionsHeight = 0;
        }
        
        if (embedWidth <= 599) {
            var mapWidth = embedWidth;
        } else if (embedWidth <= 799) {
            var mapWidth = embedWidth * 0.55;
        } else {
            var mapWidth = embedWidth * 0.65;
            if (mapWidth > 768) {mapWidth = 768;}
        }
        var mapHeight = mapWidth * 486 / 768;
        
        if (mapModule != 'electoral_college') {
            var attribHeight = 2 * 12;  // #content_area h2
        } else {
            var attribHeight = 0;
        }
        
        if (embedWidth <= 349) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 225;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 210;}
            else {var sidebarHeight = 245;}
        } else if (embedWidth <= 399) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 225;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 340;}
            else {var sidebarHeight = 195;}
        } else if (embedWidth <= 599) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 225;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 340;}
            else {var sidebarHeight = 165;}
        } else if (embedWidth <= 649) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 200;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 470;}
            else {var sidebarHeight = 225;}
        } else if (embedWidth <= 799) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 385;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 470;}
            else {var sidebarHeight = 225;}
        } else if (embedWidth <= 820) {
            if (mapModule == 'electoral_college') {var sidebarHeight = 385;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 525;}
            else {var sidebarHeight = 225;}
        } else {
            if (mapModule == 'electoral_college') {var sidebarHeight = 385;}
            else if (mapModule == 'past_primaries') {var sidebarHeight = 465;}
            else {var sidebarHeight = 225;}
        }
        
        var leftHeight = titleHeight + instructionsHeight + mapHeight + attribHeight;
        var rightHeight = titleHeight + 10 + sidebarHeight;
        if (embedWidth <= 599) {
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
                'foreclosures': 'fc',
                'income': 'in',
                'patchwork_types': 'pn',
                'population_density': 'pd',
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
    
    var iframe = document.createElement('iframe');
    iframe.scrolling = 'no'; iframe.frameBorder = 0;
    iframe.width = embedWidth; iframe.height = calcHeight();
    iframe.id = makeId();
    
    iframeSrc = "http://www.newshourapps.org/map_center/embed.php?map_module=" + mapModule + "&map_view=" + mapView;
    if (staticMapsType) {
        iframeSrc += "&static_maps_type=" + staticMapsType;
    }
    if (staticMapsIndex) {
        iframeSrc += "&static_maps_index=" + staticMapsIndex;
    }
    iframe.src = iframeSrc;
    
    scriptParent.appendChild(iframe);
};
