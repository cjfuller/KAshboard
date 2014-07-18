/** @jsx React.DOM */
var React = require("react");
var _ = require("underscore");
var GHToken = require("./gh-token");

var GHWidget = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    getCommitData: function() {
        var url = "https://api.github.com/repos/Khan/webapp/events";
        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            headers: {
                "Authorization":
                    "Basic " + btoa(GHToken.token + ":" + GHToken.pw)
            },
            success: function(data) {
                var commits = [];
                _.each(data, function(d) {
                    if (d.payload.commits) {
                        commits = commits.concat(d.payload.commits);
                    }
                });
                this.setState({data: commits});
            }.bind(this),
        });
    },

    componentDidMount: function() {
        this.getCommitData();
    },

    extractChanges: function(commit) {
        var name = commit.author.name;
        var message = commit.message;
        
        // Drop the commit if jenkins is the author or [auto] is in the 
        // message.
        var jenkins = "Jenny Jenkins";
        var merge = "Merge";
        if (name === jenkins || message.match("\\[auto\\]") ||
                message.match(jenkins) ||
                message.match(merge)) {
            console.log("returning null for: " + name + " " + message);
            return null;
        }
        
        // Extract the first name, and the part of the commit before Summary:
        var displayName = name.substr(0, name.indexOf(" "));
        if (displayName.length === 0) {
            displayName = name;
        }
        //... unless it's a Ben.  Then use the last name.
        if (displayName.match("^Ben")) {
            displayName = "B. " + name.substr(name.indexOf(" ") + 1);
        }
        
        var summaryStart = message.indexOf("Summary:")
        var fallbackMaxChars = 70;
        var shortMessage = null;
        
        if (summaryStart > 0) {
            shortMessage = message.substr(0, summaryStart);
        } else {
            shortMessage = message.substr(0, fallbackMaxChars);
        }
        
        return displayName + ": " + shortMessage;
        
        
    },
    render: function() {
        var changelog = _.map(this.state.data, function(c) {
                return this.extractChanges(c);
            }.bind(this));
            
        var crossedFingerCount = _.reduce(this.state.data,
            function(count, commit) {
                var lc = commit.message.toLowerCase();
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
        var changeList = _.map(changelog, function(c) {
            return (
                <li>
                    {c}
                </li>
            );
        });
        return (
            <div className="gh-widget">
                Hi, I'm a widget!  My name is { this.props.name }.
                Number of times we've recently tested by crossing our fingers: { crossedFingerCount }
                <ul>
                    {changeList}
                </ul>
            </div>
        );
    },
});

module.exports = GHWidget;
