/** @jsx React.DOM */

var React = require("react");
var RCSS = require("rcss");

var GAWidget = require("./ga-widget.jsx");
var StoriesWidget = require("./stories-widget.jsx");
var GHMetaWidget = require("./github-widget.jsx");
var TeamWidget = require("./team-widget.jsx");
var ExperimentsWidget = require("./experiments-widget.jsx");
var WidgetContainer = require("./widget-container.jsx");
var AtAllWidget = require("./hipchat-widget.jsx");
var HomeWidget = require("./home-widget.jsx");
var RegistrationsWidget = require("./registrations-widget.jsx");
var RegistrationsGraphWidget = require("./registrations-graph-widget.jsx");
var ErrorGraphWidget = require("./error-graph-widget.jsx");
var TweetsWidget = require("./tweets-widget.jsx");
var ScreenSelectorWidget = require("./screen-selector-widget.jsx");
var util = require("./util.js");

var dashboardClass = require("./style/dashboard-style.js");

var Dashboard = React.createClass({
    render: function() {
        var screen = parseInt(util.getParameterByName("screen"));
        switch (screen) {
            case 0:
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
            case 1:
                return <div className={dashboardClass.className}>
                </div>;
            default:
                return <div className={dashboardClass.className}>
                    <ScreenSelectorWidget screen={0} />
                    <ScreenSelectorWidget screen={1} />
                </div>;
        }
    }
});

module.exports = Dashboard;
