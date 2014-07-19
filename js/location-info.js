// Locations for KA headquarters and our remote employees.
var locations = {
    mountainView: {
        tz: "America/Los_Angeles",
        latLong: "37.389444,-122.081944",
        degreeUnit: "F",
        displayName: "Mountain View",
        weight: 50,
    }, 
    newYork: {
        // Beth, Steven, John
        tz: "America/New_York",
        latLong: "40.7056308,-73.9780035",
        degreeUnit: "F",
        displayName: "New York",
        weight: 1,
    },
    toronto: {
        // Michelle
        tz: "America/Toronto",
        latLong: "43.7182713,-79.3777061",
        degreeUnit: "C",
        displayName: "Toronto",
        weight: 1,
    },
    windsor: {
        // Brian
        tz: "America/Toronto",
        latLong: "42.2912792,-83.002882",
        degreeUnit: "C",
        displayName: "Windsor",
        weight: 1,
    },
    princeton: {
        // Colin
        tz: "America/New_York",
        latLong: "40.3483133,-74.6698424",
        degreeUnit: "F",
        displayName: "Princeton",
        weight: 1,
    },
    kitchener: {
        // Jamie
        tz: "America/Toronto",
        latLong: "43.6980681,-81.8314648",
        degreeUnit: "C",
        displayName: "Kitchener",
        weight: 1,
    },
    moon: {
        // Mr. Pants
        tz: "UTC",
        latLong: undefined,
        degreeUnit: "C",
        displayName: "The Moon",
        weight: 0.01,
        staticWeatherInfo: {
            temperature: -233,
            icon: "clear-night",
        }
    }
}

module.exports = locations
