/** @jsx React.DOM */
var React = require("react");
var RCSS = require("rcss");
var widgetStyles = require("./style/widget-positioner.js");
var WidgetContainer = React.createClass(
    {
        render: function() {
            var widgetSizeClass = widgetStyles[this.props.sizeClass ||
                'singleSize'];
            
            return (
                <div className={widgetSizeClass.className}>
                    {this.props.children}
                </div>
            );
        }
    }
)

module.exports = WidgetContainer;