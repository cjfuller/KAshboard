var RCSS = require("rcss");
var _ = require("underscore");

var styleVars = require("./style-vars.js");

var gridSpacing = 15;
var nWide = 5;
var baseComponentSize = (styleVars.dashboardWidthPx - (nWide + 1) *
                         gridSpacing)/nWide;

var widgetStyleBase = {
    position: 'relative',
    marginTop: gridSpacing + 'px',
    marginLeft: gridSpacing + 'px',
    float: 'left',
    width: baseComponentSize + 'px',
    height: baseComponentSize + 'px',
}

var doubleWideWidget = _.defaults({
    width: (2*baseComponentSize + gridSpacing) + 'px',
}, widgetStyleBase);

var doubleTallWidget = _.defaults({
    height: (2*baseComponentSize + gridSpacing) + 'px',
}, widgetStyleBase);

var doubleDoubleWidget = _.defaults({
    width: (2*baseComponentSize + gridSpacing) + 'px',
    height: (2*baseComponentSize + gridSpacing) + 'px',
}, widgetStyleBase);

module.exports = {
    singleSize: RCSS.registerClass(widgetStyleBase),
    doubleWide: RCSS.registerClass(doubleWideWidget),
    doubleTall: RCSS.registerClass(doubleTallWidget),
    doubleDouble: RCSS.registerClass(doubleDoubleWidget),
}
