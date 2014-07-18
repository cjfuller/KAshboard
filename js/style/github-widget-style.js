var RCSS = require('rcss');
var colors = require('./ka-colors.js');

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

var titleStyle = {
    fontSize: "1.8em",
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "10px",
    marginRight: "10px",
    fontWeight: "bold",
}

var changelistStyle = {
    fontSize: "0.8em",
    paddingTop: "10px",
    paddingLeft: "20px"
}

module.exports = {
    listStyleClass: RCSS.registerClass(listStyle),
    ghStyleClass: RCSS.registerClass(ghWidgetStyle),
    numberClass: RCSS.registerClass(numberStyle),
    captionClass: RCSS.registerClass(captionStyle),
    titleClass: RCSS.registerClass(titleStyle),
    changelistClass: RCSS.registerClass(changelistStyle),
}