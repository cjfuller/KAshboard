var RCSS = require('rcss');
var colors = require('./ka-colors.js');
var vars = require('./style-vars.js');

var listStyle = {
    paddingRight: "20px",
    paddingBottom: "15px",
}

var ghWidgetStyle = {
    color: colors.grayExtraLight,
}

var numberStyle = {
    fontSize: "10em",
    textAlign: "center",
    marginTop: "20px",
}

var captionStyle = {
    fontSize: "1.8em",
    textAlign: "center",
    marginTop: "10px",
}

var changelistStyle = {
    fontSize: "0.95em",
    paddingTop: "10px",
    paddingLeft: "20px"
}

module.exports = {
    listStyleClass: RCSS.registerClass(listStyle),
    ghStyleClass: RCSS.registerClass(ghWidgetStyle),
    numberClass: RCSS.registerClass(numberStyle),
    captionClass: RCSS.registerClass(captionStyle),
    titleClass: RCSS.registerClass(vars.titleStyle),
    changelistClass: RCSS.registerClass(changelistStyle),
}