var RCSS = require('rcss');
var colors = require('./ka-colors.js');
var vars = require('./style-vars.js');

var listStyle = {
    paddingRight: "20px",
    paddingBottom: "15px",
}

var containerStyle = {
    color: colors.grayExtraLight,
    paddingTop: "50px",
}

var numberStyle = {
    fontSize: "5em",
    textAlign: "center",
    marginTop: "20px",
}

var captionStyle = {
    fontSize: "1.8em",
    textAlign: "center",
    marginTop: "30px",
}

var changelistStyle = {
    fontSize: "0.95em",
    paddingTop: "10px",
    paddingLeft: "20px"
}

module.exports = {
    container: RCSS.registerClass(containerStyle),
    number: RCSS.registerClass(numberStyle),
    caption: RCSS.registerClass(captionStyle),
}