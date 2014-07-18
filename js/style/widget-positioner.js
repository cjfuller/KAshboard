var styleVars = require("./global-style.js");

var gridSpacing = 15;

var nWide = 5;
var baseComponentSize = (styleVars.dashboardWidthPx - (nWide + 1) * gridSpacing)/nWide;
console.log(baseComponentSize);

var WidgetPositionerStyle = {
    position: 'relative',
    marginTop: gridSpacing + 'px',
    marginLeft: gridSpacing + 'px',
    width: baseComponentSize + 'px',
    height: baseComponentSize + 'px',
    backgroundColor: "#336600",
    float: 'left',
};




module.exports = WidgetPositionerStyle
