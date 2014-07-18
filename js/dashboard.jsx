/** @jsx React.DOM */

var React = require("react");
var RCSS = require("rcss");

//var GAWidget = require("./ga-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var GHMetaWidget = require("./github-widget.jsx");
var TeamWidget = require("./team-widget.jsx");
var BigQueryWidget = require("./bq-widget.jsx");
var WidgetContainer = require("./widget-container.jsx");

var globalStyle = {
    fontFamily:
        'Avenir, sans-serif',
    backgroundColor: '#333333',
    width: "1920px",
    height: "1080px",
}

var globalStyleClass = RCSS.registerClass(globalStyle);

var Dashboard = React.createClass({
    render: function() {
        return <div className={globalStyleClass.className}>
            <GHMetaWidget name="Github Gibbon"/>
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
