/** @jsx React.DOM */

var React = require("react");

/**
 * Standard loading message for widgets.
 */
LoadingMessage = React.createClass({
    render: function() {
        return <div>
            <p>Loading...</p>
        </div>;
    }
});

module.exports = LoadingMessage;
