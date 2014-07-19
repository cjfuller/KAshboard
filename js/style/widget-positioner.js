var RCSS = require("rcss");
var _ = require("underscore");

var styleVars = require("./style-vars.js");

var gridSpacing = 15;
var nWide = 5;
var nTall = 3;
var baseComponentWidth = (styleVars.dashboardWidthPx - (nWide + 1) *
                          gridSpacing)/nWide;
var baseComponentHeight = (styleVars.dashboardHeightPx - (nTall + 1) *
                          gridSpacing)/nTall;

var widgetStyleBase = {
    position: 'relative',
    marginTop: gridSpacing + 'px',
    marginLeft: gridSpacing + 'px',
    float: 'left',
    width: baseComponentWidth + 'px',
    height: baseComponentHeight + 'px',
    overflow: 'hidden',
}

var doubleWideWidget = _.defaults({
    width: (2*baseComponentWidth + gridSpacing) + 'px',
}, widgetStyleBase);

var doubleTallWidget = _.defaults({
    height: (2*baseComponentHeight + gridSpacing) + 'px',
}, widgetStyleBase);

var doubleDoubleWidget = _.defaults({
    width: (2*baseComponentWidth + gridSpacing) + 'px',
    height: (2*baseComponentHeight + gridSpacing) + 'px',
}, widgetStyleBase);

module.exports = {
    singleSize: RCSS.registerClass(widgetStyleBase),
    doubleWide: RCSS.registerClass(doubleWideWidget),
    doubleTall: RCSS.registerClass(doubleTallWidget),
    doubleDouble: RCSS.registerClass(doubleDoubleWidget),
}
