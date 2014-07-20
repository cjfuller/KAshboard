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
        var now = moment();
        var thisMonth = now.format("YYYY-MM");
        var url = "http://localhost:3000/registrations";
        $.get(url, function(result) {
            if (result.registrations) {
                var registrations = (
                    parseInt(result.registrations[thisMonth]) || 0
                );
                if (this.state.registrations !== registrations) {
                    this.setState({imaginaryRegistrations: 0});
                }

                var beginningOfMonth = moment(thisMonth + "-01");
                var secondsIntoMonth = now.diff(beginningOfMonth) / 1000;
                var registrationsPerSecond = registrations / secondsIntoMonth;

                this.setState({
                    registrations: registrations,
                    registrationsPerSecond: registrationsPerSecond
                });
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

module.exports = FingersCrossedWidget;
