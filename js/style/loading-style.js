var RCSS = require("rcss");

var containerStyle = {
    marginLeft: "20px",
    marginTop: "20px",
    fontSize: "1.5em",
};

module.exports = {
    container: RCSS.registerClass(containerStyle),
};
