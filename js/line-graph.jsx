/** @jsx React.DOM */
var React = require("react");

// TODO(colin): these don't play nicely with require.  Load them once
// centrally.
require("../third_party/highcharts.js");
require("../third_party/highcharts-more.js");

var HighchartOptions = {
    credits: {
        enabled: false
    },
    chart: {
        type: "spline",
        zoomType: "xy",
    },
    title: {
        text: ""
    },
    xAxis: {
    },
    plotOptions: {
        series: {
            marker: {
                radius: 2
            }
        }
    },
    tooltip: {
        crosshairs: [true, true],
        shared: true
    },
    global: {
        useUTC: false
    }
};

var LineGraph = React.createClass(
    {
        render: function() {
            return (
                <div />
            );
        },
        componentWillMount: function() {
            //TODO(colin): this belongs somewhere further up the hierarchy.
            Highcharts.setOptions(HighchartOptions);
        },
        componentDidMount: function() {
            this.plotIt();
        },
        componentDidUpdate: function() {
            this.plotIt();
        },
        plotIt: function() {
            var config = {
                chart: {},
                yAxis: {
                    labels: {
                        formatter: function() {
                            return this.value + "%";
                        }
                    }
                },
                tooltip: {
                    valueDecimals: 1,
                    valueSuffix: "%"
                }
            };
            config.chart.renderTo = this.getDOMNode();
            config.series = this.props.series;
            config.chart.title = "Chart title!";
            config.yAxis.title = "It's a y-axis!";
            new Highcharts.Chart(config);
        },
    }
);

module.exports = LineGraph;