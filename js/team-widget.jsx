/** @jsx React.DOM */

var React = require("react");

// Time to show each employee, in milliseconds
var INTERVAL_MS = 10000;

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
                <LoadingMessage />
            </div>;
        }
        var employee = this.state.team[this.state.currentIdx];
        return <div>
            <p>{employee.name}</p>
            <p>{employee.title}</p>
            <img src={employee.imageUrl} />
        </div>;
    }
});

module.exports = TeamWidget;
