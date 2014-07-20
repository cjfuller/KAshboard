/** @jsx React.DOM */

var React = require("react");
var _ = require("underscore");

var WidgetContainer = require("./widget-container.jsx");
var style = require("./style/twitter-style.js");

// Refresh rate, in milliseconds
var INTERVAL_MS = 30000;

/**
 * Represents a single tweet in the Tweets widget.
 */
var Tweet = React.createClass({
    propTypes: {
        // Tweet object
        // https://dev.twitter.com/docs/platform-objects/tweets
        tweet: React.PropTypes.object
    },

    render: function() {
        var tweet = this.props.tweet;
        return <div className={style.tweetContainer.className}>
            <div className={style.idInfo.className}>
                <div className={style.imgHolder.className}>
                    <img src={tweet.user.profile_image_url} />
                </div>
                <div className={style.name.className}>
                    <strong>{tweet.user.name}</strong>
                    {" "}
                    (@{tweet.user.screen_name})
                </div>
            </div>
            <div className={style.tweet.className}>
                {tweet.text}
            </div>
        </div>;
    }
});

var TweetsWidget = React.createClass({
    getInitialState: function() {
        return {tweets: {}};
    },

    refreshTweets: function() {
        $.get("http://localhost:3000/tweets", function(result) {
            this.setState({tweets: result});
        }.bind(this));
    },

    componentDidMount: function() {
        this.refreshTweets();
        this.interval = setInterval(this.refreshTweets, INTERVAL_MS);
    },

    render: function() {
        if (typeof this.state.tweets.statuses !== 'object') {
            return <WidgetContainer sizeClass="doubleTall">
                <LoadingMessage />
            </WidgetContainer>;
        }

        var tweets = this.state.tweets.statuses.map(function(tweet) {
            return <Tweet tweet={tweet} key={tweet.id} />;
        });

        tweets = _.first(tweets, 5);

        return <WidgetContainer sizeClass="doubleTall">
            <div className={style.container.className}>
                {tweets}
            </div>
        </WidgetContainer>;
    }
});

module.exports = TweetsWidget;
