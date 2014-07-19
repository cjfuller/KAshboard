var RCSS = require("rcss");
var _ = require("underscore");

var vars = require("./style-vars.js");
var colors = require("./ka-colors.js");

var styles = {
    container: RCSS.registerClass({
        padding: "10px 10px 10px 10px",
    }),
    title: RCSS.registerClass(_.defaults({
        marginLeft: 0,
    }, vars.titleStyle)),
    text: RCSS.registerClass({
        marginTop: "10px",
    }),
};

module.exports = styles;