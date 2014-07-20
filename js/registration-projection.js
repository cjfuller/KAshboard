var moment = require("moment-timezone");

var projection = function(registrations) {
    var now = moment();
    var thisMonth = moment([now.year(), now.month()]);
    var thisMonthStr = thisMonth.format("YYYY-MM");
    var registrationsOut = (
        parseInt(registrations[thisMonthStr]) || 0
    );
    
    // Calculate registration rate from last month's stats
    var lastMonth = moment([now.year(), now.month() - 1]);
    var lastMonthStr = lastMonth.format("YYYY-MM");
    var registrationsLastMonth = (
        parseInt(registrations[lastMonthStr])
    );
    var secondsInMonth = thisMonth.diff(lastMonth) / 1000;
    var registrationsPerSecond = (registrationsLastMonth /
                                  secondsInMonth);

    // Find last Saturday, midnight Pacific time.
    // Use the previous one if the reports pipeline hasn't run yet
    // (Monday AM).
    var backupDay = moment().clone().tz("America/Los_Angeles");
    backupDay = backupDay.startOf("week").subtract("day", 1);
    if (now.day() === 0) {
        backupDay = backupDay.subtract("week", 1);
    }

    var imaginaryRegistrations = registrationsPerSecond *
        (now.valueOf() - backupDay.valueOf())/1000;
        
    return {
        registrations: registrationsOut,
        imaginaryRegistrations: imaginaryRegistrations,
        registrationsPerSecond: registrationsPerSecond,
    };
};

module.exports = projection;