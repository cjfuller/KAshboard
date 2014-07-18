/** @jsx React.DOM */

var React = require("react");

var LoadingMessage = require("./loading-message.jsx");

// Number of latest stories to get
var STORIES_COUNT = 20;

// Time to show each story, in milliseconds
var INTERVAL_MS = 10000;

/**
 * Cycles through the latest STORIES_COUNT stories on KA.
 */
StoriesWidget = React.createClass({
    getInitialState: function() {
        return {
            stories: [],
            currentIdx: 0
        };
    },

    renderNextStory: function() {
        var nextIdx = (this.state.currentIdx + 1) % this.state.stories.length;
        this.setState({currentIdx: nextIdx});
    },

    componentDidMount: function() {
        $.get("http://www.khanacademy.org/api/v1/stories",
              {count: STORIES_COUNT, casing: "camel"},
              function(result) {
            this.setState({stories: result.stories});
            this.interval = setInterval(this.renderNextStory, INTERVAL_MS);
        }.bind(this));
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    render: function() {
        if (this.state.stories.length === 0) {
            return <div>
                <LoadingMessage />
            </div>;
        }
        var story = this.state.stories[this.state.currentIdx];
        return <div>
            <p>{story.name}</p>
            <p>{story.formattedDate}</p>
            <p>{story.story}</p>
        </div>;
    }
});

module.exports = StoriesWidget;
