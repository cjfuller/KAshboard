/** @jsx React.DOM */

var RCSS = require("rcss");
var React = require("react");

var AtAllWidget = require("./hipchat-widget.jsx");
var DeployWidget = require("./deploy-widget.jsx");
var ErrorGraphWidget = require("./error-graph-widget.jsx");
var ExperimentsWidget = require("./experiments-widget.jsx");
var GAWidget = require("./ga-widget.jsx");
var GHMetaWidget = require("./github-widget.jsx");
var HomeWidget = require("./home-widget.jsx");
var RegistrationsGraphWidget = require("./registrations-graph-widget.jsx");
var RegistrationsWidget = require("./registrations-widget.jsx");
var ScreenSelectorWidget = require("./screen-selector-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var TeamWidget = require("./team-widget.jsx");
var TweetsWidget = require("./tweets-widget.jsx");
var WidgetContainer = require("./widget-container.jsx");

var dashboardClass = require("./style/dashboard-style.js");

var Dashboard = React.createClass({
    render: function() {
        switch (this.props.screen) {
            case 1:
                return <div className={dashboardClass.className}>
                    <HomeWidget/>
                    <GHMetaWidget/>
                    <StoriesWidget />
                    <TweetsWidget />
                    <TeamWidget />
                    <HipChatWidget />
                    <ErrorGraphWidget />
                    <RegistrationsGraphWidget />
                    <RegistrationsWidget />
                    <ExperimentsWidget />
                </div>;
            case 2:
                return <div className={dashboardClass.className}>
                    <DeployWidget />
                </div>;
            default:
                return <div className={dashboardClass.className}>
                    <ScreenSelectorWidget screen={1} />
                    <ScreenSelectorWidget screen={2} />
                </div>;
        }
    }
});

module.exports = Dashboard;
