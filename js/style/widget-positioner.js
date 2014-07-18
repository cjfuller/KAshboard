var RCSS = require('rcss');

var gridSpacing = '15px';

var widgetPositioner = {
    position: 'relative',
    marginTop: gridSpacing,
    marginLeft: gridSpacing,
    border: '2px solid black',
    width: '600px',
    height: '600px',
}

module.exports = RCSS.registerClass(widgetPositioner);