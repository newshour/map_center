$(document).ready(function() {
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
            "thirdParty": []
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
            "thirdParty": []
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
            "thirdParty": ["Alabama", "Georgia", "Louisiana", "Mississippi"],
            "North Carolina": {
                "republican": 12,
                "democratic": 0,
                "thirdParty": 1
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
                "thirdParty": 1
            },
            "republican": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
            "democratic": ["District of Columbia", "Massachusetts"],
            "thirdParty": [],
            "Virginia": {
                "republican": 11,
                "democratic": 0,
                "thirdParty": 1
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
            "thirdParty": [],
            "Washington": {
                "republican": 8,
                "democratic": 0,
                "thirdParty": 0
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
            "thirdParty": []
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
            "thirdParty": []
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
            "thirdParty": []
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
            "thirdParty": []
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
            "thirdParty": []
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
            "thirdParty": [], 
            "District of Columbia": {
                "republican": 0,
                "democratic": 2,
                "thirdParty": 0
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
            "thirdParty": [],
            "Minnesota": {
                "republican": 0,
                "democratic": 9,
                "thirdParty": 0
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
            "thirdParty": [],
            "Nebraska": {
                "republican": 4,
                "democratic": 1,
                "thirdParty": 0
            }
        }
    };

    $('#displays').append('<li id="electoral_college"><a href="#">Electoral College</a></li>');
    $('#electoral_college a').click(function() {
        function showElectoralVote(year, startPrediction) {
            // clean up arguments
            // coerce year to string (just for good measure)
            year = year + '';
            // default startPrediction to false
            startPrediction = (typeof startPrediction == 'undefined') ? false : startPrediction;
            
            var republican = electoralVotes[year].republican;
            var democratic = electoralVotes[year].democratic;
            var thirdParty = electoralVotes[year].thirdParty;
            setStateColors(republican, 'red');
            setStateColors(democratic, 'blue');
            setStateColors(thirdParty, 'yellow');
            
            var republicanVotes = 0;
            var democraticVotes = 0;
            var thirdPartyVotes = 0;
            var invalidVotes = 0;
            
            if (!startPrediction) {
                for (i=0; i<republican.length; i++) {
                    republicanVotes += electoralVotes[year].states[republican[i]];
                }
                for (i=0; i<democratic.length; i++) {
                    democraticVotes += electoralVotes[year].states[democratic[i]];
                }
                for (i=0; i<thirdParty.length; i++) {
                    thirdPartyVotes += electoralVotes[year].states[thirdParty[i]];
                }
                console.log('Votes (RDT): (' + republicanVotes + ',' + democraticVotes + ',' + thirdPartyVotes + ')');
                
                for (state in electoralVotes[year].states) {
                    var stateVotes = electoralVotes[year][state];
                    if (stateVotes) {
                        console.log(state + ': (' + stateVotes.republican + ',' + stateVotes.democratic + ',' + stateVotes.thirdParty + ')');
                        
                        republicanVotes += stateVotes.republican;
                        democraticVotes += stateVotes.democratic;
                        thirdPartyVotes += stateVotes.thirdParty;
                        
                        if (stateVotes.republican >= 0 && stateVotes.democratic == 0 && stateVotes.thirdParty == 0) {
                            setStateColors([state], 'red');
                        } else if (stateVotes.republican == 0 && stateVotes.democratic >= 0 && stateVotes.thirdParty == 0) {
                            setStateColors([state], 'blue');
                        } else if (stateVotes.republican == 0 && stateVotes.democratic == 0 && stateVotes.thirdParty >= 0) {
                            setStateColors([state], 'yellow');
                        } else if (stateVotes.republican >= 0 && stateVotes.democratic >= 0 && stateVotes.thirdParty == 0) {
                            setStateColors([state], 'purple');
                        } else if (stateVotes.republican >= 0 && stateVotes.democratic == 0 && stateVotes.thirdParty >= 0) {
                            setStateColors([state], 'orange');
                        } else if (stateVotes.republican == 0 && stateVotes.democratic >= 0 && stateVotes.thirdParty >= 0) {
                            setStateColors([state], 'green');
                        } else {
                            setStateColors([state], 'gray');
                        }
                    }
                }
                
                invalidVotes = 538 - (republicanVotes + democraticVotes + thirdPartyVotes);
            } else {
                for (i=0; i<republican.length; i++) {
                    republicanVotes += electoralVotes['2012'].states[republican[i]];
                }
                for (i=0; i<democratic.length; i++) {
                    democraticVotes += electoralVotes['2012'].states[democratic[i]];
                }
                for (i=0; i<thirdParty.length; i++) {
                    thirdPartyVotes += electoralVotes['2012'].states[thirdParty[i]];
                }
                console.log('Votes (RDT): (' + republicanVotes + ',' + democraticVotes + ',' + thirdPartyVotes + ')');
                
                for (state in electoralVotes[year].states) {
                    var stateVotes = electoralVotes[year][state];
                    if (stateVotes) {
                        console.log(state + ': (' + stateVotes.republican + ',' + stateVotes.democratic + ',' + stateVotes.thirdParty + ')');
                        
                        var mostVotes = Math.max(stateVotes.republican, stateVotes.democratic, stateVotes.thirdParty);
                        if (mostVotes == stateVotes.republican) {
                            setStateColors([state], 'red');
                            republicanVotes += electoralVotes['2012'].states[state];
                            console.log('Coerced to Republican.');
                        } else if (mostVotes == stateVotes.democratic) {
                            setStateColors([state], 'blue');
                            democraticVotes += electoralVotes['2012'].states[state];
                            console.log('Coerced to Democratic.');
                        } else {  // assume third-party
                            setStateColors([state], 'yellow');
                            thirdPartyVotes += electoralVotes['2012'].states[state];
                            console.log('Coerced to third party.');
                        }
                    }
                }
            }
            
            console.log('Ending votes (RDT): (' + republicanVotes + ',' + democraticVotes + ',' + thirdPartyVotes + ')');
            console.log('Total: ' + (republicanVotes + democraticVotes + thirdPartyVotes));
            
            var animate = true;
            if (lowerChart) {animate = false;}
            
            lowerChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'lower_chart',
                    defaultSeriesType: 'bar'
                },
                credits: {enabled: false},
                title: {text: 'Electoral votes in ' + year},
                xAxis: {
                    categories: [' '],
                    lineWidth: 0
                },
                yAxis: {
                    endOnTick: false,
                    max: 538,
                    min: 0,
                    tickInterval: 270,
                    title: {text: ''}
                },
                series: [{
                    name: 'Democratic',
                    data: [{
                        color: styleColors['blue'],
                        y: democraticVotes
                    }]
                }, {
                    name: 'Third party',
                    data: [{
                        color: styleColors['yellow'],
                        y: thirdPartyVotes
                    }]
                }, {
                    name: 'Invalid/miscellaneous votes',
                    data: [{
                        color: styleColors['white'],
                        y: invalidVotes
                    }]
                }, {
                    name: 'Republican',
                    data: [{
                        color: styleColors['red'],
                        y: republicanVotes
                    }]
                }],
                legend: {enabled: false},
                plotOptions: {
                    bar: {
                        borderWidth: 0,
                        shadow: false
                    },
                    series: {
                        animation: animate,
                        stacking: 'normal'
                    }
                },
                tooltip: {enabled: false}
            });
        }
        
        clearMap();
        $('#electoral_college').append([
            '<ul><li>View: ',
            '<select id="electoral_college_year">',
                '<option value="2008" selected="selected">2008 election</option>',
                '<option value="2004">2004 election</option>',
                '<option value="2000">2000 election</option>',
                '<option value="1996">1996 election</option>',
                '<option value="1992">1992 election</option>',
                '<option value="1988">1988 election</option>',
                '<option value="1984">1984 election</option>',
                '<option value="1980">1980 election</option>',
                '<option value="1976">1976 election</option>',
                '<option value="1972">1972 election</option>',
                '<option value="1968">1968 election</option>',
                '<option value="1964">1964 election</option>',
            '</select></li></ul>'
        ].join(''));
        $('#electoral_college_year').change(function() {
            // reset things so we don't accidentally set or append them on top
            // of each other
            $('#electoral_college_change').remove();
            clearClickHandlers();
            closeDialogs();
            
            // pick through the garbage so we don't throw ourselves out
            var leftovers = [];
            for (var i in futureGarbage) {
                if (futureGarbage[i][0] != $('#electoral_college ul')[0]) {
                    leftovers.push(futureGarbage[i]);
                }
            }
            futureGarbage = leftovers;
            // get rid of the rest, though
            clearGarbage();
            // and then add this back to the garbage in case the user clears the
            // whole map
            futureGarbage.push($('#electoral_college ul'));
            
            // render the map
            showElectoralVote($(this).val());
            
            $('#electoral_college ul').append('<li id="electoral_college_change"><a href="#">Start 2012 prediction here</a></li>');
            $('#electoral_college_change a').click(function() {
                // remove the option to shoot yourself in the foot
                $('#electoral_college_change').remove();
                
                // unsplit states
                showElectoralVote($('#electoral_college_year').val(), true);
                
                // prep the dialogs for splitting states, including 
                // pre-selecting the currently shown choices
                $([
                    '<div id="nebraska_electoral" title="Choose Nebraska\'s votes">',
                        '<p>',
                        '<label for="nebraska_popular">Popular vote (worth 3):</label>',
                        '<select id="nebraska_popular">',
                            '<option value="r">Republican</option>',
                            '<option value="d">Democratic</option>',
                            '<option value="t">Third party</option>',
                        '</select>',
                        '</p>',
                        '<p>',
                        '<label for="nebraska_4">Fourth vote:</label>',
                        '<select id="nebraska_4">',
                            '<option value="r">Republican</option>',
                            '<option value="d">Democratic</option>',
                            '<option value="t">Third party</option>',
                        '</select>',
                        '</p>',
                        '<p>',
                        '<label for="nebraska_5">Fifth vote:</label>',
                        '<select id="nebraska_5">',
                            '<option value="r">Republican</option>',
                            '<option value="d">Democratic</option>',
                            '<option value="t">Third party</option>',
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
                    height: 212,
                    position: [200, 141],
                    resizable: false,
                    width: 400
                });
                futureGarbage.push($('#nebraska_electoral'));
                activeDialogs.push($('#nebraska_electoral'));
                switch (usGeo['Nebraska'].statePath.attr('fill')) {
                    case styleColors['red']:
                        $('#nebraska_popular').val('r');
                        $('#nebraska_4').val('r');
                        $('#nebraska_5').val('r');
                        break;
                    case styleColors['blue']:
                        $('#nebraska_popular').val('d');
                        $('#nebraska_4').val('d');
                        $('#nebraska_5').val('d');
                        break;
                    case styleColors['yellow']:  // fall through
                    default:
                        $('#nebraska_popular').val('t');
                        $('#nebraska_4').val('t');
                        $('#nebraska_5').val('t');
                        break;
                }
                $([
                    '<div id="maine_electoral" title="Choose Maine\'s votes">',
                        '<p>',
                        '<label for="maine_popular">Popular vote (worth 3):</label>',
                        '<select id="maine_popular">',
                            '<option value="r">Republican</option>',
                            '<option value="d">Democratic</option>',
                            '<option value="t">Third party</option>',
                        '</select>',
                        '</p>',
                        '<p>',
                        '<label for="maine_4">Fourth vote:</label>',
                        '<select id="maine_4">',
                            '<option value="r">Republican</option>',
                            '<option value="d">Democratic</option>',
                            '<option value="t">Third party</option>',
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
                    position: [200, 141],
                    resizable: false,
                    width: 400
                });
                futureGarbage.push($('#maine_electoral'));
                activeDialogs.push($('#maine_electoral'));
                switch (usGeo['Maine'].statePath.attr('fill')) {
                    case styleColors['red']:
                        $('#maine_popular').val('r');
                        $('#maine_4').val('r');
                        $('#maine_5').val('r');
                        break;
                    case styleColors['blue']:
                        $('#maine_popular').val('d');
                        $('#maine_4').val('d');
                        $('#maine_5').val('d');
                        break;
                    case styleColors['yellow']:  // fall through
                    default:
                        $('#maine_popular').val('t');
                        $('#maine_4').val('t');
                        $('#maine_5').val('t');
                        break;
                }
                
                for (var i in usGeo) {
                    var stateClass = i.replace(/ /g, '_');
                    switch (stateClass) {
                        case 'Nebraska':
                            function nebraskaHandler(e) {
                                $('#nebraska_electoral').dialog('open');
                                
                                // store the votes currently reflected so we can
                                // subtract them out later
                                var nebraskaVotes = {
                                    republican: 0,
                                    democratic: 0,
                                    thirdParty: 0
                                };
                                
                                if (usGeo['Nebraska'].statePath.attr('fill') == styleColors['red']) {
                                    nebraskaVotes.republican = electoralVotes['2012'].states['Nebraska'];
                                } else if (usGeo['Nebraska'].statePath.attr('fill') == styleColors['blue']) {
                                    nebraskaVotes.democratic = electoralVotes['2012'].states['Nebraska'];
                                } else {  // assume third-party
                                    nebraskaVotes.thirdParty = electoralVotes['2012'].states['Nebraska'];
                                }
                                
                                function updateNebraska() {
                                    var oldBlue = lowerChart.series[0].data[0].y;
                                    var oldRed = lowerChart.series[3].data[0].y;
                                    var oldYellow = lowerChart.series[1].data[0].y;
                                    
                                    var newVotes = {
                                        republican: 0,
                                        democratic: 0,
                                        thirdParty: 0
                                    };
                                    
                                    // figure out new votes
                                    switch ($('#nebraska_popular').val()) {
                                        case 'r':
                                            newVotes.republican += 3;
                                            break;
                                        case 'd':
                                            newVotes.democratic += 3;
                                            break;
                                        case 't':  // fall through
                                        default:
                                            newVotes.thirdParty += 3;
                                            break;
                                    }
                                    switch ($('#nebraska_4').val()) {
                                        case 'r':
                                            newVotes.republican += 1;
                                            break;
                                        case 'd':
                                            newVotes.democratic += 1;
                                            break;
                                        case 't':  // fall through
                                        default:
                                            newVotes.thirdParty += 1;
                                            break;
                                    }
                                    switch ($('#nebraska_5').val()) {
                                        case 'r':
                                            newVotes.republican += 1;
                                            break;
                                        case 'd':
                                            newVotes.democratic += 1;
                                            break;
                                        case 't':  // fall through
                                        default:
                                            newVotes.thirdParty += 1;
                                            break;
                                    }
                                    
                                    // update the chart, of course
                                    lowerChart.series[0].setData([{
                                        color: styleColors['blue'],
                                        y: oldBlue - nebraskaVotes.democratic + newVotes.democratic
                                    }]);
                                    lowerChart.series[1].setData([{
                                        color: styleColors['yellow'],
                                        y: oldYellow - nebraskaVotes.thirdParty + newVotes.thirdParty
                                    }]);
                                    lowerChart.series[3].setData([{
                                        color: styleColors['red'],
                                        y: oldRed - nebraskaVotes.republican + newVotes.republican
                                    }]);
                                    
                                    // update the stored votes to reflect the 
                                    // new state of things *rimshot*
                                    nebraskaVotes = newVotes;
                                    
                                    switch ($('#nebraska_popular').val() + $('#nebraska_4').val() + $('#nebraska_5').val()) {
                                        case 'rrr':
                                            setStateColors(['Nebraska'], 'red');
                                            break;
                                        case 'ddd':
                                            setStateColors(['Nebraska'], 'blue');
                                            break;
                                        case 'ttt':
                                            setStateColors(['Nebraska'], 'yellow');
                                            break;
                                        case 'rrd':  // let's not try to set
                                        case 'rdd':  // different levels of
                                        case 'drr':  // each primary color.
                                        case 'drd':  // too crazy.
                                        case 'rdr':
                                        case 'ddr':
                                            setStateColors(['Nebraska'], 'purple');
                                            break;
                                        case 'rrt':
                                        case 'rtr':
                                        case 'rtt':
                                        case 'trr':
                                        case 'trt':
                                        case 'ttr':
                                            setStateColors(['Nebraska'], 'orange');
                                            break;
                                        case 'ddt':
                                        case 'dtd':
                                        case 'dtt':
                                        case 'tdd':
                                        case 'tdt':
                                        case 'ttd':
                                            setStateColors(['Nebraska'], 'green');
                                            break;
                                        case 'rdt':
                                        case 'rtd':
                                        case 'drt':
                                        case 'dtr':
                                        case 'trd':
                                        case 'tdr':
                                            setStateColors(['Nebraska'], 'gray');
                                            break;
                                    }
                                }
                                
                                $('#nebraska_popular').change(updateNebraska);
                                $('#nebraska_4').change(updateNebraska);
                                $('#nebraska_5').change(updateNebraska);
                            }
                            $(usGeo['Nebraska'].statePath.node).click(nebraskaHandler);
                            break;
                        
                        case 'Maine':
                            function maineHandler(e) {
                                $('#maine_electoral').dialog('open');
                                
                                var maineVotes = {
                                    republican: 0,
                                    democratic: 0,
                                    thirdParty: 0
                                };
                                
                                if (usGeo['Maine'].statePath.attr('fill') == styleColors['red']) {
                                    maineVotes.republican = electoralVotes['2012'].states['Maine'];
                                } else if (usGeo['Maine'].statePath.attr('fill') == styleColors['blue']) {
                                    maineVotes.democratic = electoralVotes['2012'].states['Maine'];
                                } else {  // assume third-party
                                    maineVotes.thirdParty = electoralVotes['2012'].states['Maine'];
                                }
                                
                                function updateMaine() {
                                    var oldBlue = lowerChart.series[0].data[0].y;
                                    var oldRed = lowerChart.series[3].data[0].y;
                                    var oldYellow = lowerChart.series[1].data[0].y;
                                    
                                    var newVotes = {
                                        republican: 0,
                                        democratic: 0,
                                        thirdParty: 0
                                    };
                                    
                                    // figure out new votes
                                    switch ($('#maine_popular').val()) {
                                        case 'r':
                                            newVotes.republican += 3;
                                            break;
                                        case 'd':
                                            newVotes.democratic += 3;
                                            break;
                                        case 't':  // fall through
                                        default:
                                            newVotes.thirdParty += 3;
                                            break;
                                    }
                                    switch ($('#maine_4').val()) {
                                        case 'r':
                                            newVotes.republican += 1;
                                            break;
                                        case 'd':
                                            newVotes.democratic += 1;
                                            break;
                                        case 't':  // fall through
                                        default:
                                            newVotes.thirdParty += 1;
                                            break;
                                    }
                                    
                                    lowerChart.series[0].setData([{
                                        color: styleColors['blue'],
                                        y: oldBlue - maineVotes.democratic + newVotes.democratic
                                    }]);
                                    lowerChart.series[1].setData([{
                                        color: styleColors['yellow'],
                                        y: oldYellow - maineVotes.thirdParty + newVotes.thirdParty
                                    }]);
                                    lowerChart.series[3].setData([{
                                        color: styleColors['red'],
                                        y: oldRed - maineVotes.republican + newVotes.republican
                                    }]);
                                    maineVotes = newVotes;
                                    
                                    switch ($('#maine_popular').val() + $('#maine_4').val()) {
                                        case 'rr':
                                            setStateColors(['Maine'], 'red');
                                            break;
                                        case 'dd':
                                            setStateColors(['Maine'], 'blue');
                                            break;
                                        case 'tt':
                                            setStateColors(['Maine'], 'yellow');
                                            break;
                                        case 'rd':  // fall through
                                        case 'dr':
                                            setStateColors(['Maine'], 'purple');
                                            break;
                                        case 'rt':  // fall through
                                        case 'tr':
                                            setStateColors(['Maine'], 'orange');
                                            break;
                                        case 'dt':  // fall through
                                        case 'td':
                                            setStateColors(['Maine'], 'green');
                                            break;
                                    }
                                }
                                
                                $('#maine_popular').change(updateMaine);
                                $('#maine_4').change(updateMaine);
                            }
                            $(usGeo['Maine'].statePath.node).click(maineHandler);
                            break;
                        
                        default:
                            function genericHandler() {
                                var state = $(this).data('state');
                                var stateUnescaped = state.replace(/_/g, ' ');
                                var votes = electoralVotes['2012'].states[stateUnescaped];
                                
                                var oldBlue = lowerChart.series[0].data[0].y;
                                var oldRed = lowerChart.series[3].data[0].y;
                                var oldYellow = lowerChart.series[1].data[0].y;
                                
                                switch (usGeo[stateUnescaped].statePath.attr('fill')) {
                                    case styleColors['red']:
                                        lowerChart.series[3].setData([{
                                            color: styleColors['red'],
                                            y: oldRed - votes
                                        }]);
                                        setStateColors([state], 'blue');
                                        lowerChart.series[0].setData([{
                                            color: styleColors['blue'],
                                            y: oldBlue + votes
                                        }]);
                                        break;
                                    case styleColors['blue']:
                                        lowerChart.series[0].setData([{
                                            color: styleColors['blue'],
                                            y: oldBlue - votes
                                        }]);
                                        setStateColors([state], 'yellow');
                                        lowerChart.series[1].setData([{
                                            color: styleColors['yellow'],
                                            y: oldYellow + votes
                                        }]);
                                        break;
                                    case styleColors['yellow']:  // fall through
                                    default:
                                        lowerChart.series[1].setData([{
                                            color: styleColors['yellow'],
                                            y: oldYellow - votes
                                        }]);
                                        setStateColors([state], 'red');
                                        lowerChart.series[3].setData([{
                                            color: styleColors['red'],
                                            y: oldRed + votes
                                        }]);
                                        break;
                                }
                            }
                            $(usGeo[i].statePath.node).click(genericHandler);
                            break;
                    }
                }
                
                return false;
            });
        }).change();
        
        futureGarbage.push($('#electoral_college ul'));
        
        return false;
    });
});
