/** @jsx React.DOM */
var React = require("react");
var _ = require("underscore");

var GHWidget = React.createClass({
    getInitialState: function() {
        return {gists: []};
    },
    getData: function() {
        var url = "https://api.github.com/users/cjfuller/gists";
        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {
                var ids = _.map(data, function(x) {
                    return x.id;
                });
                console.log(ids);

                this.setState({gists: ids});
            }.bind(this),
        });
    },
    componentDidMount: function() {
        this.getData();
    },
    render: function() {
        var ids = _.map(this.state.gists, function(x) {
            return (
                <li>
                    {x}
                </li>
            );
        });
        return (
            <div className="gh-widget">
                Hi, I'm a widget!  My name is { this.props.name }.
                <ul>
                    {ids}
                </ul>
            </div>
        );
    },
});

module.exports = GHWidget;
