/**
 * @jsx React.DOM
 */

var React = require('react');
var WidgetContainer = require('./widget-container.jsx');

var BigQuery = React.createClass({

    getInitialState: function() {
        return {
            table: null
        };
    },

    componentDidMount: function() {
        $.get('http://localhost:3000/bq-list',
            function(result) {
                console.log(result);
                this.setState({table: result});
            }.bind(this)
        );
    },

    render: function() {
        if (!this.state.table) {
            return <div>
                <WidgetContainer>
                    <LoadingMessage />
                </WidgetContainer>
            </div>;
        }

        return (<div>
                <WidgetContainer>
                    {this.state.table}
                </WidgetContainer>
            </div>
        );
    }
});

module.exports = BigQuery;