/** @jsx React.DOM */
var React = require("react");
var RCSS = require("rcss");
var widgetPositionerStyle = require("./style/widget-positioner.js");
var widgetPositionerClass = RCSS.registerClass(widgetPositionerStyle);
var WidgetContainer = React.createClass(
    {
        render: function() {
            return (
                <div className={widgetPositionerClass.className}>
                    {this.props.children}
                </div>
            );
        }
    }
)

module.exports = WidgetContainer;