/** @jsx React.DOM */
var React = require("react");
var moment = require("moment-timezone");
var _ = require("underscore");

var LineGraph = require("./line-graph.jsx");
var WidgetContainer = require("./widget-container.jsx");
var styleVars = require("./style/style-vars.js");
var kaColors = require("./style/ka-colors.js");

var INTERVAL_MS = 10000;

var ErrorGraphWidget = React.createClass({
    getData: function() {
        var url = "http://localhost:3000/error_counts";
        $.get(url, function(result) {
            if (result) {
                var series4xx = _.map(result.errors, function(v, k) {
                    // k is a time in hours
                    // highcharts expects times in ms
                    var timeMs = k*3600*1000;
                    var errs = (v[4] && parseInt(v[4])/3600.0) || 0;
                    return {x: timeMs, y: errs};
                });
                var series5xx = _.map(result.errors, function(v, k) {
                    // k is a time in sec/1800
                    // highcharts expects times in ms
                    var timeMs = k*3600*1000;
                    var errs = (v[5] && parseInt(v[5])/3600.0) || 0;
                    return {x: timeMs, y: parseInt(v[5])/3600.0};
                });
                var data = {
                    client: series4xx,
                    server: series5xx,
                }
                // don't redraw the graph on every poll interval
                if (!_.last(this.state.data.client) ||
                    (_.last(this.state.data.client).y != _.last(series4xx).y)){
                        this.setState({data: data});
                }
            }
        }.bind(this));
    },

    getInitialState: function() {
        return {data: {}};
    },

    componentDidMount: function() {
        this.getData();
        this.interval = setInterval(this.getData, INTERVAL_MS);
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    render: function() {
        var series = [{
            name: "client",
            type: "spline",
            data: this.state.data.client,
        },
        {
            name: "server",
            type: "spline",
            data: this.state.data.server,
        }]
        var config = {
            yAxis: {
                title: {
                    text: "errors / s",
                },
                min: 0,
            },
            xAxis: {
                type: "datetime",
                title: {
                }
            },
            title: {
                text: "khanacademy.org Error Rates",
            },
            chart: {
                height: styleVars.baseComponentHeight() +
                    styleVars.gridSpacing,
                width: styleVars.baseComponentWidth() * 2 +
                    styleVars.gridSpacing,
            },
            colors: [kaColors.csTopicColor, kaColors.economicsTopicColor],
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

module.exports = ErrorGraphWidget;
