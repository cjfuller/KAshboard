/** @jsx React.DOM */

var React = require("react");

var loadingStyle = require("./style/loading-style.js");
/**
 * Standard loading message for widgets.
 */
LoadingMessage = React.createClass({
    render: function() {
        return (
            <div className={loadingStyle.container.className}>
                Loading...
            </div>
        );
    }
});

module.exports = LoadingMessage;
