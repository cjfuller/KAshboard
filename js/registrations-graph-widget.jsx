/** @jsx React.DOM */

var moment = require("moment-timezone");
var React = require("react");
var _ = require("underscore");

var LineGraph = require("./line-graph.jsx");
var LoadingMessage = require("./loading-message.jsx");
var WidgetContainer = require("./widget-container.jsx");

var kaColors = require("./style/ka-colors.js");
var styleVars = require("./style/style-vars.js");

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
                this.setState({data: data})
            }
        }.bind(this));
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return (!_.last(this.state.data) ||
                (_.last(this.state.data).y != _.last(nextState.data).y));
    },

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.getData();
        this.interval = setInterval(this.getData, INTERVAL_MS);
    },

    componentWillUnmount: function() {
        clearInterval(this.interval);
    },

    render: function() {
        if (this.state.data.length === 0) {
            return <WidgetContainer sizeClass="doubleWide"
                color={kaColors.mathDomainColor}>
                <LoadingMessage />
            </WidgetContainer>;
        }
        var series = [{
            name: "new registrations",
            type: "spline",
            data: this.state.data,
            lineWidth: "3px",
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
                width: styleVars.baseComponentWidth() * 2 +
                    styleVars.gridSpacing,
            },
            colors: [kaColors.scienceTopicColor],
        }
        return (
            <WidgetContainer sizeClass="doubleWide"
                             color={kaColors.mathDomainColor}>
            <div className="dashboard-widget">
                <LineGraph series={series} config={config}/>
            </div>
            </WidgetContainer>
        );
    },
});

module.exports = RegistrationsGraphWidget;
