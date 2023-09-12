# belly-button-challenge

We are assigned to build an interactive dashboardto explore the Belly Button Biodiversity dataset which is a catalog of microbes residing in human navels.

We are required to build three visualization plots.

### Bar Chart

1) Created a horizontal barchart to show the top 10OTUs found in an individual.
2) Used sample_values as the values, otu_ids as the labels and otu_labels as the hovertext for the barchart.
3) Updated the plot whenever a new sample is selected.

### Bubble Chart

1) Created a bubble chart that show each sample with:
otu_ids for the x values, sample_values for the y values, sample_values for the marker size, otu_ids for the marker colors and otu_labels for the text values.
2) Updated the plot whenever a new sample is selected.

### Demographic info
1) Displayed sample metadata, each key-vale pair from the metadata JSON object

### Guage Chart (optional)

1) Plot the weekly washing frequency of the individual.
2) Modified the example gauge code to account for values ranging from 0 through 9.
3) Updated the chart whenever a new sample is selected.