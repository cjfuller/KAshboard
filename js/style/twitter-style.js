var RCSS = require("rcss");

var containerStyle = {
    padding: "15px 15px 15px 15px",
};

var tweetStyle = {
};

var imgHolderStyle = {
    float: "left",
    width: "auto",
};

var nameStyle = {
    paddingLeft: "15px",
    paddingTop: "5px",
    float: "left",
    width: "80%",
};

var idInfoStyle = {
    height: "auto",
    float: "left",
    width: "100%",
    marginBottom: "3px",
};

var tweetContainerStyle = {
    paddingTop: "10px",
    paddingBottom: "10px",
    borderBottom: "2px",
    borderBottomStyle: "solid",
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
};

module.exports = {
    container: RCSS.registerClass(containerStyle),
    imgHolder: RCSS.registerClass(imgHolderStyle),
    name: RCSS.registerClass(nameStyle),
    idInfo: RCSS.registerClass(idInfoStyle),
    tweet: RCSS.registerClass(tweetStyle),
    tweetContainer: RCSS.registerClass(tweetContainerStyle),
};
