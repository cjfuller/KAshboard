var _ = require("underscore");

var styleVars = require("./style-vars.js");
var kaColors = require("./ka-colors.js");

var defaultTextStyle = {
    color: kaColors.grayExtraLight,
    fontFamily: "Proxima Nova",
}

var HighchartOptions = {
    credits: {
        enabled: false
    },
    chart: {
        type: "spline",
        backgroundColor: "rgba(0,0,0,0)",
        width: styleVars.baseComponentWidth(),
        height: styleVars.baseComponentHeight(),
    },
    labels: {
        style: defaultTextStyle
    },
    title: {
        style: _.defaults({
            fontSize: "1.8em",
        },defaultTextStyle),
    },
    legend: {
        style: defaultTextStyle,
        itemStyle: defaultTextStyle,
        title: {
            style: defaultTextStyle
        }
    },
    xAxis: {
        labels: {
            style: defaultTextStyle
        },
        title: {
            style: defaultTextStyle
        }
    },
    yAxis: {
        labels: {
            style: defaultTextStyle
        },
        title: {
            style: defaultTextStyle
        },
        gridLineColor: "rgba(192, 192, 192, 0.2)",
    },
    plotOptions: {
        series: {
            marker: {
                radius: 2
            },
            enableMouseTracking: false
        }
    },
    global: {
        useUTC: false
    },
    colors: [
        kaColors.mathDomainColor,
        kaColors.scienceDomainColor,
        kaColors.economicsDomainColor,
        kaColors.csDomainColor,
        kaColors.testPrepDomainColor,
        kaColors.humanitiesDomainColor,
        kaColors.partnerContentDomainColor,
        kaColors.defaultDomainColor,
    ],
};

module.exports = HighchartOptions;
