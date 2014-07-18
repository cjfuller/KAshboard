/** @jsx React.DOM */
var React = require("react");
var _ = require("underscore");
var RCSS = require("rcss");
var WidgetContainer = require("./widget-container.jsx");

var listStyle = {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "15px",
}

var ghWidgetStyle = {
    color: "#dddddd",
}

var numberStyle = {
    fontSize: "10em",
    textAlign: "center",
    marginTop: "20px",
}

var captionStyle = {
    fontSize: "2em",
    textAlign: "center",
    marginTop: "20px",
}

var titleStyle = {
    fontSize: "2em",
    marginTop: "10px",
    marginBottom: "10px",
    paddingLeft: "10px",
}

var changelistStyle = {
    fontSize: "0.8em",
    paddingTop: "10px"
}

var listStyleClass = RCSS.registerClass(listStyle);
var ghStyleClass = RCSS.registerClass(ghWidgetStyle);
var numberClass = RCSS.registerClass(numberStyle);
var captionClass = RCSS.registerClass(captionStyle);
var titleClass = RCSS.registerClass(titleStyle);
var changelistClass = RCSS.registerClass(changelistStyle);

var FingersCrossedWidget = React.createClass({
    render: function() {
        return (
            <div className={ghStyleClass.className}>
                <div className={numberClass.className}>{this.props.fingerCount}</div>
                <div className={captionClass.className}>
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
                <div key={c.key} className={listStyleClass.className}>
                    <strong>{c.name}</strong>: {c.text}
                </div>
            );
        });
        return (
            <div>
                <div className={titleClass.className}>
                    Recent website changes
                </div>
                <div className={changelistClass.className}>
                    {changeList}
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
        // TODO(colin): github forces pagination of 30 events per page.  Fetch
        // more as needed up to some time cutoff.
        // TODO(colin): github sends back a max allowed polling interval in the
        // headers.  We should read this and check against it when updating.
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/github",
            dataType: 'json',
            success: function(data) {
                var commits = [];
                _.each(data, function(d) {
                    if (d.type === "PushEvent" &&
                        d.payload.ref === "refs/heads/master") {
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
        
        return {
            name: displayName,
            text: shortMessage,
            key: commit.sha.substr(0, 8)
        };
        
        
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

        return (
            <div className={ghStyleClass.className}>
                <WidgetContainer>
                    <ChangelistWidget changelog={changelog}/>
                </WidgetContainer>
                <WidgetContainer>
                    <FingersCrossedWidget fingerCount="3"/>
                </WidgetContainer>
            </div>
        );
    },
});

module.exports = GHWidget;
