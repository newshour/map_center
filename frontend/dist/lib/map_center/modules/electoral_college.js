namespace("nhmc");
namespace("nhmc.geo");
namespace("nhmc.config");
namespace("nhmc.cleanup");
namespace("nhmc.ctrl");

$(document).one('coreInitialized', function() {
    // Color overrides for this module
    nhmc.config.styleColors["blue"] = "#283891";
    nhmc.config.styleColors["red"] = "#9f1c20";
    
    // Historical data
    var electoralVotes = {
        "2012": {
            "states": {
                "Alabama": 9,
                "Alaska": 3,
                "Arizona": 11,
                "Arkansas": 6,
                "California": 55,
                "Colorado": 9,
                "Connecticut": 7,
                "Delaware": 3,
                "District of Columbia": 3,
                "Florida": 29,
                "Georgia": 16,
                "Hawaii": 4,
                "Idaho": 4,
                "Illinois": 20,
                "Indiana": 11,
                "Iowa": 6,
                "Kansas": 6,
                "Kentucky": 8,
                "Louisiana": 8,
                "Maine": 4,
                "Maryland": 10,
                "Massachusetts": 11,
                "Michigan": 16,
                "Minnesota": 10,
                "Mississippi": 6,
                "Missouri": 10,
                "Montana": 3,
                "Nebraska": 5,
                "Nevada": 6,
                "New Hampshire": 4,
                "New Jersey": 14,
                "New Mexico": 5,
                "New York": 29,
                "North Carolina": 15,
                "North Dakota": 3,
                "Ohio": 18,
                "Oklahoma": 7,
                "Oregon": 7,
                "Pennsylvania": 20,
                "Rhode Island": 4,
                "South Carolina": 9,
                "South Dakota": 3,
                "Tennessee": 11,
                "Texas": 38,
                "Utah": 6,
                "Vermont": 3,
                "Virginia": 13,
                "Washington": 12,
                "West Virginia": 5,
                "Wisconsin": 10,
                "Wyoming": 3
            },
            "republican": [],
            "democratic": [],
            "tossup": []
        },
        "1964": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 5,
                "Iowa": 9,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 40,
                "Massachusetts": 14,
                "West Virginia": 7,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 12,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 4,
                "Pennsylvania": 29,
                "Florida": 14,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 26,
                "Alabama": 10,
                "New York": 43,
                "South Dakota": 4,
                "Colorado": 6,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 25,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Arizona", "Georgia", "Louisiana", "Mississippi", "South Carolina"],
            "democratic": ["Alaska", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
            "tossup": []
        },
        "1968": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 5,
                "Iowa": 9,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 40,
                "Massachusetts": 14,
                "West Virginia": 7,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 12,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 4,
                "Pennsylvania": 29,
                "Florida": 14,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 26,
                "Alabama": 10,
                "New York": 43,
                "South Dakota": 4,
                "Colorado": 6,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 25,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alaska", "Arizona", "California", "Colorado", "Delaware", "Florida", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "North Dakota", "Ohio", "Oklahoma", "Oregon", "South Carolina", "South Dakota", "Tennessee", "Utah", "Vermont", "Virginia", "Wisconsin", "Wyoming"],
            "democratic": ["Arkansas", "Connecticut", "District of Columbia", "Hawaii", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "New York", "Pennsylvania", "Rhode Island", "Texas", "Washington", "West Virginia"],
            "tossup": ["Alabama", "Georgia", "Louisiana", "Mississippi"],
            "North Carolina": {
                "republican": 12,
                "democratic": 0,
                "tossup": 1
            }
        },
        "1972": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 10,
                "Arizona": 6,
                "Iowa": 8,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 45,
                "Massachusetts": 14,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 27,
                "Florida": 17,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 25,
                "Alabama": 9,
                "New York": 41,
                "South Dakota": 4,
                "Colorado": 7,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 26,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4}, "Virginia": {"republican": 11,
                "democratic": 0,
                "tossup": 1
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
            "democratic": ["District of Columbia", "Massachusetts"],
            "tossup": [],
            "Virginia": {
                "republican": 11,
                "democratic": 0,
                "tossup": 1
            }
        },
        "1976": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 10,
                "Arizona": 6,
                "Iowa": 8,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 45,
                "Massachusetts": 14,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 27,
                "Florida": 17,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 25,
                "Alabama": 9,
                "New York": 41,
                "South Dakota": 4,
                "Colorado": 7,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 26,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alaska", "Arizona", "California", "Colorado", "Connecticut", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Maine", "Michigan", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "North Dakota", "Oklahoma", "Oregon", "South Dakota", "Utah", "Vermont", "Virginia", "Wyoming"],
            "democratic": ["Alabama", "Arkansas", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Kentucky", "Louisiana", "Maryland", "Massachusetts", "Minnesota", "Mississippi", "Missouri", "New York", "North Carolina", "Ohio", "Pennsylvania", "Rhode Island", "South Carolina", "Tennessee", "Texas", "West Virginia", "Wisconsin"],
            "tossup": [],
            "Washington": {
                "republican": 8,
                "democratic": 0,
                "tossup": 0
            }
        },
        "1980": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 26,
                "Arkansas": 6,
                "New Mexico": 4,
                "Indiana": 13,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 10,
                "Arizona": 6,
                "Iowa": 8,
                "Michigan": 21,
                "Kansas": 7,
                "Utah": 4,
                "Virginia": 12,
                "Oregon": 6,
                "Connecticut": 8,
                "Montana": 4,
                "California": 45,
                "Massachusetts": 14,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 27,
                "Florida": 17,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 12,
                "Ohio": 25,
                "Alabama": 9,
                "New York": 41,
                "South Dakota": 4,
                "Colorado": 7,
                "New Jersey": 17,
                "Washington": 9,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 26,
                "Nevada": 3,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Massachusetts", "Michigan", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "Wisconsin", "Wyoming"],
            "democratic": ["District of Columbia", "Georgia", "Hawaii", "Maryland", "Minnesota", "Rhode Island", "West Virginia"],
            "tossup": []
        },
        "1984": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 24,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 7,
                "Iowa": 8,
                "Michigan": 20,
                "Kansas": 7,
                "Utah": 5,
                "Virginia": 12,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 4,
                "California": 47,
                "Massachusetts": 13,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 25,
                "Florida": 21,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 23,
                "Alabama": 9,
                "New York": 36,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 16,
                "Washington": 10,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 29,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
            "democratic": ["District of Columbia", "Minnesota"],
            "tossup": []
        },
        "1988": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 24,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 10,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 7,
                "Iowa": 8,
                "Michigan": 20,
                "Kansas": 7,
                "Utah": 5,
                "Virginia": 12,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 4,
                "California": 47,
                "Massachusetts": 13,
                "West Virginia": 6,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 12,
                "North Dakota": 3,
                "Pennsylvania": 25,
                "Florida": 21,
                "Alaska": 3,
                "Kentucky": 9,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 23,
                "Alabama": 9,
                "New York": 36,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 16,
                "Washington": 10,
                "North Carolina": 13,
                "District of Columbia": 3,
                "Texas": 29,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4}
            ,
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Michigan", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Pennsylvania", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Wyoming"],
            "democratic": ["District of Columbia", "Hawaii", "Iowa", "Massachusetts", "Minnesota", "New York", "Oregon", "Rhode Island", "Washington", "West Virginia", "Wisconsin"],
            "tossup": []
        },
        "1992": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 22,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 12,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 8,
                "Iowa": 7,
                "Michigan": 18,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 3,
                "California": 54,
                "Massachusetts": 10,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 13,
                "North Dakota": 3,
                "Pennsylvania": 23,
                "Florida": 25,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 21,
                "Alabama": 9,
                "New York": 33,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 14,
                "District of Columbia": 3,
                "Texas": 32,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Florida", "Idaho", "Indiana", "Kansas", "Mississippi", "Nebraska", "North Carolina", "North Dakota", "Oklahoma", "South Carolina", "South Dakota", "Texas", "Utah", "Virginia", "Wyoming"],
            "democratic": ["Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Georgia", "Hawaii", "Illinois", "Iowa", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Montana", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "Ohio", "Oregon", "Pennsylvania", "Rhode Island", "Tennessee", "Vermont", "Washington", "West Virginia", "Wisconsin"],
            "tossup": []
        },
        "1996": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 22,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 8,
                "Iowa": 7,
                "Michigan": 18,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 3,
                "California": 54,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 13,
                "North Dakota": 3,
                "Pennsylvania": 23,
                "Florida": 25,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 21,
                "Alabama": 9,
                "New York": 33,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 14,
                "District of Columbia": 3,
                "Texas": 32,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Colorado", "Georgia", "Idaho", "Indiana", "Kansas", "Mississippi", "Montana", "Nebraska", "North Carolina", "North Dakota", "South Carolina", "South Dakota", "Texas", "Utah", "Virginia", "Wyoming"],
            "democratic": ["Arizona", "Arkansas", "California", "Connecticut", "Delaware", "District of Columbia", "Florida", "Hawaii", "Illinois", "Iowa", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Missouri", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "Tennessee", "Vermont", "Washington", "West Virginia", "Wisconsin"],
            "tossup": []
        },
        "2000": {
            "states": {
                "Mississippi": 7,
                "Oklahoma": 8,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 22,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 12,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 8,
                "Iowa": 7,
                "Michigan": 18,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 8,
                "Montana": 3,
                "California": 54,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 11,
                "Vermont": 3,
                "Georgia": 13,
                "North Dakota": 3,
                "Pennsylvania": 23,
                "Florida": 25,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 21,
                "Alabama": 9,
                "New York": 33,
                "South Dakota": 3,
                "Colorado": 8,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 14,
                "District of Columbia": 3,
                "Texas": 32,
                "Nevada": 4,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "Colorado", "Florida", "Georgia", "Idaho", "Indiana", "Kansas", "Kentucky", "Louisiana", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "West Virginia", "Wyoming"],
            "democratic": ["California", "Connecticut", "Delaware", "Hawaii", "Illinois", "Iowa", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "New Jersey", "New Mexico", "New York", "Oregon", "Pennsylvania", "Rhode Island", "Vermont", "Washington", "Wisconsin"],
            "tossup": [], 
            "District of Columbia": {
                "republican": 0,
                "democratic": 2,
                "tossup": 0
            }
        },
        "2004": {
            "states": {
                "Mississippi": 6,
                "Oklahoma": 7,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 21,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 11,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 10,
                "Iowa": 7,
                "Michigan": 17,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 7,
                "Montana": 3,
                "California": 55,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 10,
                "Vermont": 3,
                "Georgia": 15,
                "North Dakota": 3,
                "Pennsylvania": 21,
                "Florida": 27,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 20,
                "Alabama": 9,
                "New York": 31,
                "South Dakota": 3,
                "Colorado": 9,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 15,
                "District of Columbia": 3,
                "Texas": 34,
                "Nevada": 5,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "Colorado", "Florida", "Georgia", "Idaho", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Mexico", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "West Virginia", "Wyoming"],
            "democratic": ["California", "Connecticut", "Delaware", "District of Columbia", "Hawaii", "Illinois", "Maine", "Maryland", "Massachusetts", "Michigan", "New Hampshire", "New Jersey", "New York", "Oregon", "Pennsylvania", "Rhode Island", "Vermont", "Washington", "Wisconsin"],
            "tossup": [],
            "Minnesota": {
                "republican": 0,
                "democratic": 9,
                "tossup": 0
            }
        },
        "2008": {
            "states": {
                "Mississippi": 6,
                "Oklahoma": 7,
                "Delaware": 3,
                "Minnesota": 10,
                "Illinois": 21,
                "Arkansas": 6,
                "New Mexico": 5,
                "Indiana": 11,
                "Maryland": 10,
                "Louisiana": 9,
                "Idaho": 4,
                "Wyoming": 3,
                "Tennessee": 11,
                "Arizona": 10,
                "Iowa": 7,
                "Michigan": 17,
                "Kansas": 6,
                "Utah": 5,
                "Virginia": 13,
                "Oregon": 7,
                "Connecticut": 7,
                "Montana": 3,
                "California": 55,
                "Massachusetts": 12,
                "West Virginia": 5,
                "South Carolina": 8,
                "New Hampshire": 4,
                "Wisconsin": 10,
                "Vermont": 3,
                "Georgia": 15,
                "North Dakota": 3,
                "Pennsylvania": 21,
                "Florida": 27,
                "Alaska": 3,
                "Kentucky": 8,
                "Hawaii": 4,
                "Nebraska": 5,
                "Missouri": 11,
                "Ohio": 20,
                "Alabama": 9,
                "New York": 31,
                "South Dakota": 3,
                "Colorado": 9,
                "New Jersey": 15,
                "Washington": 11,
                "North Carolina": 15,
                "District of Columbia": 3,
                "Texas": 34,
                "Nevada": 5,
                "Maine": 4,
                "Rhode Island": 4
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "Georgia", "Idaho", "Kansas", "Kentucky", "Louisiana", "Mississippi", "Missouri", "Montana", "North Dakota", "Oklahoma", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "West Virginia", "Wyoming"],
            "democratic": ["California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Hawaii", "Illinois", "Indiana", "Iowa", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "Ohio", "Oregon", "Pennsylvania", "Rhode Island", "Vermont", "Virginia", "Washington", "Wisconsin"],
            "tossup": [],
            "Nebraska": {
                "republican": 4,
                "democratic": 1,
                "tossup": 0
            }
        }
    };
    var candidateNames = {
        "2012": {
            "democratic": "Obama",
            "republican": "Romney"
        },
        "1964": {
            "democratic": "Johnson",
            "republican": "Goldwater"
        },
        "1968": {
            "democratic": "Humphrey",
            "republican": "Nixon",
            "tossup": "Wallace"
        },
        "1972": {
            "democratic": "McGovern",
            "republican": "Nixon",
            "tossup": "Hospers"
        },
        "1976": {
            "democratic": "Carter",
            "republican": "Ford"
        },
        "1980": {
            "democratic": "Carter",
            "republican": "Reagan"
        },
        "1984": {
            "democratic": "Mondale",
            "republican": "Reagan"
        },
        "1988": {
            "democratic": "Dukakis",
            "republican": "Bush"
        },
        "1992": {
            "democratic": "Clinton",
            "republican": "Bush"
        },
        "1996": {
            "democratic": "Clinton",
            "republican": "Dole"
        },
        "2000": {
            "democratic": "Gore",
            "republican": "Bush"
        },
        "2004": {
            "democratic": "Kerry",
            "republican": "Bush"
        },
        "2008": {
            "democratic": "Obama",
            "republican": "McCain"
        }
    };
    
    // Tooltips for historical results
    var flyoutsEnabled = typeof(window.flyoutsEnabled) != 'undefined' ? window.flyoutsEnabled : false;
    var popularVotes = {
        "1964": {
            "democratic": {"Alabama":30.55,"Alaska":65.91,"Arizona":49.45,"Arkansas":56.06,"California":59.11,"Colorado":61.27,"Connecticut":67.81,"Delaware":60.95,"District of Columbia":0,"Florida":51.15,"Georgia":45.87,"Hawaii":78.76,"Idaho":50.92,"Illinois":59.47,"Indiana":55.98,"Iowa":59.86,"Kansas":54.09,"Kentucky":64.01,"Louisiana":43.19,"Maine":68.84,"Maryland":65.47,"Massachusetts":76.19,"Michigan":66.7,"Minnesota":63.76,"Mississippi":12.86,"Missouri":64.05,"Montana":58.95,"Nebraska":52.61,"Nevada":58.58,"New Hampshire":63.64,"New Jersey":65.61,"New Mexico":59.22,"New York":68.56,"North Carolina":56.15,"North Dakota":57.97,"Ohio":62.94,"Oklahoma":55.75,"Oregon":63.72,"Pennsylvania":64.92,"Rhode Island":80.87,"South Carolina":41.1,"South Dakota":55.61,"Tennessee":55.51,"Texas":63.32,"Utah":54.86,"Vermont":66.3,"Virginia":53.54,"Washington":61.96,"West Virginia":67.94,"Wisconsin":62.09,"Wyoming":56.56},
            "republican": {"Alabama":69.45,"Alaska":34.09,"Arizona":50.45,"Arkansas":43.41,"California":40.79,"Colorado":38.19,"Connecticut":32.09,"Delaware":38.78,"District of Columbia":0,"Florida":48.85,"Georgia":54.13,"Hawaii":21.24,"Idaho":49.08,"Illinois":40.53,"Indiana":43.56,"Iowa":36.68,"Kansas":45.06,"Kentucky":35.65,"Louisiana":56.81,"Maine":31.16,"Maryland":34.53,"Massachusetts":23.44,"Michigan":33.1,"Minnesota":36,"Mississippi":87.14,"Missouri":35.95,"Montana":40.57,"Nebraska":47.39,"Nevada":41.42,"New Hampshire":36.36,"New Jersey":33.86,"New Mexico":40.24,"New York":31.31,"North Carolina":43.85,"North Dakota":41.88,"Ohio":37.06,"Oklahoma":44.25,"Oregon":35.96,"Pennsylvania":34.7,"Rhode Island":19.13,"South Carolina":58.89,"South Dakota":44.39,"Tennessee":44.49,"Texas":36.49,"Utah":45.14,"Vermont":33.69,"Virginia":46.18,"Washington":37.38,"West Virginia":32.06,"Wisconsin":37.74,"Wyoming":43.44},
            "tossup": {}
        },
        "1968": {
            "democratic": {"Alabama":18.72,"Alaska":42.65,"Arizona":35.02,"Arkansas":30.33,"California":44.86,"Colorado":41.02,"Connecticut":49.48,"Delaware":41.61,"District of Columbia":81.82,"Florida":30.93,"Georgia":27.04,"Hawaii":59.83,"Idaho":30.66,"Illinois":44.15,"Indiana":37.99,"Iowa":40.82,"Kansas":34.72,"Kentucky":37.65,"Louisiana":28.21,"Maine":59.88,"Maryland":43.59,"Massachusetts":63.01,"Michigan":48.18,"Minnesota":54,"Mississippi":23.02,"Missouri":43.74,"Montana":41.59,"Nebraska":31.81,"Nevada":39.29,"New Hampshire":43.94,"New Jersey":43.97,"New Mexico":39.75,"New York":49.76,"North Carolina":29.24,"North Dakota":38.23,"Ohio":42.95,"Oklahoma":31.99,"Oregon":43.93,"Pennsylvania":47.61,"Rhode Island":64.04,"South Carolina":29.61,"South Dakota":41.96,"Tennessee":28.13,"Texas":41.14,"Utah":37.07,"Vermont":43.53,"Virginia":32.53,"Washington":47.23,"West Virginia":49.6,"Wisconsin":44.27,"Wyoming":35.51},
            "republican": {"Alabama":13.99,"Alaska":45.28,"Arizona":54.78,"Arkansas":31.01,"California":47.98,"Colorado":50.72,"Connecticut":44.32,"Delaware":45.12,"District of Columbia":18.18,"Florida":40.53,"Georgia":29.64,"Hawaii":38.7,"Idaho":56.79,"Illinois":47.08,"Indiana":50.29,"Iowa":53.01,"Kansas":54.84,"Kentucky":43.79,"Louisiana":23.47,"Maine":46.63,"Maryland":41.94,"Massachusetts":32.89,"Michigan":41.46,"Minnesota":41.46,"Mississippi":13.52,"Missouri":44.87,"Montana":50.6,"Nebraska":59.82,"Nevada":47.46,"New Hampshire":52.12,"New Jersey":46.1,"New Mexico":51.85,"New York":44.3,"North Carolina":39.51,"North Dakota":55.94,"Ohio":45.23,"Oklahoma":47.68,"Oregon":49.99,"Pennsylvania":44.04,"Rhode Island":31.79,"South Carolina":38.09,"South Dakota":53.27,"Tennessee":37.85,"Texas":39.87,"Utah":56.49,"Vermont":52.75,"Virginia":43.41,"Washington":45.12,"West Virginia":40.78,"Wisconsin":47.89,"Wyoming":55.76},
            "tossup": {"Alabama":65.86,"Alaska":12.07,"Arizona":9.56,"Arkansas":38.65,"California":6.78,"Colorado":7.53,"Connecticut":6.1,"Delaware":13.28,"District of Columbia":0,"Florida":28.53,"Georgia":43.3,"Hawaii":1.47,"Idaho":12.55,"Illinois":8.46,"Indiana":11.45,"Iowa":5.69,"Kansas":0,"Kentucky":18.29,"Louisiana":48.32,"Maine":1.76,"Maryland":14.47,"Massachusetts":3.73,"Michigan":10.04,"Minnesota":4.34,"Mississippi":63.46,"Missouri":11.39,"Montana":7.29,"Nebraska":8.36,"Nevada":13.25,"New Hampshire":3.76,"New Jersey":9.12,"New Mexico":7.86,"New York":0,"North Carolina":31.26,"North Dakota":5.75,"Ohio":11.81,"Oklahoma":20.33,"Oregon":6.08,"Pennsylvania":7.98,"Rhode Island":4.07,"South Carolina":32.3,"South Dakota":4.76,"Tennessee":34.02,"Texas":18.97,"Utah":6.37,"Vermont":3.16,"Virginia":23.55,"Washington":7.44,"West Virginia":9.62,"Wisconsin":7.56,"Wyoming":8.73}
        },
        "1972": {
            "democratic": {"Alabama":21.78,"Alaska":34.62,"Arizona":30.38,"Arkansas":30.71,"California":41.55,"Colorado":34.59,"Connecticut":40.13,"Delaware":39.18,"District of Columbia":78.1,"Florida":27.8,"Georgia":24.65,"Hawaii":37.52,"Idaho":26.04,"Illinois":40.53,"Indiana":33.34,"Iowa":40.48,"Kansas":29.5,"Kentucky":34.77,"Louisiana":28.35,"Maine":38.51,"Maryland":37.36,"Massachusetts":54.2,"Michigan":41.82,"Minnesota":46.09,"Mississippi":19.63,"Missouri":37.66,"Montana":37.85,"Nebraska":29.5,"Nevada":36.32,"New Hampshire":34.86,"New Jersey":36.77,"New Mexico":36.56,"New York":41.21,"North Carolina":28.89,"North Dakota":35.79,"Ohio":38.07,"Oklahoma":24,"Oregon":42.33,"Pennsylvania":39.13,"Rhode Island":46.82,"South Carolina":27.38,"South Dakota":45.52,"Tennessee":29.75,"Texas":33.25,"Utah":26.39,"Vermont":36.28,"Virginia":30.12,"Washington":38.64,"West Virginia":36.39,"Wisconsin":43.72,"Wyoming":30.47},
            "republican": {"Alabama":72.43,"Alaska":58.13,"Arizona":61.64,"Arkansas":68.82,"California":55.01,"Colorado":62.61,"Connecticut":58.57,"Delaware":59.6,"District of Columbia":21.56,"Florida":71.91,"Georgia":75.04,"Hawaii":62.48,"Idaho":64.24,"Illinois":59.05,"Indiana":66.11,"Iowa":57.61,"Kansas":67.66,"Kentucky":63.37,"Louisiana":65.32,"Maine":61.49,"Maryland":61.26,"Massachusetts":45.23,"Michigan":56.21,"Minnesota":51.55,"Mississippi":78.2,"Missouri":62.34,"Montana":57.93,"Nebraska":70.5,"Nevada":63.68,"New Hampshire":63.98,"New Jersey":61.57,"New Mexico":61.05,"New York":58.54,"North Carolina":69.46,"North Dakota":62.07,"Ohio":59.63,"Oklahoma":73.7,"Oregon":52.45,"Pennsylvania":59.11,"Rhode Island":53.01,"South Carolina":70.78,"South Dakota":54.15,"Tennessee":67.7,"Texas":66.23,"Utah":67.64,"Vermont":62.85,"Virginia":67.84,"Washington":56.92,"West Virginia":63.61,"Wisconsin":53.4,"Wyoming":69.01},
            "tossup": {}
        },
        "1976": {
            "democratic": {"Alabama":55.73,"Alaska":35.65,"Arizona":39.8,"Arkansas":64.96,"California":47.95,"Colorado":42.61,"Connecticut":46.73,"Delaware":51.97,"District of Columbia":81.63,"Florida":51.93,"Georgia":66.94,"Hawaii":50.59,"Idaho":37.12,"Illinois":48.11,"Indiana":45.66,"Iowa":48.46,"Kansas":44.94,"Kentucky":52.75,"Louisiana":51.77,"Maine":48.09,"Maryland":53.04,"Massachusetts":56.11,"Michigan":46.47,"Minnesota":54.9,"Mississippi":49.63,"Missouri":51.1,"Montana":45.4,"Nebraska":38.45,"Nevada":45.81,"New Hampshire":43.47,"New Jersey":47.92,"New Mexico":48.28,"New York":50.83,"North Carolina":55.27,"North Dakota":45.77,"Ohio":48.9,"Oklahoma":48.75,"Oregon":47.62,"Pennsylvania":50.4,"Rhode Island":55.44,"South Carolina":56.17,"South Dakota":48.91,"Tennessee":55.94,"Texas":51.14,"Utah":33.65,"Vermont":42.3,"Virginia":47.96,"Washington":46.11,"West Virginia":58.07,"Wisconsin":49.5,"Wyoming":39.81},
            "republican": {"Alabama":42.61,"Alaska":57.9,"Arizona":56.37,"Arkansas":34.9,"California":49.75,"Colorado":54.03,"Connecticut":51.88,"Delaware":46.59,"District of Columbia":16.51,"Florida":46.64,"Georgia":33.06,"Hawaii":48.06,"Idaho":59.88,"Illinois":50.08,"Indiana":53.36,"Iowa":49.47,"Kansas":52.49,"Kentucky":45.57,"Louisiana":45.99,"Maine":48.93,"Maryland":46.96,"Massachusetts":40.44,"Michigan":51.86,"Minnesota":42.02,"Mississippi":47.74,"Missouri":47.47,"Montana":52.84,"Nebraska":59.2,"Nevada":50.17,"New Hampshire":54.75,"New Jersey":50.08,"New Mexico":50.75,"New York":46.5,"North Carolina":44.22,"North Dakota":51.69,"Ohio":48.67,"Oklahoma":49.96,"Oregon":47.78,"Pennsylvania":47.73,"Rhode Island":44.14,"South Carolina":43.13,"South Dakota":50.39,"Tennessee":42.94,"Texas":47.97,"Utah":62.43,"Vermont":54.59,"Virginia":49.29,"Washington":50,"West Virginia":41.93,"Wisconsin":47.83,"Wyoming":59.3},
            "tossup": {}
        },
        "1980": {
            "democratic": {"Alabama":47.45,"Alaska":26.41,"Arizona":28.24,"Arkansas":47.52,"California":35.92,"Colorado":31.07,"Connecticut":38.52,"Delaware":44.87,"District of Columbia":74.89,"Florida":38.5,"Georgia":55.8,"Hawaii":44.8,"Idaho":25.19,"Illinois":41.72,"Indiana":37.65,"Iowa":38.6,"Kansas":33.29,"Kentucky":47.65,"Louisiana":45.75,"Maine":42.25,"Maryland":47.14,"Massachusetts":41.75,"Michigan":42.5,"Minnesota":46.5,"Mississippi":48.14,"Missouri":44.35,"Montana":32.43,"Nebraska":26.02,"Nevada":27.36,"New Hampshire":28.35,"New Jersey":38.56,"New Mexico":36.78,"New York":51.53,"North Carolina":47.18,"North Dakota":26.3,"Ohio":40.91,"Oklahoma":34.97,"Oregon":38.67,"Pennsylvania":42.48,"Rhode Island":47.68,"South Carolina":48.21,"South Dakota":31.69,"Tennessee":48.41,"Texas":41.42,"Utah":20.57,"Vermont":38.42,"Virginia":40.31,"Washington":37.32,"West Virginia":49.81,"Wisconsin":43.18,"Wyoming":27.97},
            "republican": {"Alabama":48.75,"Alaska":54.35,"Arizona":60.61,"Arkansas":48.13,"California":52.7,"Colorado":55.07,"Connecticut":48.16,"Delaware":47.21,"District of Columbia":13.41,"Florida":55.52,"Georgia":40.97,"Hawaii":42.9,"Idaho":66.46,"Illinois":49.65,"Indiana":56.01,"Iowa":51.31,"Kansas":57.85,"Kentucky":49.03,"Louisiana":51.2,"Maine":45.61,"Maryland":44.18,"Massachusetts":41.9,"Michigan":48.99,"Minnesota":42.56,"Mississippi":49.46,"Missouri":51.16,"Montana":56.82,"Nebraska":65.55,"Nevada":63.61,"New Hampshire":57.74,"New Jersey":51.97,"New Mexico":54.97,"New York":46.66,"North Carolina":49.3,"North Dakota":64.33,"Ohio":51.51,"Oklahoma":60.5,"Oregon":48.33,"Pennsylvania":49.59,"Rhode Island":37.21,"South Carolina":49.45,"South Dakota":60.53,"Tennessee":48.7,"Texas":55.28,"Utah":72.78,"Vermont":44.36,"Virginia":53.03,"Washington":49.66,"West Virginia":45.3,"Wisconsin":47.9,"Wyoming":62.64},
            "tossup": {}
        },
        "1984": {
            "democratic": {"Alabama":38.28,"Alaska":29.87,"Arizona":32.54,"Arkansas":38.29,"California":41.27,"Colorado":35.12,"Connecticut":38.83,"Delaware":39.93,"District of Columbia":85.38,"Florida":34.66,"Georgia":39.79,"Hawaii":43.82,"Idaho":26.39,"Illinois":43.3,"Indiana":37.68,"Iowa":45.89,"Kansas":32.6,"Kentucky":39.4,"Louisiana":38.18,"Maine":38.78,"Maryland":47.02,"Massachusetts":48.43,"Michigan":40.24,"Minnesota":49.72,"Mississippi":37.42,"Missouri":39.98,"Montana":38.18,"Nebraska":28.81,"Nevada":32.42,"New Hampshire":30.95,"New Jersey":39.2,"New Mexico":39.23,"New York":45.83,"North Carolina":37.89,"North Dakota":33.8,"Ohio":40,"Oklahoma":30.67,"Oregon":43.74,"Pennsylvania":45.99,"Rhode Island":48.02,"South Carolina":35.57,"South Dakota":36.53,"Tennessee":41.57,"Texas":36.11,"Utah":24.68,"Vermont":40.81,"Virginia":37.09,"Washington":42.58,"West Virginia":44.6,"Wisconsin":45.02,"Wyoming":28.24},
            "republican": {"Alabama":60.54,"Alaska":66.65,"Arizona":66.42,"Arkansas":60.47,"California":57.52,"Colorado":63.44,"Connecticut":60.73,"Delaware":59.78,"District of Columbia":13.73,"Florida":65.32,"Georgia":60.17,"Hawaii":55.1,"Idaho":72.36,"Illinois":56.17,"Indiana":61.67,"Iowa":53.27,"Kansas":66.27,"Kentucky":60.01,"Louisiana":60.77,"Maine":60.83,"Maryland":52.51,"Massachusetts":51.22,"Michigan":59.23,"Minnesota":49.54,"Mississippi":61.88,"Missouri":60.02,"Montana":60.47,"Nebraska":70.55,"Nevada":66.77,"New Hampshire":68.67,"New Jersey":60.09,"New Mexico":59.7,"New York":53.84,"North Carolina":61.9,"North Dakota":64.84,"Ohio":58.7,"Oklahoma":68.61,"Oregon":55.91,"Pennsylvania":53.34,"Rhode Island":51.67,"South Carolina":63.55,"South Dakota":63,"Tennessee":57.84,"Texas":63.61,"Utah":74.5,"Vermont":57.92,"Virginia":62.29,"Washington":56.09,"West Virginia":55.11,"Wisconsin":54.19,"Wyoming":70.51},
            "tossup": {}
        },
        "1988": {
            "democratic": {"Alabama":39.86,"Alaska":36.27,"Arizona":38.74,"Arkansas":42.19,"California":47.56,"Colorado":45.28,"Connecticut":46.87,"Delaware":43.48,"District of Columbia":82.65,"Florida":38.51,"Georgia":39.5,"Hawaii":54.27,"Idaho":36.01,"Illinois":48.6,"Indiana":39.69,"Iowa":54.71,"Kansas":42.56,"Kentucky":43.88,"Louisiana":44.06,"Maine":43.88,"Maryland":48.2,"Massachusetts":53.23,"Michigan":45.67,"Minnesota":52.91,"Mississippi":39.07,"Missouri":47.85,"Montana":46.2,"Nebraska":39.19,"Nevada":38.68,"New Hampshire":36.33,"New Jersey":42.6,"New Mexico":46.9,"New York":51.62,"North Carolina":41.71,"North Dakota":42.97,"Ohio":44.15,"Oklahoma":41.28,"Oregon":51.28,"Pennsylvania":48.39,"Rhode Island":55.64,"South Carolina":37.58,"South Dakota":46.51,"Tennessee":41.55,"Texas":43.35,"Utah":32.05,"Vermont":47.58,"Virginia":39.23,"Washington":50.05,"West Virginia":52.2,"Wisconsin":51.41,"Wyoming":38.01},
            "republican": {"Alabama":59.17,"Alaska":59.59,"Arizona":59.95,"Arkansas":56.37,"California":51.13,"Colorado":53.06,"Connecticut":51.98,"Delaware":55.88,"District of Columbia":14.3,"Florida":60.87,"Georgia":59.75,"Hawaii":44.75,"Idaho":62.08,"Illinois":50.69,"Indiana":59.84,"Iowa":44.5,"Kansas":55.79,"Kentucky":55.52,"Louisiana":54.27,"Maine":55.34,"Maryland":51.11,"Massachusetts":45.38,"Michigan":53.57,"Minnesota":45.9,"Mississippi":59.89,"Missouri":51.83,"Montana":52.07,"Nebraska":60.16,"Nevada":60.05,"New Hampshire":62.49,"New Jersey":56.24,"New Mexico":51.86,"New York":47.52,"North Carolina":57.97,"North Dakota":56.03,"Ohio":55,"Oklahoma":57.93,"Oregon":46.61,"Pennsylvania":50.7,"Rhode Island":43.93,"South Carolina":61.5,"South Dakota":52.85,"Tennessee":57.89,"Texas":55.95,"Utah":66.22,"Vermont":51.1,"Virginia":59.74,"Washington":48.46,"West Virginia":47.46,"Wisconsin":47.8,"Wyoming":60.53},
            "tossup": {}
        },
        "1992": {
            "democratic": {"Alabama":40.88,"Alaska":30.29,"Arizona":36.52,"Arkansas":53.21,"California":46.01,"Colorado":40.13,"Connecticut":42.22,"Delaware":43.52,"District of Columbia":84.64,"Florida":39,"Georgia":43.47,"Hawaii":48.09,"Idaho":28.42,"Illinois":48.58,"Indiana":36.79,"Iowa":43.29,"Kansas":33.74,"Kentucky":44.55,"Louisiana":45.58,"Maine":38.77,"Maryland":49.81,"Massachusetts":47.54,"Michigan":43.77,"Minnesota":43.48,"Mississippi":40.77,"Missouri":44.07,"Montana":37.63,"Nebraska":29.4,"Nevada":37.36,"New Hampshire":38.91,"New Jersey":42.95,"New Mexico":45.9,"New York":48.65,"North Carolina":42.65,"North Dakota":32.18,"Ohio":40.18,"Oklahoma":34.02,"Oregon":42.48,"Pennsylvania":45.15,"Rhode Island":47.05,"South Carolina":42.76,"South Dakota":37.14,"Tennessee":47.08,"Texas":37.08,"Utah":24.65,"Vermont":46.11,"Virginia":40.59,"Washington":43.41,"West Virginia":48.41,"Wisconsin":41.13,"Wyoming":34.1},
            "republican": {"Alabama":47.65,"Alaska":39.46,"Arizona":38.47,"Arkansas":35.48,"California":32.61,"Colorado":35.87,"Connecticut":35.78,"Delaware":35.33,"District of Columbia":9.1,"Florida":40.89,"Georgia":42.88,"Hawaii":36.7,"Idaho":42.03,"Illinois":34.34,"Indiana":42.91,"Iowa":37.27,"Kansas":38.88,"Kentucky":41.34,"Louisiana":40.97,"Maine":30.39,"Maryland":35.63,"Massachusetts":29.02,"Michigan":36.38,"Minnesota":31.85,"Mississippi":49.68,"Missouri":33.92,"Montana":35.12,"Nebraska":46.6,"Nevada":34.73,"New Hampshire":37.69,"New Jersey":40.58,"New Mexico":37.34,"New York":31.34,"North Carolina":43.44,"North Dakota":44.22,"Ohio":38.35,"Oklahoma":42.65,"Oregon":32.53,"Pennsylvania":36.13,"Rhode Island":29.03,"South Carolina":46.99,"South Dakota":40.66,"Tennessee":42.43,"Texas":40.56,"Utah":43.36,"Vermont":30.42,"Virginia":44.97,"Washington":31.97,"West Virginia":35.39,"Wisconsin":36.78,"Wyoming":39.7},
            "tossup": {}
        },
        "1996": {
            "democratic": {"Alabama":43.16,"Alaska":33.27,"Arizona":46.52,"Arkansas":53.74,"California":51.1,"Colorado":44.43,"Connecticut":52.83,"Delaware":51.82,"District of Columbia":85.19,"Florida":48.02,"Georgia":45.84,"Hawaii":56.93,"Idaho":33.64,"Illinois":54.31,"Indiana":41.55,"Iowa":50.26,"Kansas":36.08,"Kentucky":45.84,"Louisiana":52.01,"Maine":51.62,"Maryland":54.25,"Massachusetts":61.47,"Michigan":51.69,"Minnesota":51.1,"Mississippi":44.08,"Missouri":47.54,"Montana":41.23,"Nebraska":34.95,"Nevada":43.93,"New Hampshire":49.32,"New Jersey":53.72,"New Mexico":49.18,"New York":59.47,"North Carolina":44.04,"North Dakota":40.13,"Ohio":47.38,"Oklahoma":40.45,"Oregon":47.15,"Pennsylvania":49.17,"Rhode Island":59.71,"South Carolina":43.96,"South Dakota":43.03,"Tennessee":48,"Texas":43.83,"Utah":33.3,"Vermont":53.35,"Virginia":45.15,"Washington":49.84,"West Virginia":51.5,"Wisconsin":48.81,"Wyoming":36.84},
            "republican": {"Alabama":50.12,"Alaska":50.8,"Arizona":44.29,"Arkansas":36.8,"California":38.21,"Colorado":45.8,"Connecticut":34.69,"Delaware":36.58,"District of Columbia":9.34,"Florida":42.32,"Georgia":47.01,"Hawaii":31.64,"Idaho":52.18,"Illinois":36.81,"Indiana":47.13,"Iowa":39.92,"Kansas":54.29,"Kentucky":44.88,"Louisiana":39.94,"Maine":30.76,"Maryland":38.27,"Massachusetts":28.08,"Michigan":38.48,"Minnesota":34.96,"Mississippi":49.21,"Missouri":41.24,"Montana":44.11,"Nebraska":53.66,"Nevada":42.91,"New Hampshire":39.37,"New Jersey":35.86,"New Mexico":41.86,"New York":30.61,"North Carolina":48.73,"North Dakota":46.94,"Ohio":41.02,"Oklahoma":48.26,"Oregon":39.06,"Pennsylvania":39.97,"Rhode Island":26.82,"South Carolina":49.79,"South Dakota":46.49,"Tennessee":45.59,"Texas":48.76,"Utah":54.37,"Vermont":31.09,"Virginia":47.1,"Washington":37.3,"West Virginia":36.76,"Wisconsin":38.48,"Wyoming":49.81},
            "tossup": {}
        },
        "2000": {
            "democratic": {"Alabama":41.57,"Alaska":27.67,"Arizona":44.73,"Arkansas":45.86,"California":53.45,"Colorado":42.39,"Connecticut":55.91,"Delaware":54.96,"District of Columbia":85.16,"Florida":48.84,"Georgia":42.98,"Hawaii":55.79,"Idaho":27.64,"Illinois":54.6,"Indiana":41.01,"Iowa":48.54,"Kansas":37.24,"Kentucky":41.37,"Louisiana":44.88,"Maine":49.09,"Maryland":56.57,"Massachusetts":59.8,"Michigan":51.28,"Minnesota":47.9,"Mississippi":40.7,"Missouri":47.08,"Montana":33.36,"Nebraska":33.25,"Nevada":45.98,"New Hampshire":46.8,"New Jersey":56.12,"New Mexico":47.91,"New York":60.21,"North Carolina":43.2,"North Dakota":33.06,"Ohio":46.46,"Oklahoma":38.43,"Oregon":46.96,"Pennsylvania":50.6,"Rhode Island":60.99,"South Carolina":40.9,"South Dakota":37.56,"Tennessee":47.28,"Texas":37.98,"Utah":26.34,"Vermont":50.63,"Virginia":44.44,"Washington":50.16,"West Virginia":45.59,"Wisconsin":47.83,"Wyoming":27.7},
            "republican": {"Alabama":56.48,"Alaska":58.62,"Arizona":51.02,"Arkansas":51.31,"California":41.65,"Colorado":50.75,"Connecticut":38.44,"Delaware":41.9,"District of Columbia":8.95,"Florida":48.85,"Georgia":54.67,"Hawaii":37.46,"Idaho":67.17,"Illinois":42.58,"Indiana":56.65,"Iowa":48.22,"Kansas":58.04,"Kentucky":56.5,"Louisiana":52.55,"Maine":43.97,"Maryland":40.18,"Massachusetts":32.5,"Michigan":46.15,"Minnesota":45.5,"Mississippi":57.62,"Missouri":50.42,"Montana":58.44,"Nebraska":62.24,"Nevada":49.52,"New Hampshire":48.07,"New Jersey":40.29,"New Mexico":47.85,"New York":35.23,"North Carolina":56.03,"North Dakota":60.66,"Ohio":49.97,"Oklahoma":60.31,"Oregon":46.52,"Pennsylvania":46.43,"Rhode Island":31.91,"South Carolina":56.84,"South Dakota":60.3,"Tennessee":51.15,"Texas":59.3,"Utah":66.83,"Vermont":40.7,"Virginia":52.47,"Washington":44.58,"West Virginia":51.92,"Wisconsin":47.61,"Wyoming":67.76},
            "tossup": {}
        },
        "2004": {
            "democratic": {"Alabama":36.84,"Alaska":35.52,"Arizona":44.4,"Arkansas":44.55,"California":54.3,"Colorado":47.02,"Connecticut":54.31,"Delaware":53.35,"District of Columbia":89.18,"Florida":47.09,"Georgia":41.37,"Hawaii":54.01,"Idaho":30.26,"Illinois":54.82,"Indiana":39.26,"Iowa":49.23,"Kansas":36.62,"Kentucky":39.69,"Louisiana":42.22,"Maine":53.57,"Maryland":55.91,"Massachusetts":61.94,"Michigan":51.23,"Minnesota":51.09,"Mississippi":39.76,"Missouri":46.1,"Montana":38.56,"Nebraska":32.68,"Nevada":47.88,"New Hampshire":50.24,"New Jersey":52.92,"New Mexico":49.05,"New York":58.37,"North Carolina":43.58,"North Dakota":35.5,"Ohio":48.71,"Oklahoma":34.43,"Oregon":51.35,"Pennsylvania":50.92,"Rhode Island":59.42,"South Carolina":40.9,"South Dakota":38.44,"Tennessee":42.53,"Texas":38.22,"Utah":26,"Vermont":58.94,"Virginia":45.48,"Washington":52.82,"West Virginia":43.2,"Wisconsin":49.7,"Wyoming":29.07},
            "republican": {"Alabama":62.46,"Alaska":61.07,"Arizona":54.87,"Arkansas":54.31,"California":44.36,"Colorado":51.69,"Connecticut":43.95,"Delaware":45.75,"District of Columbia":9.34,"Florida":52.1,"Georgia":57.97,"Hawaii":45.26,"Idaho":68.38,"Illinois":44.48,"Indiana":59.94,"Iowa":49.9,"Kansas":62,"Kentucky":59.55,"Louisiana":56.72,"Maine":44.58,"Maryland":42.93,"Massachusetts":36.78,"Michigan":47.81,"Minnesota":47.61,"Mississippi":59.45,"Missouri":53.3,"Montana":59.07,"Nebraska":65.9,"Nevada":50.47,"New Hampshire":48.87,"New Jersey":46.24,"New Mexico":49.84,"New York":40.08,"North Carolina":56.02,"North Dakota":62.86,"Ohio":50.81,"Oklahoma":65.57,"Oregon":47.19,"Pennsylvania":48.42,"Rhode Island":38.67,"South Carolina":57.98,"South Dakota":59.91,"Tennessee":56.8,"Texas":61.09,"Utah":71.54,"Vermont":38.8,"Virginia":53.68,"Washington":45.64,"West Virginia":56.06,"Wisconsin":49.32,"Wyoming":68.86},
            "tossup": {}
        },
        "2008": {
            "democratic": {"Alabama":38.74,"Alaska":37.89,"Arizona":45.12,"Arkansas":38.86,"California":61.01,"Colorado":53.66,"Connecticut":60.59,"Delaware":61.94,"District of Columbia":92.46,"Florida":51.03,"Georgia":46.99,"Hawaii":71.85,"Idaho":36.09,"Illinois":61.92,"Indiana":49.95,"Iowa":53.93,"Kansas":41.65,"Kentucky":41.17,"Louisiana":39.93,"Maine":57.71,"Maryland":61.92,"Massachusetts":61.8,"Michigan":57.43,"Minnesota":54.06,"Mississippi":43,"Missouri":49.29,"Montana":47.25,"Nebraska":41.6,"Nevada":55.15,"New Hampshire":54.13,"New Jersey":57.27,"New Mexico":56.91,"New York":62.88,"North Carolina":49.7,"North Dakota":44.62,"Ohio":51.5,"Oklahoma":34.35,"Oregon":56.75,"Pennsylvania":54.49,"Rhode Island":62.86,"South Carolina":44.9,"South Dakota":44.75,"Tennessee":41.83,"Texas":43.68,"Utah":34.41,"Vermont":67.46,"Virginia":52.63,"Washington":57.65,"West Virginia":42.59,"Wisconsin":56.22,"Wyoming":32.54},
            "republican": {"Alabama":60.32,"Alaska":59.42,"Arizona":53.64,"Arkansas":58.72,"California":36.95,"Colorado":44.71,"Connecticut":38.22,"Delaware":36.95,"District of Columbia":6.53,"Florida":48.22,"Georgia":52.2,"Hawaii":26.58,"Idaho":61.52,"Illinois":36.78,"Indiana":48.91,"Iowa":44.39,"Kansas":56.61,"Kentucky":57.4,"Louisiana":58.56,"Maine":40.38,"Maryland":36.47,"Massachusetts":35.99,"Michigan":40.96,"Minnesota":43.82,"Mississippi":56.18,"Missouri":49.43,"Montana":49.51,"Nebraska":56.53,"Nevada":42.65,"New Hampshire":44.52,"New Jersey":41.7,"New Mexico":41.78,"New York":36.03,"North Carolina":49.38,"North Dakota":53.25,"Ohio":46.91,"Oklahoma":65.65,"Oregon":40.4,"Pennsylvania":44.17,"Rhode Island":35.06,"South Carolina":53.87,"South Dakota":53.16,"Tennessee":56.9,"Texas":55.45,"Utah":62.58,"Vermont":30.45,"Virginia":46.33,"Washington":40.48,"West Virginia":55.71,"Wisconsin":42.31,"Wyoming":64.78},
            "tossup": {}
        }
    };
    
    // Pub/sub infrastructure for map status
    var ECStatus = function() {
        /* status
         * Public interface, aliased for convenience within this closure
         */
        var status = this;
        /* _status
         * Private state object
         *     stateVotes <object> - A collection describing the vote distribution
         *         for each state.
         *         {
         *             <state name>: {
         *                 dem: <number> - Number of electoral votes for the Democratic party
         *                 rep: <number> - Number of electoral votes for the Republican party
         *                 toss: <number> - Number of tossup electoral votes
         *             }
         *         }
         *    totals <object> - This value is calculated from the "stateVotes"
         *        objects each time it is modified.
         *        {
         *            dem: <number> - Number of electoral votes for the Democratic party
         *            rep: <number> - Number of electoral votes for the Republican party
         *            toss: <number> - Number of tossup electoral votes
         *        }
         */
        var _status = {
            stateVotes: {},
            totals: {}
        };
        var eventBus = $("<div>");
        var changedStates;
        
        /* on
         * Subscribe to map-related events.
         * Arguments:
         *   - eventName <string> An identifier for the type of event to listen for
         *     (see event types below)
         *   - handler <function> The function to be invoked when the event occurs.
         * Events types:
         *   - "change" - triggered any time the state of the map changes
         *   - "change:state" - triggered each time a state changes (note that when
         *      this event fires as part of a collection of concurrent state
         *      changes, the status of the map will be completely set BEFORE these
         *      events fire)
         */
        status.on = $.proxy(eventBus.bind, eventBus);
        /* off
         * Unsubscribe from map-related events
         * Arguments:
         *   - eventName <string> An identifier for the type of event to list for
         *   - handler <function> The function to be invoked when the event occurs.
         *     If unspecified, all events bound to the supplied event type will be
         *     unbound.
         * Event types:
         *   - (see listing in "on")
         */
        status.off = $.proxy(eventBus.unbind, eventBus);
        /* set
         * Set the status of the map. Re-calculates total vote counts; fires an
         * "change:state" event for each state followed by a single "change" event
         * neweStatus <object> - Describes the new status of the map
         *     year <number> - See description in "_status" above
         *     stateVotes <object> - See description in "_status" above
         */
        status.set = function(newStatus) {
            var idx, len;
            // Flag used to determine whether a "change" event should be fired at
            // the end of this method
            var hasChanged = false;
            
            if ("year" in newStatus) {
                _status.year = newStatus.year;
                hasChanged = true;
            }
            
            changedStates = {};
            
            if ("stateVotes" in newStatus) {
                // Identify and update changed states
                $.each(newStatus.stateVotes, function(stateName, newVotes) {
                    $.each(newVotes, function(partyName, newVoteCount) {
                        // Initialization case
                        if (!_status.stateVotes[stateName] ||
                            _status.stateVotes[stateName][partyName] !== newVoteCount) {
                            changedStates[stateName] = newVotes;
                            _status.stateVotes[stateName] = newVotes;
                            hasChanged = true;
                            return false;
                        }
                    });
                });
                
                // Re-calculate totals
                _status.totals.dem = _status.totals.rep = _status.totals.toss = 0;
                $.each(_status.stateVotes, function(stateName, voteCounts) {
                    _status.totals.dem += voteCounts.dem || 0;
                    _status.totals.rep += voteCounts.rep || 0;
                    _status.totals.toss += voteCounts.toss || 0;
                });
                
                // Now that the totals are re-calculated, trigger an change event
                // for each state
                $.each(changedStates, function(stateName, votes) {
                    eventBus.trigger("change:state", {
                        name: stateName,
                        dem: votes.dem,
                        rep: votes.rep,
                        toss: votes.toss
                    });
                });
            }
            
            if (hasChanged) {
                eventBus.trigger("change", status.get());
            }
        };
        status.reset = function() {
            // Flag used to determine whether a "change" event should be fired at
            // the end of this method
            var hasChanged = false;
            
            if ("year" in _status) {
                delete _status.year;
                hasChanged = true;
            }
            
            if (_status.stateVotes) {
                
                changedStates = $.extend(true, {}, _status.stateVotes);
                
                $.each(_status.stateVotes, function(stateName, votes) {
                    hasChanged = true;
                    delete _status.stateVotes[stateName];
                });
                
                _status.totals.dem = _status.totals.rep = _status.totals.toss = 0;
                
                $.each(changedStates, function(stateName, votes) {
                    eventBus.trigger("change:state", {
                        name: stateName,
                        dem: 0,
                        rep: 0,
                        toss: 0
                    });
                });
            }
            
            if (hasChanged) {
                eventBus.trigger("change", status.get());
            }
        };
        /* changedStates
         * If any states were changed in the most recent call to "set", this method
         * will return the vote distribution of those states (formatted in the same
         * manner as "status.stateVotes"). If no states were changed, this
         * method will return false
         */
        status.changedStates = function() {
            var hasStates = false;
            
            if (changedStates) {
                $.each(changedStates, function() {
                    hasStates = true;
                    return false;
                });
            }
            
            if (!hasStates) {
                return false;
            } else {
                return changedStates;
            }
        };
        /* get
         * Create a copy of the map state
         */
        status.get = function() {
            return $.extend(true, {}, _status);
        };
        /* modifyVotes
         * A convenience method for modifying the distribution of votes within
         * states, relative to their current value.
         */
        status.modifyVotes = function(stateVoteDeltas) {
            var statesVotes = status.get().stateVotes;
            
            $.each(stateVoteDeltas, function(stateName, voteDelta) {
                var stateVotes = statesVotes[stateName];
                
                stateVotes.dem += voteDelta.dem || 0;
                stateVotes.rep += voteDelta.rep || 0;
                stateVotes.toss += voteDelta.toss || 0;
            });
            
            status.set({ stateVotes: statesVotes });
        };
    };
    var ecMap = new ECStatus();
    
    // Are we just showing historical results with historical elector counts,
    // or are we showing a calculator with 2012 elector counts that people
    // can customize? To find out, let's see if there are options in a
    // dropdown menu (i.e., past election years); if not, assume we're in a
    // calculator.
    if ($('#view_tab_more_menu .view_tab_option').length == 0) {
        var calculatorActive = true;
    } else {
        var calculatorActive = false;
    }
    
    // Show in the sidebar which candidate has gathered enough electoral votes
    // to win the election.
    var indicateWin = function(republican, democratic, tossup) {
        $('.ec_win').hide();
        $('.ec_detail').removeClass('ec_detail_win');
        
        $('#ec_total_d').text(democratic);
        $('#ec_total_r').text(republican);
        $('#ec_total_t').text(tossup);
        
        if (democratic >= 270) {
            $('#ec_win_d').show();
            $('#ec_detail_d').addClass('ec_detail_win');
        } else if (republican >= 270) {
            $('#ec_win_r').show();
            $('#ec_detail_r').addClass('ec_detail_win');
        } else if (tossup >= 270) {
            $('#ec_win_t').show();
            $('#ec_detail_t').addClass('ec_detail_win');
        }
    };
    ecMap.on("change", function(event, status) {
        indicateWin(status.totals.rep, status.totals.dem, status.totals.toss);
    });
    
    // Color a state when it is updated.
    ecMap.on("change:state", function(event, status) {
        if (status.rep > 0 && status.dem == 0 && status.toss == 0) {
            nhmc.ctrl.setStateColors([status.name], 'red');
        } else if (status.rep == 0 && status.dem > 0 && status.toss == 0) {
            nhmc.ctrl.setStateColors([status.name], 'blue');
        } else if (status.rep == 0 && status.dem == 0 && status.toss > 0) {
            nhmc.ctrl.setStateColors([status.name], 'yellow');
        } else if (status.rep > 0 && status.dem > 0 && status.toss == 0) {
            nhmc.ctrl.setStateColors([status.name], 'purple');
        } else if (status.rep > 0 && status.dem == 0 && status.toss > 0) {
            nhmc.ctrl.setStateColors([status.name], 'orange');
        } else if (status.rep == 0 && status.dem > 0 && status.toss > 0) {
            nhmc.ctrl.setStateColors([status.name], 'green');
        } else if (status.rep == 0 && status.dem == 0 && status.toss == 0) {
            nhmc.ctrl.setStateColors([status.name], 'default');
        } else {
            nhmc.ctrl.setStateColors([status.name], 'gray');
        }
    });
    
    // Given a year, display the electoral vote for that year in terms of the
    // number of electoral votes each state would have cast in that year.
    var setElectoralVote = function(year) {
        // Clean up arguments
        year = year.toString();  // Just in case
        
        // Color states that are defined as all going to one party or another
        nhmc.cleanup.clearPathColors();
        nhmc.ctrl.setStateColors(electoralVotes[year].republican, 'red');
        nhmc.ctrl.setStateColors(electoralVotes[year].democratic, 'blue');
        nhmc.ctrl.setStateColors(electoralVotes[year].tossup, 'yellow');
        
        // Start creating the new status object
        var newStatus = {
            year: year,
            stateVotes: {},
            totals: {
                rep: 0,
                dem: 0,
                toss: 0
            }
        };
        for (var stateName in nhmc.geo.usGeo) {
            newStatus.stateVotes[stateName] = {
                rep: 0,
                dem: 0,
                toss: 0
            };
        }
        
        // Total up the votes for each party from non-split states, and add
        // an object for each state to newStatus.stateVotes.
        var votesThisYear = electoralVotes[year].states;
        for (i = 0; i < electoralVotes[year].republican.length; i++) {
            var stateName = electoralVotes[year].republican[i];
            newStatus.stateVotes[stateName] = {
                rep: votesThisYear[stateName],
                dem: 0,
                toss: 0
            };
            newStatus.totals.rep += votesThisYear[stateName];
        }
        for (i = 0; i < electoralVotes[year].democratic.length; i++) {
            var stateName = electoralVotes[year].democratic[i];
            newStatus.stateVotes[stateName] = {
                rep: 0,
                dem: votesThisYear[stateName],
                toss: 0
            };
            newStatus.totals.dem += votesThisYear[stateName];
        }
        for (i = 0; i < electoralVotes[year].tossup.length; i++) {
            var stateName = electoralVotes[year].tossup[i];
            newStatus.stateVotes[stateName] = {
                rep: 0,
                dem: 0,
                toss: votesThisYear[stateName]
            };
            newStatus.totals.toss += votesThisYear[stateName];
        }
        
        // Go through each state. If it's got its own key in
        // electoralVotes[year], then we haven't included it in the
        // status object yet.
        for (var stateName in electoralVotes[year].states) {
            var stateVotes = electoralVotes[year][stateName];
            if (stateVotes) {
                // Add state's votes to the total and add an object to
                // newStatus.stateVotes.
                newStatus.totals.rep += stateVotes.republican;
                newStatus.totals.dem += stateVotes.democratic;
                newStatus.totals.toss += stateVotes.tossup;
                newStatus.stateVotes[stateName] = {
                    rep: stateVotes.republican,
                    dem: stateVotes.democratic,
                    toss: stateVotes.tossup
                };
            }
        }
        
        // Set the candidate names in the sidebar.
        $('#ec_name_d').text(candidateNames[year].democratic);
        $('#ec_name_r').text(candidateNames[year].republican);
        if (candidateNames[year].tossup) {
            $('#ec_name_t').text(candidateNames[year].tossup);
        } else {
            $('#ec_name_t').text('Tossup');
        }
        
        // Set the new status.
        ecMap.set(newStatus);
    };
    
    // Event handler for clicking on a tab (or tab sub-option) listing a year
    // to show. This obviously won't bind to any menu options if they don't
    // exist, so checking that calculatorActive is false would be redundant.
    $('#view_tabs').delegate('.view_tab_option', 'click', function() {
        // Render the map with the electoral vote in whatever year is listed
        // in the tab that just got clicked.
        setElectoralVote($(this).text());
    });
    
    // Event handlers and such for the calculator, or tooltip handers for the
    // historical results
    if (calculatorActive) {
        // Grab a copy of the current status.
        var currentStatus = ecMap.get();
        if (typeof(currentStatus.totals.dem) == 'undefined') {
            // There's no actual status object for us to manipulate. Let's put
            // together a dummy one.
            currentStatus.totals = {
                rep: 0,
                dem: 0,
                toss: 0
            };
            for (var stateName in nhmc.geo.usGeo) {
                currentStatus.stateVotes[stateName] = {
                    rep: 0,
                    dem: 0,
                    toss: 0
                };
            }
            ecMap.set(currentStatus);
        }
        
        // Prep the dialogs for splitting states, including 
        // pre-selecting the currently shown choices.
        $([
            '<div id="nebraska_electoral" title="Choose Nebraska\'s votes">',
                '<p>',
                '<label for="nebraska_popular">Popular vote (worth 3):</label>',
                '<select id="nebraska_popular">',
                    '<option value="r">Republican</option>',
                    '<option value="d">Democratic</option>',
                    '<option value="t">Tossup</option>',
                    '<option value="u">Undecided</option>',
                '</select>',
                '</p>',
                '<p>',
                '<label for="nebraska_4">Fourth vote:</label>',
                '<select id="nebraska_4">',
                    '<option value="r">Republican</option>',
                    '<option value="d">Democratic</option>',
                    '<option value="t">Tossup</option>',
                    '<option value="u">Undecided</option>',
                '</select>',
                '</p>',
                '<p>',
                '<label for="nebraska_5">Fifth vote:</label>',
                '<select id="nebraska_5">',
                    '<option value="r">Republican</option>',
                    '<option value="d">Democratic</option>',
                    '<option value="t">Tossup</option>',
                    '<option value="u">Undecided</option>',
                '</select>',
                '</p>',
            '</div>'
        ].join('')).dialog({
            autoOpen: false,
            beforeClose: function(e, ui) {
                $('#nebraska_popular').unbind('change');
                $('#nebraska_4').unbind('change');
                $('#nebraska_5').unbind('change');
            },
            resizable: false,
            width: $('body').width() >= 375 ? 350 : 250
        });
        nhmc.cleanup.futureGarbage.push($('#nebraska_electoral'));
        nhmc.cleanup.activeDialogs.push($('#nebraska_electoral'));
        var neVote = currentStatus.stateVotes["Nebraska"];
        $('#nebraska_popular').val('u');
        $('#nebraska_4').val('u');
        $('#nebraska_5').val('u');
        $([
            '<div id="maine_electoral" title="Choose Maine\'s votes">',
                '<p>',
                '<label for="maine_popular">Popular vote (worth 3):</label>',
                '<select id="maine_popular">',
                    '<option value="r">Republican</option>',
                    '<option value="d">Democratic</option>',
                    '<option value="t">Tossup</option>',
                    '<option value="u">Undecided</option>',
                '</select>',
                '</p>',
                '<p>',
                '<label for="maine_4">Fourth vote:</label>',
                '<select id="maine_4">',
                    '<option value="r">Republican</option>',
                    '<option value="d">Democratic</option>',
                    '<option value="t">Tossup</option>',
                    '<option value="u">Undecided</option>',
                '</select>',
                '</p>',
            '</div>'
        ].join('')).dialog({
            autoOpen: false,
            beforeClose: function(e, ui) {
                $('#maine_popular').unbind('change');
                $('#maine_4').unbind('change');
            },
            height: 170,
            resizable: false,
            width: 400
        });
        nhmc.cleanup.futureGarbage.push($('#maine_electoral'));
        nhmc.cleanup.activeDialogs.push($('#maine_electoral'));
        var meVote = currentStatus.stateVotes["Maine"];
        $('#maine_popular').val('u');
        $('#maine_4').val('u');
        $('#maine_5').val('u');
        
        attachStateClickHandlers();
    } else {
        var tooltipFormatter = function(thisState) {
            var thisYear = $('#view_tab_more_shown').text();
            var tooltipText = '<h2>' + thisState + '</h2>';
            
            // Electoral votes allotted and cast
            tooltipText += '<h3>' + electoralVotes[thisYear].states[thisState] + ' electoral votes</h3><table>';
            if (electoralVotes[thisYear][thisState]) {
                var parties = ['republican', 'democratic', 'tossup'];
                parties.sort(function(a, b) {
                    return electoralVotes[thisYear][thisState][b] - electoralVotes[thisYear][thisState][a];
                });
                for (var i = 0, length = parties.length; i < length; i++) {
                    var party = parties[i];
                    if (electoralVotes[thisYear][thisState][party] > 0) {
                        tooltipText += '<tr><td class="tooltip-candidate-name">' + candidateNames[thisYear][party] + '</td><td class="tooltip-candidate-votes">' + electoralVotes[thisYear][thisState][party] + '</td></tr>';
                    }
                }
            } else {
                tooltipText += '<tr><td class="tooltip-candidate-name">';
                if (electoralVotes[thisYear].republican.indexOf(thisState) != -1) {
                    tooltipText += candidateNames[thisYear].republican;
                } else if (electoralVotes[thisYear].democratic.indexOf(thisState) != -1) {
                    tooltipText += candidateNames[thisYear].democratic;
                } else {
                    tooltipText += candidateNames[thisYear].tossup;
                }
                tooltipText += '</td><td class="tooltip-candidate-votes">' + electoralVotes[thisYear].states[thisState] + '</td></tr>';
            }
            tooltipText += '</table>';
            
            // Popular vote if available
            if (popularVotes[thisYear]) {
                tooltipText += '<h3>Popular vote</h3><table>';
                
                var parties = ['republican', 'democratic', 'tossup'];
                parties.sort(function(a, b) {
                    return popularVotes[thisYear][b][thisState] - popularVotes[thisYear][a][thisState];
                });
                
                for (var i = 0, length = parties.length; i < length; i++) {
                    var party = parties[i];
                    var candidateName = candidateNames[thisYear][party];
                    var partyVotes = popularVotes[thisYear][party][thisState];
                    if (partyVotes > 0) {
                        tooltipText += '<tr><td class="tooltip-candidate-name">' + candidateName + '</td><td class="tooltip-candidate-votes">' + partyVotes.toFixed(2) + '%</td></tr>';
                    } else if (popularVotes[thisYear][parties[0]][thisState] == 0) {
                        tooltipText += '<tr><td colspan="2">Not available</td></tr>';
                        break;
                    }
                }
                
                tooltipText += '</table>';
            }
            
            return tooltipText;
        };
        
        nhmc.tooltips.render = function() {
            $('#tooltip').remove();
            
            var thisState = this.nhmcData.state;
            
            if (flyoutsEnabled) {
                this.setStroke({
                    color: '#000000',
                    width: 3
                });
                this.moveToFront();
            }
            
            $('body').append('<div id="tooltip"' + (flyoutsEnabled ? ' class="tooltip_flyout"' : '') + '>' + tooltipFormatter(thisState) + '</div>');
            if (Modernizr.touch) {nhmc.tooltips.addClose();}
        };
        if (flyoutsEnabled) {
            nhmc.tooltips.destroy = function() {
                $('#tooltip').remove();
                for (var i = 0, length = nhmc.surface.children.length; i < length; i++) {
                    var child = nhmc.surface.children[i];
                    if (typeof(child.nhmcData) != 'undefined') {
                        child.setStroke(nhmc.config.defaultAttributes.stroke);
                    }
                }
            };
        }
        if (nhmc.tooltips.hoverHandlerTokens.length == 0) {
            nhmc.tooltips.init();
        }
    }

    /* attachStateClickHandlers
     * Iterate through each state and attach the appropriate click handlers
     */
    function attachStateClickHandlers() {
        // Define click handlers
        var nebraskaHandler = function(e) {
            $('#nebraska_electoral').dialog('open');
            
            // Update dialog to reflect current status
            var neVote = ecMap.get().stateVotes["Nebraska"];
            if (neVote.rep >= 3) {
                $('#nebraska_popular').val('r');
                neVote.rep -= 3;
            } else if (neVote.dem >= 3) {
                $('#nebraska_popular').val('d');
                neVote.dem -= 3;
            } else if (neVote.toss >= 3) {
                $('#nebraska_popular').val('t');
                neVote.toss -= 3;
            } else {
                $('#nebraska_popular').val('u');
            }
            if (neVote.rep > 0) {
                $('#nebraska_4').val('r');
                neVote.rep -= 1;
            } else if (neVote.dem > 0) {
                $('#nebraska_4').val('d');
                neVote.dem -= 1;
            } else if (neVote.toss > 0) {
                $('#nebraska_4').val('t');
                neVote.toss -= 1;
            } else {
                $('#nebraska_4').val('u');
            }
            if (neVote.rep > 0) {
                $('#nebraska_5').val('r');
                neVote.rep -= 1;
            } else if (neVote.dem > 0) {
                $('#nebraska_5').val('d');
                neVote.dem -= 1;
            } else if (neVote.toss > 0) {
                $('#nebraska_5').val('t');
                neVote.toss -= 1;
            } else {
                $('#nebraska_5').val('u');
            }
            
            var updateNebraska = function() {
                var oldVotes = ecMap.get().stateVotes["Nebraska"];
                
                // Figure out new votes.
                var newVotes = {
                    rep: 0,
                    dem: 0,
                    toss: 0
                };
                switch ($('#nebraska_popular').val()) {
                    case 'r':
                        newVotes.rep += 3;
                        break;
                    case 'd':
                        newVotes.dem += 3;
                        break;
                    case 't':
                        newVotes.toss += 3;
                        break;
                    default:  // do nothing
                        break;
                }
                switch ($('#nebraska_4').val()) {
                    case 'r':
                        newVotes.rep += 1;
                        break;
                    case 'd':
                        newVotes.dem += 1;
                        break;
                    case 't':
                        newVotes.toss += 1;
                        break;
                    default:  // do nothing
                        break;
                }
                switch ($('#nebraska_5').val()) {
                    case 'r':
                        newVotes.rep += 1;
                        break;
                    case 'd':
                        newVotes.dem += 1;
                        break;
                    case 't':
                        newVotes.toss += 1;
                        break;
                    default:  // do nothing
                        break;
                }
                
                // Figure out vote deltas.
                var stateVoteDeltas = {};
                stateVoteDeltas["Nebraska"] = {
                    rep: newVotes.rep - oldVotes.rep,
                    dem: newVotes.dem - oldVotes.dem,
                    toss: newVotes.toss - oldVotes.toss
                };
                
                // Update the map.
                ecMap.modifyVotes(stateVoteDeltas);
            };
            
            $('#nebraska_popular').change(updateNebraska);
            $('#nebraska_4').change(updateNebraska);
            $('#nebraska_5').change(updateNebraska);
        };
        var maineHandler = function(e) {
            $('#maine_electoral').dialog('open');
            
            // Update dialog to reflect current status
            var meVote = ecMap.get().stateVotes["Maine"];
            if (meVote.rep >= 3) {
                $('#maine_popular').val('r');
                meVote.rep -= 3;
            } else if (meVote.dem >= 3) {
                $('#maine_popular').val('d');
                meVote.dem -= 3;
            } else if (meVote.toss >= 3) {
                $('#maine_popular').val('t');
                meVote.toss -= 3;
            } else {
                $('#maine_popular').val('u');
            }
            if (meVote.rep > 0) {
                $('#maine_4').val('r');
                meVote.rep -= 1;
            } else if (meVote.dem > 0) {
                $('#maine_4').val('d');
                meVote.dem -= 1;
            } else if (meVote.toss > 0) {
                $('#maine_4').val('t');
                meVote.toss -= 1;
            } else {
                $('#maine_4').val('u');
            }
            
            var updateMaine = function() {
                var oldVotes = ecMap.get().stateVotes["Maine"];
                
                // Figure out new votes.
                var newVotes = {
                    rep: 0,
                    dem: 0,
                    toss: 0
                };
                switch ($('#maine_popular').val()) {
                    case 'r':
                        newVotes.rep += 3;
                        break;
                    case 'd':
                        newVotes.dem += 3;
                        break;
                    case 't':
                        newVotes.toss += 3;
                        break;
                    default:  // do nothing
                        break;
                }
                switch ($('#maine_4').val()) {
                    case 'r':
                        newVotes.rep += 1;
                        break;
                    case 'd':
                        newVotes.dem += 1;
                        break;
                    case 't':
                        newVotes.toss += 1;
                        break;
                    default:  // do nothing
                        break;
                }
                
                // Figure out vote deltas.
                var stateVoteDeltas = {};
                stateVoteDeltas["Maine"] = {
                    rep: newVotes.rep - oldVotes.rep,
                    dem: newVotes.dem - oldVotes.dem,
                    toss: newVotes.toss - oldVotes.toss
                };
                
                // Update the map.
                ecMap.modifyVotes(stateVoteDeltas);
            };
            
            $('#maine_popular').change(updateMaine);
            $('#maine_4').change(updateMaine);
        };
        var genericHandler = function(e) {
            var stateName = this.nhmcData.state;
            var votesInPrediction = electoralVotes['2012'].states[stateName];
            var stateVotes = ecMap.get().stateVotes[stateName];
            
            if (stateVotes.rep > 0 && stateVotes.dem == 0 && stateVotes.toss == 0) {
                var stateVoteDeltas = {};
                stateVoteDeltas[stateName] = {
                    rep: -votesInPrediction,
                    dem: votesInPrediction,
                    toss: 0
                };
                ecMap.modifyVotes(stateVoteDeltas);
            } else if (stateVotes.rep == 0 && stateVotes.dem > 0 && stateVotes.toss == 0) {
                var stateVoteDeltas = {};
                stateVoteDeltas[stateName] = {
                    rep: 0,
                    dem: -votesInPrediction,
                    toss: votesInPrediction
                };
                ecMap.modifyVotes(stateVoteDeltas);
            } else if (stateVotes.rep == 0 && stateVotes.dem == 0 && stateVotes.toss > 0) {
                var stateVoteDeltas = {};
                stateVoteDeltas[stateName] = {
                    rep: 0,
                    dem: 0,
                    toss: -votesInPrediction
                };
                ecMap.modifyVotes(stateVoteDeltas);
            } else {
                var stateVoteDeltas = {};
                stateVoteDeltas[stateName] = {
                    rep: votesInPrediction,
                    dem: 0,
                    toss: 0
                };
                ecMap.modifyVotes(stateVoteDeltas);
            }
        };
        
        // Attach click handlers
        for (var stateName in nhmc.geo.usGeo) {
            if (stateName == 'Nebraska') {
                var eventToken = nhmc.geo.usGeo['Nebraska'].statePath.connect(
                    'onclick',
                    nhmc.geo.usGeo['Nebraska'].statePath,
                    nebraskaHandler
                );
                nhmc.cleanup.clickHandlerTokens.push(eventToken);
            } else if (stateName == 'Maine') {
                var eventToken = nhmc.geo.usGeo['Maine'].statePath.connect(
                    'onclick',
                    nhmc.geo.usGeo['Maine'].statePath,
                    maineHandler
                );
                nhmc.cleanup.clickHandlerTokens.push(eventToken);
            } else {
                var eventToken = nhmc.geo.usGeo[stateName].statePath.connect(
                    'onclick',
                    nhmc.geo.usGeo[stateName].statePath,
                    genericHandler
                );
                nhmc.cleanup.clickHandlerTokens.push(eventToken);
            }
        }
    }
    /* detachStateClickHandlers
     * Remove all click handlers bound to state elements and clean up
       references to their tokens.
     */
    function detachStateClickHandlers() {
        nhmc.cleanup.clearClickHandlers();
    }
    
    // Map status encoding in fragment identifier
    var compressStateVotes = function(stateVotes) {
        // Useful definitions
        var threeToOne = {
            "000": "0", "001": "1", "002": "2", "003": "3", "010": "4",
            "011": "5", "012": "6", "013": "7", "020": "8", "021": "9",
            "022": "a", "023": "b", "030": "c", "031": "d", "032": "e",
            "033": "f", "100": "g", "101": "h", "102": "i", "103": "j",
            "110": "k", "111": "l", "112": "m", "113": "n", "120": "o",
            "121": "p", "122": "q", "123": "r", "130": "s", "131": "t",
            "132": "u", "133": "v", "200": "w", "201": "x", "202": "y",
            "203": "z", "210": "A", "211": "B", "212": "C", "213": "D",
            "220": "E", "221": "F", "222": "G", "223": "H", "230": "I",
            "231": "J", "232": "K", "233": "L", "300": "M", "301": "N",
            "302": "O", "303": "P", "310": "Q", "311": "R", "312": "S",
            "313": "T", "320": "U", "321": "V", "322": "W", "323": "X",
            "330": "Y", "331": "Z", "332": "+", "333": "-"
        };
        var digitChoices = {
            "empty": "0",
            "rep": "1",
            "dem": "2",
            "toss": "3"
        };
        
        // State storage
        var compressedParts = [];
        var currentDigitGroup = '';
        
        // Go through each state in order
        var stateNames = Object.keys(nhmc.geo.usGeo).sort();
        for (var i = 0, length = stateNames.length; i < length; i++) {
            var stateName = stateNames[i];
            // Copy the thisState object so we can modify it without affecting
            // the original
            var thisState = $.extend({}, stateVotes[stateName]);
            
            // Add digits to currentDigitGroup--one for each state, except for
            // Maine and Nebraska, which can split votes and therefore will
            // have a seperate digit for each independently assignable group of
            // electoral votes
            if (stateName == 'Maine') {
                // Add winner of popular vote
                if (thisState.rep >= 3) {
                    currentDigitGroup += digitChoices.rep;
                    thisState.rep -= 3;
                } else if (thisState.dem >= 3) {
                    currentDigitGroup += digitChoices.dem;
                    thisState.dem -= 3;
                } else if (thisState.toss >= 3) {
                    currentDigitGroup += digitChoices.toss;
                    thisState.toss -= 3;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
                
                // Add winner of fourth district
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
            } else if (stateName == 'Nebraska') {
                // Add winner of popular vote
                if (thisState.rep >= 3) {
                    currentDigitGroup += digitChoices.rep;
                    thisState.rep -= 3;
                } else if (thisState.dem >= 3) {
                    currentDigitGroup += digitChoices.dem;
                    thisState.dem -= 3;
                } else if (thisState.toss >= 3) {
                    currentDigitGroup += digitChoices.toss;
                    thisState.toss -= 3;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
                
                // Add winner of fourth district
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                    thisState.rep -= 1;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                    thisState.dem -= 1;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                    thisState.toss -= 1;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
                
                // Add winner of fifth district
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
            } else {
                if (thisState.rep > 0) {
                    currentDigitGroup += digitChoices.rep;
                } else if (thisState.dem > 0) {
                    currentDigitGroup += digitChoices.dem;
                } else if (thisState.toss > 0) {
                    currentDigitGroup += digitChoices.toss;
                } else {
                    currentDigitGroup += digitChoices.empty;
                }
            }
            
            // Three digits can be compressed at a time, so if we have at least
            // three digits ready to go, compress the first three and get them
            // out of the way.
            if (currentDigitGroup.length < 3) {
                continue;
            } else if (currentDigitGroup.length > 3) {
                compressedParts.push(threeToOne[
                    currentDigitGroup.substring(0, 3)
                ]);
                currentDigitGroup = currentDigitGroup.substring(3);
            } else {
                compressedParts.push(threeToOne[currentDigitGroup]);
                currentDigitGroup = '';
            }
        }
        
        // If there are any remaining digits to compress (i.e., there wasn't an
        // exact multiple of three), pad this last three-digit group with empty
        // digits, compress it and get it out of the way.
        if (currentDigitGroup.length > 0) {
            for (var i = currentDigitGroup.length; i < 3; i++) {
                currentDigitGroup += digitChoices.empty;
            }
            compressedParts.push(threeToOne[currentDigitGroup]);
            currentDigitGroup = '';
        }
        
        // That should take care of it!
        return compressedParts.join('');
    };
    var expandStateVotes = function(compressed) {
        // Useful definitions
        var oneToThree = {
            "0": "000", "1": "001", "2": "002", "3": "003", "4": "010",
            "5": "011", "6": "012", "7": "013", "8": "020", "9": "021",
            "a": "022", "b": "023", "c": "030", "d": "031", "e": "032",
            "f": "033", "g": "100", "h": "101", "i": "102", "j": "103",
            "k": "110", "l": "111", "m": "112", "n": "113", "o": "120",
            "p": "121", "q": "122", "r": "123", "s": "130", "t": "131",
            "u": "132", "v": "133", "w": "200", "x": "201", "y": "202",
            "z": "203", "A": "210", "B": "211", "C": "212", "D": "213",
            "E": "220", "F": "221", "G": "222", "H": "223", "I": "230",
            "J": "231", "K": "232", "L": "233", "M": "300", "N": "301",
            "O": "302", "P": "303", "Q": "310", "R": "311", "S": "312",
            "T": "313", "U": "320", "V": "321", "W": "322", "X": "323",
            "Y": "330", "Z": "331", "+": "332", "-": "333"
        };
        var digitChoices = {
            "0": "empty",
            "1": "rep",
            "2": "dem",
            "3": "toss"
        };
        
        // State storage
        var decompressed = [];
        var stateVotes = {};
        
        // Decompress the argument into its original three-digit groups.
        for (var i = 0, length = compressed.length; i < length; i++) {
            decompressed.push(oneToThree[compressed.charAt(i)]);
        }
        decompressed = decompressed.join('');
        
        // Go through each state in order. Because we're using the state names
        // for the main loop, any padding digits at the end of the decompressed
        // string will simply (and safely) be ignored.
        var stateNames = Object.keys(nhmc.geo.usGeo).sort();
        var decompressedIndex = 0;
        var decompressedLength = decompressed.length;
        if (decompressedLength < (stateNames.length + 3)) {
            // If there aren't enough digits in the decompressed string to
            // figure out each state (including the extra district in Maine and
            // the two extra districts in Nebraska), don't bother with the
            // rest; return an empty object instead so we know something went
            // wrong.
            return {};
        }
        for (var i = 0, length = stateNames.length; i < length; i++) {
            var stateName = stateNames[i];
            stateVotes[stateName] = {
                "rep": 0,
                "dem": 0,
                "toss": 0
            };
            
            if (stateName == 'Maine') {
                // Handle Maine's popular vote.
                var popularVote = digitChoices[
                    decompressed.charAt(decompressedIndex)
                ];
                if (popularVote != 'empty') {
                    stateVotes[stateName][popularVote] += 3;
                } else if (popularVote == null) {
                    // Also works for undefined (not checking strict equality).
                    // If popularVote doesn't make sense, return an empty
                    // object so we know something went wrong.
                    return {};
                }
                // Handle Maine's fourth district.
                var fourthDistrict = digitChoices[
                    decompressed.charAt(decompressedIndex + 1)
                ];
                if (fourthDistrict != 'empty') {
                    stateVotes[stateName][fourthDistrict] += 1;
                } else if (fourthDistrict == null) {
                    return {};
                }
                decompressedIndex += 2;
            } else if (stateName == 'Nebraska') {
                // Handle Nebraska's popular vote.
                var popularVote = digitChoices[
                    decompressed.charAt(decompressedIndex)
                ];
                if (popularVote != 'empty') {
                    stateVotes[stateName][popularVote] += 3;
                } else if (popularVote == null) {
                    return {};
                }
                // Handle Nebraska's fourth district.
                var fourthDistrict = digitChoices[
                    decompressed.charAt(decompressedIndex + 1)
                ];
                if (fourthDistrict != 'empty') {
                    stateVotes[stateName][fourthDistrict] += 1;
                } else if (fourthDistrict == null) {
                    return {};
                }
                // Handle Nebraska's fifth district.
                var fifthDistrict = digitChoices[
                    decompressed.charAt(decompressedIndex + 2)
                ];
                if (fifthDistrict != 'empty') {
                    stateVotes[stateName][fifthDistrict] += 1;
                } else if (fifthDistrict == null) {
                    return {};
                }
                decompressedIndex += 3;
            } else {
                var stateVote = digitChoices[
                    decompressed.charAt(decompressedIndex)
                ];
                var stateElectoralVotes = electoralVotes["2012"].states[stateName];
                if (stateVote != 'empty') {
                    stateVotes[stateName][stateVote] += stateElectoralVotes;
                } else if (stateVote == null) {
                    return {};
                }
                decompressedIndex += 1;
            }
        }
        
        return stateVotes;
    };
    var parseHash = function() {
        var hashState = nhmc.ctrl.hashParams()['states'];
        var currentState = compressStateVotes(ecMap.get().stateVotes);
        if (typeof(hashState) != 'undefined' && hashState != currentState) {
            var stateVotes = expandStateVotes(hashState);
            if (!$.isEmptyObject(stateVotes)) {
                ecMap.set({stateVotes: stateVotes});
            }
        }
    };
    
    // Let's kick things off!
    if (calculatorActive) {
        // Update fragment identifier every time map status changes
        ecMap.on("change", function(event, status) {
            nhmc.ctrl.hashParams({
                "states": compressStateVotes(status.stateVotes)
            });
        });
        parseHash();
        if ('onhashchange' in window) {
            $(window).bind('hashchange', parseHash);
        }
        
        // Show an attribution for the AP's projection when it is the current
        // map state.
        var apCompressed = $('#use-ap-projections').attr('href');
        apCompressed = apCompressed.substring(apCompressed.indexOf('=') + 1);
        ecMap.on("change", function(event, status) {
            var currentView = nhmc.ctrl.hashParams()["states"];
            if (currentView == apCompressed) {
                $('#ap_projection_attribution').css('visibility', 'visible');
            } else {
                $('#ap_projection_attribution').css('visibility', 'hidden');
            }
        });
        var currentView = nhmc.ctrl.hashParams()["states"];
        if (currentView && currentView == apCompressed) {
            $('#ap_projection_attribution').css('visibility', 'visible');
        }
    } else {
        $('.view_tab_active .view_tab_option').first().click();
    }
});
