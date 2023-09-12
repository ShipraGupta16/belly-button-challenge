// define url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the json data and console log it.
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Global Plotdata value to restrict multiple api callings.
let plotdata;

// testing the promise
dataPromise.then(function(data) {
    console.log("Resolved Promise",data);
});

// init function triggers the initial default state of the app
function init() {
    // Selecting the selDataset Id to inject elements in the DOM
    let dropdownMenu = d3.select("#selDataset");

    // Retrieve data from the url above
    dataPromise.then(data => {
        plotdata = data;
        let names = data.names;

        // iterate over each name and inject dropdown values in the DOM
        for(let name of names) {
            dropdownMenu.append('option')
            .text(name)
            .property("value", name);
        }

    // get firstSample and trigger the bar plot
    let firstSample = names[0];

    // trigger the plots using the first sample
    buildBarPlot(firstSample);
    buildBubblePlot(firstSample)
    buildMetaDataSection(firstSample);
    buildGaugePlot(firstSample);
    });
}

// calling init function
init();

// bar plot builder
function buildBarPlot(sample) {

    // if by mistake the plotdata is lost, we will reset the page to init() mode
    // which sets the plotdata
    if(plotdata === null || plotdata === undefined) {
        init();
        return;
    }

    // retrieve sample data from util function
    let sampleData = sampleDataUtil(sample);

    // set respective properties
    let otu_ids = sampleData.otu_ids;
    let otu_labels =  sampleData.otu_labels;
    let sample_vals = sampleData.sample_values;

    // set x and y axis along with labels
    // pick first 10 elements from each list by using slice(1,10) and use reverse()
    // to sort in descending order
    let yAxis = otu_ids.slice(0,10).map((id) => {
        // append static value OUT in infront of each id
            return 'OUT' + id;
    }).reverse();
    let xAxis = sample_vals.slice(0,10).reverse();
    let labels = otu_labels.slice(0,10).reverse();

    // set bar plot properties
    let barPlot = {
        x: xAxis,
        y: yAxis,
        text: labels,
        type: "bar",
        orientation: "h"
    }

    // trigger plotly to plott a new plot
    Plotly.newPlot("bar", [barPlot])
}


// bubble plot bulilder
function buildBubblePlot(sample) {
    // if by mistake the plotdata is lost, we will reset the page to init() mode
    // which sets the plotdata
    if(plotdata === null || plotdata === undefined) {
        init();
        return;
    }

    // retrieve sample data from util function
    let sampleData = sampleDataUtil(sample);

    // set respective properties
    let otu_ids = sampleData.otu_ids;
    let otu_labels =  sampleData.otu_labels;
    let sample_vals = sampleData.sample_values;

    // set bubble plot properties
    let bubblePlot = {
        x: otu_ids,
            y: sample_vals,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_vals,
                color: otu_ids,
                colorscale: "Earth"
            }
    }

    // trigger plotly to plot a new plot
    Plotly.newPlot("bubble", [bubblePlot]);
}

// build meta data section
function buildMetaDataSection(sample) {
    // if by mistake the plotdata is lost, we will reset the page to init() mode
    // which sets the plotdata
    if(plotdata === null || plotdata === undefined) {
        init();
        return;
    }
    
    // retrieve meta data from util function
    let metaData = metaDataUtil(sample);

    // clear the previous meta data section to replace with new one.
    // if we don't do this, we'll keep appending properties below.
    d3.select('#sample-metadata').html("");

    for(let item in metaData) {
        // select id, and set key {item} and value object[key] 
        d3.select('#sample-metadata').append('h5').text(`${item}: ${metaData[item]}`);
    }
}

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
            mode: "gauge+number",
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


// this get triggered whenever user selects new name option on the UI
// which passes id and all plots/metadata will be updated.
function optionChanged(value) {
    buildBarPlot(value);
    buildBubblePlot(value);
    buildMetaDataSection(value);
    buildGaugePlot(value);
}

// simple util method to access matched sampleData with sample as input
function sampleDataUtil(sample) {
    let samplesData = plotdata.samples;

    let sampleData;

    for(let item of samplesData) {
        if(item.id === sample) {
            sampleData = item;
        }
    }

    return sampleData;
}

// simple util method to access matched metaData with sample as input
function metaDataUtil(sample) {
    let metaData = plotdata.metadata;

    let metaVal;

    for(let item of metaData) {
        if(item.id == sample) {
            metaVal = item;
        }
    }
    return metaVal;
}