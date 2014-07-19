var React = require("react");
var RCSS = require("rcss");

var colors = require("./style/ka-colors.js");
var WidgetContainer = require("./widget-container.jsx");

var styles = require("./style/home-style.js");

var HomeWidget = React.createClass({
    render: function() {
        return <WidgetContainer sizeClass="doubleWide" color={colors.kaGreen}>
            <div className={styles.className}>
                <img alt="KA logo" 
                    src="/images/khan-logo-vertical-transparent.png"/>
            </div>
        </WidgetContainer>
    }
});

module.exports = HomeWidget