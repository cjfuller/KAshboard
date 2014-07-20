/** @jsx React.DOM */
var React = require("react");
var _ = require("underscore");
var RCSS = require("rcss");
var moment = require("moment-timezone");
var LoadingMessage = require("./loading-message.jsx");
var WidgetContainer = require("./widget-container.jsx");
var styles = require("./style/github-widget-style.js");
var kaColors = require("./style/ka-colors.js");

// Refresh rate, in milliseconds
// Rate limit for authenticated requests is 5000 requests/hour
// 10 seconds => 360 requests/hour
var INTERVAL_MS = 10000;
var changeListColor = kaColors.testPrepDomainColor;
var fingersColor = kaColors.humanitiesDomainColor;

var FingersCrossedWidget = React.createClass({
    render: function() {
        if (this.props.fingerCount === null) {
            return (
                <WidgetContainer color={fingersColor}>
                    <LoadingMessage />
                </WidgetContainer>
            );
        }
        return (
            <WidgetContainer color={fingersColor}>
                <div className={styles.ghStyleClass.className}>
                    <div className={styles.numberClass.className}>
                        {this.props.fingerCount}
                    </div>
                    <div className={styles.captionClass.className}>
                        number of recent commits tested by crossing fingers
                    </div>
                </div>
            </WidgetContainer>
        );
    }
})

var GitCommit = React.createClass({
    render: function() {
        return (
            <div key={this.props.commit.key}
                 className={styles.listStyleClass.className}>

                <strong>{this.props.commit.name}</strong>: {this.props.commit.text}
            </div>
        );
    },
});

var ChangelistWidget = React.createClass({
    render: function() {
        var changeList = _.map(this.props.changelog, function(c) {
            return (
                <GitCommit commit={c} />
            );
        });
        if (this.props.nRecent === null) {
            return (
                <WidgetContainer color={changeListColor}>
                    <LoadingMessage />
                </WidgetContainer>
            );
        }
        return (
            <WidgetContainer color={changeListColor}>
                <div className={styles.titleClass.className}>
                    Recent website changes
                </div>
                <div className={styles.changelistClass.className}>
                    {changeList}
                    <strong>+{this.props.nRecent} more</strong>
                </div>
            </WidgetContainer>
        );
    },
});

var GHWidget = React.createClass({
    getInitialState: function() {
        return {};
    },
    getCommitData: function() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/github",
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
        });
    },

    componentDidMount: function() {
        this.getCommitData();
        this.interval = setInterval(this.getCommitData, INTERVAL_MS);
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    extractChanges: function(commit) {
        var name = commit.commit.author.name;
        var message = commit.commit.message;

        // Drop the commit if jenkins is the author or [auto] is in the
        // message.
        var jenkins = "Jenny Jenkins";
        var isMergeCommit = commit.parents.length > 1;
        if (name === jenkins || message.match("\\[auto\\]") ||
                message.match(jenkins) || isMergeCommit) {
            return null;
        }

        // Extract the first name
        name = name.split(" ");
        var displayName = name[0];
        //... unless it's a Ben.  Then use the last name.
        if (displayName.match("^Ben") && name[1]) {
            displayName = "B. " + name[1];
        }

        // Get first line of commit message
        var shortMessage = message.split("\n")[0];

        return {
            name: displayName,
            text: shortMessage,
            key: commit.sha.substr(0, 8)
        };


    },

    changelog: function() {
        var changes = _.map(this.state.data, function(c) {
            return this.extractChanges(c);
        }.bind(this));

        changes = _.reject(changes, function(c) {
            return c === null;
        });

        return _.first(changes, 5);
    },

    recentCommitCount: function() {
        if (this.state.data === undefined) {
            return null;
        }
        _.filter(this.state.data, function(d) {
            var dayMs = 86400000;
            return (moment().subtract('1', 'day')
                    .isBefore(moment(d.commit.author.date)));
        }).length;
    },

    crossedFingerCount: function() {
        if (this.state.data === undefined) {
            return null;
        }
        var crossedFingersMessages = [
            "cross fingers",
            "crossed fingers",
            "fingers crossed",
            "squint"
        ];
        var testPlan = "test plan:";

        var didCrossFingers = function(message) {
            return _.any(crossedFingersMessages, function(cfm) {
                return message.match(testPlan + ".*" + cfm);
            });
        };

        return _.reduce(this.state.data,
            function(count, commit) {
                var lc = commit.commit.message.toLowerCase();
                if (didCrossFingers(lc)) {
                    return count + 1;
                } else {
                    return count;
                }
            }, 0);
    },

    render: function() {
        return (
            <div className={styles.ghStyleClass.className}>
                <ChangelistWidget changelog={this.changelog()}
                                  nRecent={this.recentCommitCount()} />
                <FingersCrossedWidget fingerCount={this.crossedFingerCount()} />
            </div>
        );
    },
});

module.exports = GHWidget;
