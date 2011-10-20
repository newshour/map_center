// declare namespaces
namespace("nhmc");
namespace("nhmc.config");

$(document).ready(function() {
    nhmc.config.styleColors = {
        'default': '#777777',
        'red': '#4d0000',
        'blue': '#00004d',
        'green': '#004d00',
        'purple': '#33004d',
        'black': '#000000',
        'white': '#808080',
        'gray': '#4d4d4d',
        'yellow': '#805d08',
        'magenta': '#4d004d',
        'cyan': '#004d4d',
        'orange': '#804500'
    };
    
    nhmc.config.defaultAttributes = {
        'fill': nhmc.config.styleColors['default'],
        'stroke': nhmc.config.styleColors['gray']
    };
});
