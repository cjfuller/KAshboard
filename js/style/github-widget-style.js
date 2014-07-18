var RCSS = require('rcss');

var listStyle = {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "15px",
}

var ghWidgetStyle = {
    color: "#dddddd",
}

var numberStyle = {
    fontSize: "10em",
    textAlign: "center",
    marginTop: "20px",
}

var captionStyle = {
    fontSize: "2em",
    textAlign: "center",
    marginTop: "20px",
}

var titleStyle = {
    fontSize: "2em",
    marginTop: "10px",
    marginBottom: "10px",
    paddingLeft: "10px",
}

var changelistStyle = {
    fontSize: "0.8em",
    paddingTop: "10px"
}

module.exports = {
    listStyleClass: RCSS.registerClass(listStyle),
    ghStyleClass: RCSS.registerClass(ghWidgetStyle),
    numberClass: RCSS.registerClass(numberStyle),
    captionClass: RCSS.registerClass(captionStyle),
    titleClass: RCSS.registerClass(titleStyle),
    changelistClass: RCSS.registerClass(changelistStyle),
}