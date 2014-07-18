var RCSS = require("rcss");
var styleVars = require("./style-vars.js");

var dashboardStyle = {
    fontFamily: styleVars.fontFamily,
    backgroundColor: styleVars.backgroundColor,
    width: styleVars.dashboardWidthPx + "px",
    height: styleVars.dashboardHeightPx + "px",
}

module.exports = RCSS.registerClass(dashboardStyle);
