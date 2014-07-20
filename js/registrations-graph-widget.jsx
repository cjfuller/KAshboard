/** @jsx React.DOM */
var React = require("react");
var moment = require("moment-timezone");
var _ = require("underscore");

var LineGraph = require("./line-graph.jsx");
var WidgetContainer = require("./widget-container.jsx");
var styleVars = require("./style/style-vars.js");
var kaColors = require("./style/ka-colors.js");

var INTERVAL_MS = 10000;

var RegistrationsGraphWidget = React.createClass({
    getData: function() {
        var url = "http://localhost:3000/registrations";
        $.get(url, function(result) {
            if (result) {
                var data = _.map(result.registrations, function(v, k) {
                    // k is a date in the format YYYY-MM
                    // highcharts expects times in ms
                    var timeMs = moment(k, "YYYY-MM").valueOf();
                    return {x: timeMs, y: parseInt(v)};
                });
                // don't redraw the graph on every poll interval
                if (!_.last(this.state.data) ||
                    (_.last(this.state.data).y != _.last(data).y)) {
                        this.setState({data: data})
                }
            }
        }.bind(this));
    },

    getInitialState: function() {
        return {data: []};
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
            name: "new registrations",
            type: "spline",
            data: this.state.data,
        }]
        var config = {
            yAxis: {
                title: {
                    text: null,
                },
                min: 0,
            },
            xAxis: {
                type: "datetime",
                title: {
                }
            },
            title: {
                text: "Registrations per Month",
            },
            chart: {
                height: styleVars.baseComponentHeight(),
                width: styleVars.baseComponentWidth() * 2 + styleVars.gridSpacing,
            },
        }
        return (
            <WidgetContainer sizeClass="doubleWide"
                             color={kaColors.defaultDomainColor}>
            <div className="dashboard-widget">
                <LineGraph series={series} config={config}/>
            </div>
            </WidgetContainer>
        );
    },
});

module.exports = RegistrationsGraphWidget;
