/** @jsx React.DOM */
var React = require("react");
var moment = require("moment-timezone");

var styles = require("./style/registrations-widget-style.js");
var WidgetContainer = require("./widget-container.jsx");
var kaColors = require("./style/ka-colors.js");
var util = require("./util.js");

var INTERVAL_MS = 10000;

var FingersCrossedWidget = React.createClass({

    getRegistrationCounts: function() {
        var thisMonth = moment().format("YYYY-MM");
        var url = "http://localhost:3000/registrations";
        $.get(url, function(result) {
            if (result.registrations) {
                this.setState({
                    registrations: result.registrations[thisMonth],
                });
            }
        }.bind(this));
    },

    getInitialState: function() {
        return {registrations: 0};
    },

    componentDidMount: function() {
        this.getRegistrationCounts();
        this.interval = setInterval(this.getRegistrationCounts, INTERVAL_MS);
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    render: function() {
        return (
            <WidgetContainer color={kaColors.economicsDomainColor}>
                <div className={styles.container.className}>
                    <div className={styles.number.className}>
                        {util.numberWithCommas(this.state.registrations)}
                    </div>
                    <div className={styles.caption.className}>
                        new registrations so far this month
                    </div>
                </div>
            </WidgetContainer>
        );
    }
});

module.exports = FingersCrossedWidget;
