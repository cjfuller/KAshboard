/** @jsx React.DOM */

var RCSS = require("rcss");
var React = require("react");

var colors = require("./style/ka-colors.js");
var widgetStyles = require("./style/widget-positioner.js");

var WidgetContainer = React.createClass(
    {
        render: function() {
            var widgetSizeClass = widgetStyles[this.props.sizeClass ||
                'singleSize'];
            var colorStyle = {
                backgroundColor: this.props.color || colors.kaBlue,
            };
            return (
                <div className={widgetSizeClass.className}
                         style={colorStyle}>
                    {this.props.children}
                </div>
            );
        }
    }
)

module.exports = WidgetContainer;