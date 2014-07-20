/**
 * @jsx React.DOM
 */

var React = require('react');
var WidgetContainer = require('./widget-container.jsx');

var Experiments = React.createClass({

    getInitialState: function() {
        return {
            experiments: null
        };
    },

    componentDidMount: function() {
        $.get('http://localhost:3000/recent_experiments',
            function(result) {
                this.setState({experiments: result});
            }.bind(this)
        );
    },

    render: function() {
        if (!this.state.experiments) {
            return <div>
                <WidgetContainer>
                    <LoadingMessage />
                </WidgetContainer>
            </div>;
        }

        return (<div>
                <WidgetContainer>
                    {this.state.experiments}
                </WidgetContainer>
            </div>
        );
    }
});

module.exports = Experiments;