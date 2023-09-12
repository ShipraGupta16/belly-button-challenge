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
        let names = plotdata.names;

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

// calling init function on page refresh or load
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
            return 'OTU' + id;
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