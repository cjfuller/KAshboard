/** @jsx React.DOM */

var moment = require("moment-timezone");
var RCSS = require("rcss");
var React = require("react");
var _ = require("underscore");

var colors = require("./style/ka-colors.js");
var WidgetContainer = require("./widget-container.jsx");
var locationInfo = require("./location-info.js");

var styles = require("./style/home-style.js");

// Animated weather icons
var Skycons = require("../third_party/skycons.js").Skycons;
var skycons = new Skycons();
skycons.play();

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
    updateTimeMs: 1000,
    getTimeWithTz: function() {
        return moment().tz(locationInfo[this.props.location].tz);
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
                {date.format("h:mm A")}
            </div>
        </div>
    },
    componentDidMount: function() {
        this.interval = setInterval(this.getDateInTZ, this.updateTimeMs);
    },
    
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
});

// Weather refresh rate, in milliseconds
// Note: Forecast.io is limited to 1000 API calls per day
// 5 minutes => 288 requests/day
var WEATHER_INTERVAL_MS = 5 * 60 * 1000;

var WeatherWidget = React.createClass({
    getTemperatureString: function() {
        var temp = this.state.weather.temperature;
        var degrees = locationInfo[this.props.location].degreeUnit;
        return Math.round(temp) + "\u00b0" + degrees;
    },

    getInitialState: function() {
        return {
            weather: {}
        };
    },

    refreshWeather: function(location) {
        location = location || this.props.location;

        if (locationInfo[location].latLong) {
            var locationCoords = locationInfo[location].latLong;
            var units = (locationInfo[location].degreeUnit === "C" ?
                            "si" : "us");
            $.get("http://localhost:3000/weather/" + locationCoords +
                    "?units=" + units, function(result) {
                this.setState({weather: result});
                skycons.set("skycon", result.icon);
            }.bind(this));
        } else {
            this.setState({weather: locationInfo[location].staticWeatherInfo});
            skycons.set("skycon",
                        locationInfo[location].staticWeatherInfo.icon);
        }
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

    componentWillReceiveProps: function(nextProps) {
        this.refreshWeather(nextProps.location);
        //TODO(colin): the old temperature info is displayed for a split second
        //on the new location while the request completes.  Fix this.
    },

    render: function() {
        if (typeof this.state.weather.temperature !== "number") {
            return <div className={styles.weatherContainer.className}>
                Loading weather...
            </div>;
        }

        return <div className={styles.weatherContainer.className}>
            <canvas
                id="skycon"
                className={styles.weather.className}
                width="50"
                height="50" />
            <span className={styles.temperature.className}>
                {this.getTemperatureString()}
            </span>
        </div>
    }
});

var LocationWidget = React.createClass({

    render: function() {
        return <div className={styles.locationHolder.className}>
            <div className={styles.title.className}>
                {locationInfo[this.props.location].displayName}
            </div>
            <TimeDateWidget location={this.props.location}/>
            <WeatherWidget location={this.props.location}/>
        </div>
    },
});


var HomeWidget = React.createClass({

    locationSwitchTimeMs: 30000,

    selectLocation: function() {
        var weights = {};
        _.each(locationInfo, function(info, loc) {
            weights[loc] = info.weight;
        });
        return weightedSelect(weights);
    },
    getInitialState: function() {
        return {location: this.selectLocation()};
    },
    randomizeLocationState: function() {
        this.setState({location: this.selectLocation()});
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextState.location !== this.state.location;
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
        this.interval = setInterval(this.randomizeLocationState,
            this.locationSwitchTimeMs);
    },
    
    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },
});

module.exports = HomeWidget;
