var globalStyleVars = {
    fontFamily:
        'Proxima Nova, sans-serif',
    backgroundColor: '#333333',
    dashboardWidthPx: 1920,
    dashboardHeightPx: 1080,
    gridSpacing: 15,
    nWide: 5,
    nTall: 3,
    titleStyle:  {
        fontSize: "1.8em",
        marginTop: "10px",
        marginBottom: "10px",
        marginLeft: "10px",
        marginRight: "10px",
        fontWeight: "bold",
    },
    baseComponentWidth: function() {
        return (this.dashboardWidthPx - (this.nWide + 1) *
                this.gridSpacing)/this.nWide;
    },
    baseComponentHeight: function() {
        return (this.dashboardHeightPx - (this.nTall + 1) *
                this.gridSpacing)/this.nTall;
    },
}

module.exports = globalStyleVars;