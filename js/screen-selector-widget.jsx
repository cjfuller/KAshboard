/** @jsx React.DOM */

var React = require("react");

var WidgetContainer = require("./widget-container.jsx");

var styles = require("./style/screen-selector-style.js");

var ScreenSelectorWidget = React.createClass({
    propTypes: {
        // Index of screen
        screen: React.PropTypes.number.isRequired
    },

    render: function() {
        return <WidgetContainer>
            <a
                href={"/?screen=" + this.props.screen}
                className={styles.link.className}>
                <div className={styles.linkContainer.className}>
                    <div className={styles.label.className}>
                        Screen
                    </div>
                    <div className={styles.number.className}>
                        {this.props.screen}
                    </div>
                </div>
            </a>
        </WidgetContainer>;
    }
});

module.exports = ScreenSelectorWidget;
