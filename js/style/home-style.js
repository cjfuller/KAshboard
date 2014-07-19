var _ = require("underscore");
var RCSS = require("rcss");
var styleVars = require("./style-vars.js");
var logoHeightPx = 250;

var imgHolderStyle = {
    marginTop: ((styleVars.baseComponentHeight() - logoHeightPx)/2) + "px",
    marginLeft: "60px",
    width: "auto",
    float: "left",
};

var locationWidgetStyle = {
};

var locationHolderStyle = {
    paddingLeft: "65px",
    paddingTop: "50px",
    float: "left",
};

var titleStyle = {
    fontSize: "3.4em",
    fontWeight: "bold",
};

var weatherContainer = {
    marginTop: "15px",
}

var weatherStyle = {
    paddingTop: "2px",
    paddingRight: "15px",
}

var dateStyle = {
    fontSize: "1.5em",
}

var timeStyle = {
    fontSize: "3em",
}

var temperatureStyle = {
    fontSize: "3em",
    verticalAlign: "top",
}

module.exports = {
    imgHolder: RCSS.registerClass(imgHolderStyle),
    locationWidget: RCSS.registerClass(locationWidgetStyle),
    locationHolder: RCSS.registerClass(locationHolderStyle),
    title: RCSS.registerClass(titleStyle),
    date: RCSS.registerClass(dateStyle),
    weather: RCSS.registerClass(weatherStyle),
    weatherContainer: RCSS.registerClass(weatherContainer),
    temperature: RCSS.registerClass(temperatureStyle),
    time: RCSS.registerClass(timeStyle),
};
