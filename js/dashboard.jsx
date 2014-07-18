/** @jsx React.DOM */

var React = require("react");
window.React = React;

var TestClass = require("./test.jsx");
var GAWidget = require("./ga-widget.jsx");

React.renderComponent(
    <TestClass />,
    document.getElementById('content')
);

React.renderComponent(
    <GAWidget name="Analytics Ape"/>,
    document.getElementById('content')
);
