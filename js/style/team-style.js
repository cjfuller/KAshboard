var RCSS = require("rcss");
var _ = require("underscore");

var styleVars = require("./style-vars.js");

var containerStyle = {
    padding: "15px 15px 15px 15px",
};

var innerContainerStyle = {
    paddingTop: "30px",
};

var textContainerStyle = {
    float: "left",
    paddingTop: "35px",
    paddingLeft: "5px",
    marginRight: "15px",
    maxWidth: "160px",
    width: "160px",
};

var nameStyle = {
    fontSize: "1.5em",
};

var titleStyle = _.defaults({
    textAlign: "center",
    marginTop: "0",
}, styleVars.titleStyle);

module.exports = {
    container: RCSS.registerClass(containerStyle),
    title: RCSS.registerClass(titleStyle),
    textContainer: RCSS.registerClass(textContainerStyle),
    innerContainer: RCSS.registerClass(innerContainerStyle),
    name: RCSS.registerClass(nameStyle),
};