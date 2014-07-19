/** @jsx React.DOM */

var React = require("react");
var moment = require("moment-timezone");

var WidgetContainer = require('./widget-container.jsx');
var styles = require("./style/at-all-style.js");
var kaColors = require("./style/ka-colors.js");


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
            return <WidgetContainer color={kaColors.scienceDomainColor}>
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
        var dateString = moment(message.date).tz("America/Los_Angeles").format("YYYY-MM-DD H:mm:ss z");
        return <WidgetContainer color={kaColors.scienceDomainColor}>
            <div className={styles.container.className} >
                <div className={styles.title.className}>
                    Latest <strong>@all</strong> in Khan Academy
                </div>
                <div>
                    {message.from.name}
                    (<strong>@{message.from.mention_name}</strong>)
                </div>
                <div>{dateString}</div>
                <p>{message.message}</p>
            </div>
        </WidgetContainer>;
    }
});

module.exports = AtAllWidget;
