/** @jsx React.DOM */

var React = require("react");

var TestClass = require("./test.jsx");
var GAWidget = require("./ga-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var GHWidget = require("./github-widget.jsx");

var Dashboard = React.createClass({
    render: function() {
        return <div>
            <TestClass />
            <GAWidget name="Analytics Ape" />
            <GHWidget name="Github Gibbon"/>,
            <StoriesWidget />
        </div>;
    }
});

module.exports = Dashboard;
