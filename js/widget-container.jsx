/** @jsx React.DOM */
var React = require("react");
var widgetPositionerClass = require("./style/widget-positioner.js");

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