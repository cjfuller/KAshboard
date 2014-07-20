var RCSS = require("rcss");
var kaColors = require("./ka-colors.js");

var linkStyle = {
    color: kaColors.grayExtraLight,
    textDecoration: "none",
};

var labelStyle = {
    fontSize: "2em",
    paddingTop: "60px",
};

var numberStyle = {
    fontSize: "10em",
};

var linkContainerStyle = {
    height: "100%",
    width: "100%",
    textAlign: "center",
};

module.exports = {
    link: RCSS.registerClass(linkStyle),
    label: RCSS.registerClass(labelStyle),
    number: RCSS.registerClass(numberStyle),
    linkContainer: RCSS.registerClass(linkContainerStyle),
};
