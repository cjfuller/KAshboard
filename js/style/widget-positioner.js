var RCSS = require("rcss");
var _ = require("underscore");

var styleVars = require("./style-vars.js");

var baseComponentWidth = styleVars.baseComponentWidth();
var baseComponentHeight = styleVars.baseComponentHeight();
var gridSpacing = styleVars.gridSpacing;

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
