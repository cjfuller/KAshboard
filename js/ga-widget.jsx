/** @jsx React.DOM */
var React = require("react");
var chartId = 'mychart';
var LineGraph = require("./line-graph.jsx");


var GAWidget = React.createClass({
    getData: function() {
        
    },
    render: function() {
        var series = [{
            name: "a line!",
            type: "line",
            data: [{x: 1, y: 3}, {x: 2, y: -7}, {x: 3, y:22}]
        }]
        return (
            <div className="dashboard-widget">
                Hi, I'm a widget!  My name is { this.props.name }.
                <LineGraph series={ series }/>
            </div>
        );
    },
});

module.exports = GAWidget;
