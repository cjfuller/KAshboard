/** @jsx React.DOM */

var React = require("react");
var WidgetContainer = require('./widget-container.jsx');

var kaColors = require("./style/ka-colors.js");
var styles = require("./style/team-style.js");

// Time to show each employee, in milliseconds
var INTERVAL_MS = 10000;
var widgetColor = kaColors.humanitiesDomainColor;

/**
 * Displays name and picture of a random member of the team.
 */
TeamWidget = React.createClass({
    getInitialState: function() {
        return {
            team: [],
            currentIdx: 0
        };
    },

    displayRandomEmployee: function() {
        var nextIdx = Math.floor(Math.random() * this.state.team.length);
        this.setState({currentIdx: nextIdx});
    },

    componentDidMount: function() {
        $.get("http://localhost:3000/team", function(result) {
            this.setState({team: result});
            this.displayRandomEmployee();
            this.interval = setInterval(this.displayRandomEmployee,
                                        INTERVAL_MS);
        }.bind(this));
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    render: function() {
        if (this.state.team.length === 0) {
            return <div>
                <WidgetContainer color={widgetColor}>
                    <LoadingMessage />
                </WidgetContainer>
            </div>;
        }
        var employee = this.state.team[this.state.currentIdx];
        return <WidgetContainer color={widgetColor}>
            <div className={styles.container.className}>
                <div className={styles.title.className}>
                    The Team
                </div>
                <div className={styles.innerContainer.className}>
                    <div className={styles.textContainer.className}>
                        <div className={styles.name.className}>
                            {employee.name}
                        </div>
                        <p>{employee.title}</p>
                    </div>
                    <img width="150" height="200" src={employee.imageUrl} />
                </div>
            </div>
        </WidgetContainer>;
    }
});

module.exports = TeamWidget;
