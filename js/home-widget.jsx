var React = require("react");
var RCSS = require("rcss");
var moment = require("moment-timezone");
var _ = require("underscore");

var colors = require("./style/ka-colors.js");
var WidgetContainer = require("./widget-container.jsx");
var locationInfo = require("./location-info.js");

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

    convertToDegC: function(temp) {
        return (temp - 32)*5.0/9.0;
    },

    getTemperatureString: function() {
        var temp = this.state.weather.temperature;
        var degrees = locationInfo[this.props.location].degreeUnit;
        if (degrees === "C") {
            temp = this.convertToDegC(temp);
        }
        return Math.round(temp) + "\u00b0" + degrees;
    },

    getInitialState: function() {
        return {
            weather: {}
        };
    },

    refreshWeather: function(location) {
        location = location || this.props.location;

        var locationCoords = locationInfo[location].latLong;
        $.get("http://localhost:3000/weather/" + locationCoords,
                function(result) {
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

        var weather = this.weatherCharacterLookup;
        return <div className={styles.weatherContainer.className}>
            <span className={styles.weather.className}
                 dangerouslySetInnerHTML={
                     {__html: (weather[this.props.weather] + weather.spacer)}
                 }/>
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
            <WeatherWidget weather='sunny' location={this.props.location}/>
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
        var newLocation = this.selectLocation();
        if (newLocation != this.state.location) {
            //TODO(colin): if I don't do this check, will react update the
            //components if there's not a location change?  I don't want to
            //update if the location doesn't change so that we don't run out of
            //free weather API calls.
            this.setState({location: this.selectLocation()});
        }
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
