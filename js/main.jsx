/** @jsx React.DOM */

// Sadly, these pollute window, so require them once here.
require("../third_party/highcharts.js");
require("../third_party/highcharts-more.js");

var RCSS = require("rcss");
var React = require("react");
window.React = React;

var Dashboard = require("./dashboard.jsx");
var util = require("./util.js");

RCSS.injectAll();

var screen = parseInt(util.getParameterByName("screen"));

React.renderComponent(
    <Dashboard screen={screen} />,
    document.getElementById('content')
);
