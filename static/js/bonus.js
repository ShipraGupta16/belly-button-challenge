// build guage plot
function buildGaugePlot(sample) {
    // if by mistake the plotdata is lost, we will reset the page to init() mode
    // which sets the plotdata
    if(plotdata === null || plotdata === undefined) {
        init();
        return;
    }

    // retrieve meta data from util function
    let metaData = metaDataUtil(sample);

    // access wfreq property from meta data
    let washFreq = metaData['wfreq'];

    // set gauge plot properties
    let gaugePlot = {
        value: washFreq,
        domain: {x: [0,1], y: [0,1]},
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: {color: "black", size: 16}
            },
            type: "indicator",
            mode: "number+gauge",
            gauge: {
                axis: {range: [0,9], tickmode: "linear", tick0: 1, dtick: 1},
                // gauge indicator
                bar: {color: "black"},
                // set different color combinations
                steps: [
                    {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                    {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                    {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                    {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
                    {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
                    {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                    {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                    {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
                    {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                    {range: [9, 10], color: "rgba(14, 127, 0, .5)"},
                ]
            } 
    }

    // trigger plotly to plot a new plot
    Plotly.newPlot("gauge", [gaugePlot]);  

}