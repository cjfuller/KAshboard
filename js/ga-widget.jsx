/** @jsx React.DOM */
var React = require("react");
var chartId = 'mychart';
var LineGraph = require("./line-graph.jsx");


var GAWidget = React.createClass({
    render: function() {
        return (
            <div className="dashboard-widget">
                Hi, I'm a widget!  My name is { this.props.name }.
                <LineGraph />
            </div>
        );
    },
});

module.exports = GAWidget;
