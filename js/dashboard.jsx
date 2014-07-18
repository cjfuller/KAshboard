/** @jsx React.DOM */

var React = require("react");
var RCSS = require("rcss");

//var GAWidget = require("./ga-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var GHWidget = require("./github-widget.jsx");
var TeamWidget = require("./team-widget.jsx");
var BigQueryWidget = require("./bq-widget.jsx");
var WidgetContainer = require("./widget-container.jsx");

var globalStyle = {
    fontFamily:
        'Avenir, sans-serif',
}

var globalStyleClass = RCSS.registerClass(globalStyle);

var Dashboard = React.createClass({
    render: function() {
        return <div className={globalStyleClass.className}>
            <WidgetContainer>
                <GHWidget name="Github Gibbon"/>
            </WidgetContainer>
            <WidgetContainer>
                <StoriesWidget />
            </WidgetContainer>
            <WidgetContainer>
                <TeamWidget />
            </WidgetContainer>
            <WidgetContainer>
                <BigQueryWidget />
            </WidgetContainer>
        </div>;
    }
});

module.exports = Dashboard;
