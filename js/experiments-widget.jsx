/**
 * @jsx React.DOM
 */

var React = require('react');
var WidgetContainer = require('./widget-container.jsx');

var Experiments = React.createClass({

    getInitialState: function() {
        return {
            experiments: [],
            idx: null,
        };
    },

    displayRandomExperiment: function() {
        var nextIdx = Math.floor(Math.random() * this.state.experiments.length);
        this.setState({idx: nextIdx});
    },

    componentDidMount: function() {
        $.get('http://localhost:3000/recent_experiments',
            function(result) {
                this.setState({experiments: result});
                this.displayRandomExperiment();
                this.interval = setInterval(this.displayRandomExperiment, 10000);
            }.bind(this)
        );
    },

    render: function() {
        if (this.state.experiments.length == 0) {
            return <WidgetContainer>
                <LoadingMessage />
            </WidgetContainer>;
        }

        var exp = this.state.experiments[this.state.idx];
        return <WidgetContainer>
            {exp}
        </WidgetContainer>;
    }
});

module.exports = Experiments;
