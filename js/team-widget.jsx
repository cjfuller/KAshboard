/** @jsx React.DOM */

var React = require("react");

/**
 * Displays name and picture of a random member of the team.
 *
 * TODO(kevin): Implement this.
 */
TeamWidget = React.createClass({
    getInitialState: function() {
        return {
            name: "",
            imageUrl: ""
        };
    },

    componentDidMount: function() {
        this.setState({
            name: "Toby",
            imageUrl: "https://www.kastatic.org/images/headshots/toby.jpg"
        });
    },

    render: function() {
        if (!this.state.name) {
            return <div>
                <LoadingMessage />
            </div>;
        }
        return <div>
            <p>{this.state.name}</p>
            <img src={this.state.imageUrl} />
        </div>;
    }
});

module.exports = TeamWidget;
