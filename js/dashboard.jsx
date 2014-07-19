/** @jsx React.DOM */

var React = require("react");
var RCSS = require("rcss");

//var GAWidget = require("./ga-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var GHMetaWidget = require("./github-widget.jsx");
var TeamWidget = require("./team-widget.jsx");
var BigQueryWidget = require("./bq-widget.jsx");
var WidgetContainer = require("./widget-container.jsx");
var AtAllWidget = require("./at-all-widget.jsx");
var HomeWidget = require("./home-widget.jsx");

var dashboardClass = require("./style/dashboard-style.js");

var Dashboard = React.createClass({
    render: function() {
        return <div className={dashboardClass.className}>
            <HomeWidget/>
            <GHMetaWidget/>
            <StoriesWidget />
            <TeamWidget />
            <BigQueryWidget />
            <AtAllWidget />
        </div>;
    }
});

module.exports = Dashboard;
