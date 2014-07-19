var styleVars = require("./style-vars.js");
var kaColors = require("./ka-colors.js");

var HighchartOptions = {
    credits: {
        enabled: false
    },
    chart: {
        type: "spline",
        zoomType: "xy",
        backgroundColor: "rgba(0,0,0,0)",
        width: styleVars.baseComponentWidth(),
        height: styleVars.baseComponentHeight(),
    },
    labels: {
        style: {
            color: kaColors.grayExtraLight,
            fontFamily: "Proxima Nova",
        }
    },
    title: {
        style: {
            color: kaColors.grayExtraLight,
            fontFamily: "Proxima Nova",
        }
    },
    legend: {
        style: {
            color: kaColors.grayExtraLight,
            fontFamily: "Proxima Nova",
        },
        itemStyle: {
            color: kaColors.grayExtraLight,
            fontFamily: "Proxima Nova",
        },
        title: {
            style: {
                color: kaColors.grayExtraLight,
                fontFamily: "Proxima Nova",
            }
        }
    },
    xAxis: {
        labels: {
            style: {
                color: kaColors.grayExtraLight,
            }
        },
        title: {
            style: {
                color: kaColors.grayExtraLight,
                fontFamily: "Proxima Nova",
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: kaColors.grayExtraLight,
                fontFamily: "Proxima Nova",
            }
        },
        title: {
            style: {
                color: kaColors.grayExtraLight,
                fontFamily: "Proxima Nova",
            }
        }
    },
    plotOptions: {
        series: {
            marker: {
                radius: 2
            }
        }
    },
    tooltip: {
        crosshairs: [true, true],
        shared: true
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
