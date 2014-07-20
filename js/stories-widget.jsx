/** @jsx React.DOM */

var React = require("react");

var LoadingMessage = require("./loading-message.jsx");
var WidgetContainer = require('./widget-container.jsx');

var colors = require('./style/ka-colors.js');
var styles = require("./style/stories-style.js");

// Time to show each story, in milliseconds
var INTERVAL_MS = 30000;

var widgetColor = colors.mathDomainColor;

/**
 * Cycles through the latest submitted stories on KA.
 *
 * Includes unpublished and private stories.
 */
StoriesWidget = React.createClass({
    getInitialState: function() {
        return {
            stories: [],
            currentIdx: 0
        };
    },

    refreshStories: function() {
        $.get("http://localhost:3000/stories", function(result) {
            // Reset to the first story if there's a new one. Otherwise, show
            // the next story.
            if (this.state.stories.length === 0 ||
                result.stories[0].key !== this.state.stories[0].key) {
                this.setState({
                    stories: result.stories,
                    currentIdx: 0
                });
            } else {
                var nextIdx = ((this.state.currentIdx + 1) %
                               this.state.stories.length);
                this.setState({currentIdx: nextIdx});
            }
        }.bind(this));
    },

    componentDidMount: function() {
        this.refreshStories();
        this.interval = setInterval(this.refreshStories, INTERVAL_MS);
    },

    componentWillUnmount: function() {
        clearInterval(this.interval);
    },

    truncateStory: function(story) {
        var charLimit = 500;
        if (story.story.length > 500) {
            var initialTruncation = story.story.substr(0, charLimit);
            var cleanedUp = initialTruncation.substr(0,
                initialTruncation.lastIndexOf(" "));
            story.story = cleanedUp + "...";
        }
    },

    render: function() {
        if (this.state.stories.length === 0) {
            return <div>
                <WidgetContainer color={widgetColor}>
                    <LoadingMessage />
                </WidgetContainer>
            </div>;
        }
        var story = this.state.stories[this.state.currentIdx];
        this.truncateStory(story);
        return <WidgetContainer color={widgetColor}>
            <div className={styles.container.className}>
                <div className={styles.title.className}>
                    {story.name || "Anonymous"}
                </div>
                <div>{story.formattedDate}</div>
                <div className={styles.text.className}>{story.story}</div>
            </div>
        </WidgetContainer>
    }
});

module.exports = StoriesWidget;
