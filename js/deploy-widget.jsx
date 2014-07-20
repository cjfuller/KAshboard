/** @jsx React.DOM */

var React = require("react");

var LoadingMessage = require("./loading-message.jsx");
var WidgetContainer = require('./widget-container.jsx');

// Refresh rate, in milliseconds
var INTERVAL_MS = 10000;

var DeployWidget = React.createClass({
    getInitialState: function() {
        return {build: {}};
    },

    getLastBuild: function() {
        $.get("http://localhost:3000/deploy", function(result) {
            this.setState({build: result});
        }.bind(this));
    },

    componentDidMount: function() {
        this.getLastBuild();
        this.interval = setInterval(this.getLastBuild, INTERVAL_MS);
    },

    componentWillUnmount: function() {
        clearInterval(this.interval);
    },

    render: function() {
        var build = this.state.build;
        if (typeof build.result === "undefined") {
        return <WidgetContainer>
            <LoadingMessage />
        </WidgetContainer>;
        }
        return <WidgetContainer>
            <div>Last Deploy</div>
            <div>{build.fullDisplayName}</div>
            <div>Started by: {build.culprits[0].fullName}</div>
            <div>Result: {build.result}</div>
        </WidgetContainer>;
    }
});

module.exports = DeployWidget;
