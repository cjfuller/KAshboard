/** @jsx React.DOM */

var React = require("react");

var TestClass = require("./test.jsx");
var GAWidget = require("./ga-widget.jsx");

var Dashboard = React.createClass({
    render: function() {
        return <div>
            <TestClass />
            <GAWidget name="Analytics Ape" />
        </div>;
    }
});

module.exports = Dashboard;
