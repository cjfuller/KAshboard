var RCSS = require("rcss");
var styleVars = require("./style-vars.js");
var colors = require("./ka-colors.js");

var dashboardStyle = {
    fontFamily: styleVars.fontFamily,
    backgroundColor: styleVars.backgroundColor,
    width: styleVars.dashboardWidthPx + "px",
    height: styleVars.dashboardHeightPx + "px",
    color: colors.grayExtraLight,
}

module.exports = RCSS.registerClass(dashboardStyle);
