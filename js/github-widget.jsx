/** @jsx React.DOM */
var React = require("react");
var _ = require("underscore");
var RCSS = require("rcss");
var LoadingMessage = require("./loading-message.jsx");
var WidgetContainer = require("./widget-container.jsx");
var styles = require("./style/github-widget-style.js");

// Refresh rate, in milliseconds
var INTERVAL_MS = 30000;

var FingersCrossedWidget = React.createClass({
    render: function() {
        return (
            <div className={styles.ghStyleClass.className}>
                <div className={styles.numberClass.className}>
                    {this.props.fingerCount}
                </div>
                <div className={styles.captionClass.className}>
                    number of recent commits tested by crossing fingers
                </div>
            </div>
        );
    }
})

var ChangelistWidget = React.createClass({
    render: function() {
        var changeList = _.map(this.props.changelog, function(c) {
            return (
                <div key={c.key} className={styles.listStyleClass.className}>
                    <strong>{c.name}</strong>: {c.text}
                </div>
            );
        });
        return (
            <div>
                <div className={styles.titleClass.className}>
                    Recent website changes
                </div>
                <div className={styles.changelistClass.className}>
                    {changeList}
                    <strong>+{this.props.nRecent} more</strong>
                </div>
            </div>
        );
    }
});

var GHWidget = React.createClass({
    getInitialState: function() {
        return {data: []};
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
    render: function() {
        if (this.state.data.length === 0) {
            return <div className={styles.ghStyleClass.className}>
                <WidgetContainer><LoadingMessage /></WidgetContainer>
                <WidgetContainer><LoadingMessage /></WidgetContainer>
            </div>;
        }

        var changelog = _.map(this.state.data, function(c) {
                return this.extractChanges(c);
            }.bind(this));
        
        var recentCommitCount = _.filter(this.state.data, function(d) {
            var dayMs = 86400000;
            return (Date.now() - (new Date(d.commit.author.date)).getTime() < dayMs);
        }).length;
        
        var crossedFingerCount = _.reduce(this.state.data,
            function(count, commit) {
                var lc = commit.commit.message.toLowerCase();
                var crossedFingersMessages = [
                    "cross fingers",
                    "crossed fingers",
                    "fingers crossed",
                    "squint"
                ];
                var testPlan = "test plan:";
                if (_.any(crossedFingersMessages, function(m) {
                    return lc.match(testPlan + ".*" + m);
                })) {
                    return count + 1;
                } else {
                    return count;
                }
            }, 0);

        changelog = _.reject(changelog, function(c) {
            return c === null;
        });
        
        changelog = _.first(changelog, 5);

        return (
            <div className={styles.ghStyleClass.className}>
                <WidgetContainer>
                    <ChangelistWidget changelog={changelog} 
                        nRecent={recentCommitCount}/>
                </WidgetContainer>
                <WidgetContainer>
                    <FingersCrossedWidget fingerCount={crossedFingerCount}/>
                </WidgetContainer>
            </div>
        );
    },
});

module.exports = GHWidget;
