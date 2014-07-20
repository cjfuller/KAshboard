/** @jsx React.DOM */
var React = require("react");
var chartId = 'mychart';
var LineGraph = require("./line-graph.jsx");
var WidgetContainer = require("./widget-container.jsx");
var styleVars = require("./style/style-vars.js");

var RegistrationsGraphWidget = React.createClass({
    getData: function() {
        var url = "http://localhost:3000/registrations";
        $.get(url, function(result) {
            
        });
    },
    render: function() {
        var series = [{
            name: "a line!",
            type: "line",
            data: [{x: 1, y: 3}, {x: 2, y: -7}, {x: 3, y:22}]
        }]
        var config = {
            yAxis: {
                title: {
                    text: "Sample y-axis title",
                }
            },
            xAxis: {
                title: {
                    text: "Sample x-axis title",
                }
            },
            title: {
                text: "Sample chart title",
            },
            chart: {
                height: styleVars.baseComponentHeight(),
                width: styleVars.baseComponentWidth() * 2 + styleVars.gridSpacing,
            },
        }
        return (
            <WidgetContainer sizeClass="doubleWide">
            <div className="dashboard-widget">
                <LineGraph series={series} config={config}/>
            </div>
            </WidgetContainer>
        );
    },
});

module.exports = RegistrationsGraphWidget;
