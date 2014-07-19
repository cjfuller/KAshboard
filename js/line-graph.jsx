/** @jsx React.DOM */
var React = require("react");

// TODO(colin): these don't play nicely with require.  Load them once
// centrally.
require("../third_party/highcharts.js");
require("../third_party/highcharts-more.js");

var HighchartOptions = require("./style/highcharts-style.js");

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
            var config = this.props.config;
            config.chart = config.chart || {};
            config.chart.renderTo = this.getDOMNode();
            config.series = this.props.series;
            if (this.props.series.length == 1) {
                config.legend = {enabled: false};
            }
            new Highcharts.Chart(config);
        },
    }
);

module.exports = LineGraph;
