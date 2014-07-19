var RCSS = require("rcss");
var colors = require("./ka-colors.js");
var styleVars = require("./style-vars.js");

var logoHeightPx = 250;

var imgDivStyle = {
    paddingTop: ((styleVars.baseComponentHeight() - logoHeightPx)/2) + "px",
    paddingLeft: "25px",
}

module.exports = RCSS.registerClass(imgDivStyle);