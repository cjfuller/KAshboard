/** @jsx React.DOM */

var React = require("react");
window.React = React;

var Dashboard = require("./dashboard.jsx");
var util = require("./util.js");

var RCSS = require("rcss");
RCSS.injectAll();

var screen = parseInt(util.getParameterByName("screen"));

React.renderComponent(
    <Dashboard screen={screen} />,
    document.getElementById('content')
);
