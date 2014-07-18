/** @jsx React.DOM */

var React = require("react");
window.React = React;

var Dashboard = require("./dashboard.jsx");

React.renderComponent(
    <Dashboard />,
    document.getElementById('content')
);
