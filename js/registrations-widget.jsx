/** @jsx React.DOM */

var moment = require("moment-timezone");
var React = require("react");

var LoadingMessage = require("./loading-message.jsx");
var WidgetContainer = require("./widget-container.jsx");

var kaColors = require("./style/ka-colors.js");
var projection = require("./registration-projection.js");
var styles = require("./style/registrations-widget-style.js");
var util = require("./util.js");

var INTERVAL_MS = 10000;

var RegistrationsWidget = React.createClass({

    getRegistrationCounts: function() {
        var url = "http://localhost:3000/registrations";
        $.get(url, function(result) {
            if (result.registrations) {
                var calculatedState = projection(result.registrations);
                calculatedState.loaded = true;
                this.setState(calculatedState);
            }
        }.bind(this));
    },

    incrementCount: function() {
        this.setState({
            imaginaryRegistrations: (this.state.imaginaryRegistrations +
                                     this.state.registrationsPerSecond)
        });
    },

    getInitialState: function() {
        return {
            loaded: false,
            registrations: 0,
            imaginaryRegistrations: 0,
            registrationsPerSecond: 0
        };
    },

    componentDidMount: function() {
        this.getRegistrationCounts();
        this.interval = setInterval(this.getRegistrationCounts, INTERVAL_MS);
        this.incrementCountInterval = setInterval(this.incrementCount, 1000);
    },

    componentWillUnmount: function() {
        clearInterval(this.interval);
        clearInterval(this.incrementCountInterval);
    },

    render: function() {
        if (!this.state.loaded) {
            return <WidgetContainer color={kaColors.economicsDomainColor}>
                <LoadingMessage />
            </WidgetContainer>;
        }
        var totalRegistrations = Math.floor(
            this.state.registrations + this.state.imaginaryRegistrations);
        return (
            <WidgetContainer color={kaColors.economicsDomainColor}>
                <div className={styles.container.className}>
                    <div className={styles.number.className}>
                        {util.numberWithCommas(totalRegistrations)}
                    </div>
                    <div className={styles.caption.className}>
                        new registrations so far this month
                    </div>
                </div>
            </WidgetContainer>
        );
    }
});

module.exports = RegistrationsWidget;
