var RCSS = require("rcss");
var styleVars = require("./style-vars.js");
var _ = require("underscore");


var containerStyle = {
    padding: "15px 15px 15px 15px",
    fontSize: "1.1em",
};

var titleStyle = _.defaults({
    marginLeft: "0",
    marginBottom: "25px",
    fontSize: "1.3em",
}, styleVars.titleStyle);

module.exports = {
    container: RCSS.registerClass(containerStyle),
    title: RCSS.registerClass(titleStyle),
};