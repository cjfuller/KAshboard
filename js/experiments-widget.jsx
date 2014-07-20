/** @jsx React.DOM */

var React = require('react');
var WidgetContainer = require('./widget-container.jsx');

var kaColors = require("./style/ka-colors.js");
// TODO(tony): move this out into its own style file...
var styles = require("./style/team-style.js");

// Time to show each experiment, in milliseconds
var INTERVAL_MS = 10000;
var widgetColor = kaColors.csDomainColor;

var Experiments = React.createClass({

    getInitialState: function() {
        return {
            experiments: [],
            idx: 0,
        };
    },

    displayRandomExperiment: function() {
        var nextIdx = Math.floor(Math.random() * this.state.experiments.length);
        this.setState({idx: nextIdx});
    },

    componentDidMount: function() {
        $.get('http://localhost:3000/recent_experiments',
            function(result) {
                var filtered_results = [];
                for (var i = 0; i < result.length; i++) {
                    var exp = result[i];
                    if (exp.description.length < 500
                            // A hack for the hackathon
                            && exp.description.substring(1, 5) !== 'Know') {
                        filtered_results.push(exp);
                    }
                }

                this.setState({experiments: filtered_results});
                this.displayRandomExperiment();
                this.interval = setInterval(this.displayRandomExperiment,
                                            INTERVAL_MS);
            }.bind(this)
        );
    },

    componentWillUnmount: function() {
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
        }
    },

    render: function() {
        if (this.state.experiments.length == 0) {
            return <WidgetContainer color={widgetColor}>
                <LoadingMessage />
            </WidgetContainer>;
        }

        var exp = this.state.experiments[this.state.idx];
        return (<WidgetContainer color={widgetColor}>
            <div className={styles.container.className}>
                <h2>Current Experiments</h2>
                <h3>{exp.display_name}</h3>
                <h4>
                Owner: {exp.owner}
                </h4>
                <p>
                    {exp.description}
                </p>
            </div>
            </WidgetContainer>
        );
    }
});

module.exports = Experiments;
