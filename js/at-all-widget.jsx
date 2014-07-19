/** @jsx React.DOM */

var React = require("react");

var WidgetContainer = require('./widget-container.jsx');

// Refresh rate, in milliseconds
var INTERVAL_MS = 10000;

/**
 * Displays the last @all in the Khan Academy HipChat room.
 */
AtAllWidget = React.createClass({
    getInitialState: function() {
        return {
            hasLoaded: false,
            message: {}
        };
    },

    getLatestAtAll: function() {
        $.get("http://localhost:3000/at-all", function(result) {
            // Always show the last cached @all, don't replace with the "No
            // recent @alls" message.
            if (typeof result.message === "string") {
                this.setState({message: result});
            }
            this.setState({hasLoaded: true});
        }.bind(this));
    },

    componentDidMount: function() {
        this.getLatestAtAll();
        this.interval = setInterval(this.getLatestAtAll, INTERVAL_MS);
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    hasMessage: function() {
        return typeof this.state.message.message === "string";
    },

    render: function() {
        if (!this.state.hasLoaded) {
            return <WidgetContainer>
                <div>
                    <LoadingMessage />
                </div>
            </WidgetContainer>;
        }
        if (!this.hasMessage()) {
            return <div>
                <p>No recent @alls.</p>
            </div>;
        }
        var message = this.state.message;
        return <WidgetContainer>
            <div>
                <p>Latest @all in Khan Academy</p>
                <p>{message.from.name} (@{message.from.mention_name})</p>
                <p>{message.message}</p>
                <p>{message.date}</p>
            </div>
        </WidgetContainer>;
    }
});

module.exports = AtAllWidget;
