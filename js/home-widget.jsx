var React = require("react");
var RCSS = require("rcss");
var moment = require("moment-timezone");
var _ = require("underscore");

var colors = require("./style/ka-colors.js");
var WidgetContainer = require("./widget-container.jsx");

var styles = require("./style/home-style.js");

var weightedSelect = function(weights) {
    var sumWeight = 0;
    _.each(weights, function(w) {
        sumWeight += w;
    });
    var rand = Math.random() * sumWeight;
    var cumulativeWeight = 0;
    var choice = null;
    _.each(weights, function(w, k) {
        cumulativeWeight += w;
        if (rand < cumulativeWeight) {
            choice = choice || k;
        }
    });
    return choice;
}


var TimeDateWidget = React.createClass({
    tzinfo: {
        mountainView: "America/Los_Angeles",
        newYork: "America/New_York",
        toronto: "America/Toronto",
        windsor: "America/Toronto",
        princeton: "America/New_York",
    },
    updateTimeMs: 1000,
    getTimeWithTz: function() {
        return moment().tz(this.tzinfo[this.props.location]);
    },
    getInitialState: function() {
        return {date: this.getTimeWithTz()};
    },
    getDateInTZ: function() {
        this.setState({date: this.getTimeWithTz()});
    },
    render: function() {
        var date = this.state.date;
        return <div>
            <div className={styles.date.className}>
                {date.format("dddd MMMM DD, YYYY")}
            </div>
            <div className={styles.time.className}>
                {date.format("h:mm:ss A")}
            </div>
        </div>
    },
    componentDidMount: function() {
        this.interval = setInterval(this.getDateInTZ, this.updateTimeMs);
    },
});

// Weather refresh rate, in milliseconds
// Note: Forecast.io is limited to 1000 API calls per day
// 5 minutes => 288 requests/day
var WEATHER_INTERVAL_MS = 5 * 60 * 1000;

var WeatherWidget = React.createClass({

    //dangerously setting weather font characters from a lookup table
    //TODO(colin): is this actually safe if this is happening client-side?
    //
    //TODO(kevin): Use Skycons:
    //http://blog.forecast.io/skycons-unobtrustive-animated-weather-icons/
    weatherCharacterLookup: {
        sunny: "&#xf00d;",
        spacer: "&nbsp;&nbsp;"
    },

    getInitialState: function() {
        return {
            weather: {}
        };
    },

    refreshWeather: function() {
        $.get("http://localhost:3000/weather", function(result) {
            this.setState({weather: result});
        }.bind(this));
    },

    componentDidMount: function() {
        this.refreshWeather();
        this.interval = setInterval(this.refreshWeather, WEATHER_INTERVAL_MS);
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    render: function() {
        if (typeof this.state.weather.temperature !== "number") {
            return <div className={styles.weatherContainer.className}>
                Loading weather...
            </div>;
        }

        var weather = this.weatherCharacterLookup;
        return <div className={styles.weatherContainer.className}>
            <span className={styles.weather.className}
                 dangerouslySetInnerHTML={
                     {__html: (weather[this.props.weather] + weather.spacer)}
                 }/>
            <span className={styles.temperature.className}>
                {Math.round(this.state.weather.temperature) + "\u00b0F"}
            </span>
        </div>
    }
});

var LocationWidget = React.createClass({
    locationDisplayNames: {
        mountainView: "Mountain View",
        newYork: "New York",
        toronto: "Toronto",
        windsor: "Windsor",
        princeton: "Princeton",
    },
    render: function() {
        return <div className={styles.locationHolder.className}>
            <div className={styles.title.className}>
                {this.locationDisplayNames[this.props.location]}
            </div>
            <TimeDateWidget location={this.props.location}/>
            <WeatherWidget weather='sunny'/>
        </div>
    },
});



var HomeWidget = React.createClass({
    weightedHomes: {
        mountainView: 50,
        newYork: 1,
        toronto: 1,
        windsor: 1,
        princeton: 1,
    },
    locationSwitchTimeMs: 30000,

    selectLocation: function() {
        return weightedSelect(this.weightedHomes);
    },
    getInitialState: function() {
        return {location: this.selectLocation()};
    },
    randomizeLocationState: function() {
        this.setState({location: this.selectLocation()});
    },
    render: function() {
        var location = this.state.location;
        return <WidgetContainer sizeClass="doubleWide" color={colors.csDomainColor}>
            <div className={styles.imgHolder.className}>
                <img alt="KA logo"
                    src="/images/khan-logo-vertical-transparent.png"/>
            </div>
            <LocationWidget className={styles.locationWidget.className}
                            location={location}/>
        </WidgetContainer>
    },
    componentDidMount: function() {
        setInterval(this.randomizeLocationState, this.locationSwitchTimeMs);
    },
});

module.exports = HomeWidget;
