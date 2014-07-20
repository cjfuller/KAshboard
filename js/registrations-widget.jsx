/** @jsx React.DOM */

var moment = require("moment-timezone");
var React = require("react");

var LoadingMessage = require("./loading-message.jsx");
var WidgetContainer = require("./widget-container.jsx");

var kaColors = require("./style/ka-colors.js");
var styles = require("./style/registrations-widget-style.js");
var util = require("./util.js");

var INTERVAL_MS = 10000;

var RegistrationsWidget = React.createClass({

    getRegistrationCounts: function() {
        var url = "http://localhost:3000/registrations";
        $.get(url, function(result) {
            if (result.registrations) {
                var now = moment();
                var thisMonth = moment([now.year(), now.month()]);
                var thisMonthStr = thisMonth.format("YYYY-MM");
                var registrations = (
                    parseInt(result.registrations[thisMonthStr]) || 0
                );
                if (this.state.registrations !== registrations) {
                    this.setState({imaginaryRegistrations: 0});
                }

                // Calculate registration rate from last month's stats
                var lastMonth = moment([now.year(), now.month() - 1]);
                var lastMonthStr = lastMonth.format("YYYY-MM");
                var registrationsLastMonth = (
                    parseInt(result.registrations[lastMonthStr])
                );
                var secondsInMonth = thisMonth.diff(lastMonth) / 1000;
                var registrationsPerSecond = (registrationsLastMonth /
                                              secondsInMonth);

                this.setState({
                    loaded: true,
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
