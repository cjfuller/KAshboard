/** @jsx React.DOM */

var React = require("react");
var RCSS = require("rcss");

var GAWidget = require("./ga-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var GHMetaWidget = require("./github-widget.jsx");
var TeamWidget = require("./team-widget.jsx");
var ExperimentsWidget = require("./experiments-widget.jsx");
var WidgetContainer = require("./widget-container.jsx");
var AtAllWidget = require("./at-all-widget.jsx");
var HomeWidget = require("./home-widget.jsx");
var RegistrationsWidget = require("./registrations-widget.jsx");
var RegistrationsGraphWidget = require("./registrations-graph-widget.jsx");
var ErrorGraphWidget = require("./error-graph-widget.jsx");
var TweetsWidget = require("./tweets-widget.jsx");

var dashboardClass = require("./style/dashboard-style.js");

var Dashboard = React.createClass({
    render: function() {
        return <div className={dashboardClass.className}>
            <HomeWidget/>
            <GHMetaWidget/>
            <StoriesWidget />
            <TweetsWidget />
            <ErrorGraphWidget />
            <TeamWidget />
            <AtAllWidget />
            <ExperimentsWidget />
            <RegistrationsGraphWidget />
            <RegistrationsWidget />
        </div>;
    }
});

module.exports = Dashboard;
