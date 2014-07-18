/** @jsx React.DOM */

var React = require("react");
window.React = React;

var TestClass = require("./test.jsx");

React.renderComponent(
    <TestClass />,
    document.getElementById('content')
);
