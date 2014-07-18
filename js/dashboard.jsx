/** @jsx React.DOM */

var React = require("react");

var GAWidget = require("./ga-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var TeamWidget = require("./team-widget.jsx");

var Dashboard = React.createClass({
    render: function() {
        return <div>
            <GAWidget name="Analytics Ape" />
            <StoriesWidget />
            <TeamWidget />
        </div>;
    }
});

module.exports = Dashboard;
