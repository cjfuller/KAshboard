/** @jsx React.DOM */

var React = require("react");

var LoadingMessage = require("./loading-message.jsx");

// Number of latest stories to get
var STORIES_COUNT = 20;

/**
 * Renders one of the latest STORIES_COUNT stories on KA.
 */
StoriesWidget = React.createClass({
    getInitialState: function() {
        return {
            name: "",
            date: "",
            teaser: ""
        };
    },

    componentDidMount: function() {
        $.get("http://www.khanacademy.org/api/v1/stories",
              {count: STORIES_COUNT, casing: "camel"},
              function(result) {
            var randIdx = Math.floor(Math.random() * STORIES_COUNT);
            var story = result.stories[randIdx];
            this.setState({
                name: story.name,
                date: story.formattedDate,
                teaser: story.teaser
            });
        }.bind(this));
    },

    render: function() {
        if (!this.state.name) {
            return <div>
                <LoadingMessage />
            </div>;
        }
        return <div>
            <p>{this.state.name}</p>
            <p>{this.state.date}</p>
            <p>{this.state.teaser}</p>
        </div>;
    }
});

module.exports = StoriesWidget;
