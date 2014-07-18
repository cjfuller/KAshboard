/** @jsx React.DOM */

var React = require("react");
window.React = React;

var Dashboard = require("./dashboard.jsx");

var RCSS = require("rcss");
RCSS.injectAll();

React.renderComponent(
    <Dashboard />,
    document.getElementById('content')
);
