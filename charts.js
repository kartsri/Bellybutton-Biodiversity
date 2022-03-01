function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    PANEL.append("h6").text(`ID: ${result.id}`);
    PANEL.append("h6").text(`Ethnicity: ${result.ethnicity}`);
    PANEL.append("h6").text(`Gender: ${result.gender}`);
    PANEL.append("h6").text(`Age: ${result.age}`);
    PANEL.append("h6").text(`Locations: ${result.location}`);
    PANEL.append("h6").text(`BBtype: ${result.bbtype}`);
    PANEL.append("h6").text(`WFREQ: ${result.wfreq}`);

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1.1. Create the buildCharts function.
function buildCharts(sample) {
  // 1.2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 1.3. Create a variable that holds the samples array. 
    let samples = data.samples;
    // console.log(samples);  // working

    // 1.4. Create a variable that filters the samples for the object with the desired sample number.
    let filtSamples = samples.filter(sampleid => sampleid.id == sample);
    // console.log(filtSamples); // working

    // 3.1. Create a variable that filters the metadata array for the object with the desired sample number.
    let filtMeta = data.metadata.filter(i => i.id == sample);
    // console.log(filtMeta);  // working
    
    //  1.5. Create a variable that holds the first sample in the array.
    let filtResult = filtSamples[0];
    // console.log(filtResult); // working

    // 3.2. Create a variable that holds the first sample in the metadata array.
    let filtMetaResult = filtMeta[0];
    // console.log(filtMetaResult) // working

    // 1.6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = filtResult.otu_ids;
    // console.log(otuIds); // working

    let otuLabels = filtResult.otu_labels;
    // console.log(otuLabels); // working

    let sampleValues = filtResult.sample_values;
    // console.log(sampleValues); // working

    // 3.3. Create a variable that holds the washing frequency.
    let wfreq = parseFloat(filtMetaResult.wfreq);
    // console.log(wfreq) // working

    // 1.7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).map(i => 'OTU '+ [i]).reverse();
    var xticks = sampleValues.slice(0,10).reverse();
    // console.log(yticks);

    // 1.8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: 'h'

    }];
    // 1.9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { pad: 15 },
      plot_bgcolor:"black",
      paper_bgcolor:"#FFF3",
      yaxis:{
        automargin: true
      },
      font: {
        size: 18,
        color: '#FFFFFF'
      }    
    };
    // 1.10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    // 2.1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker:{
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    
    }];

    // 2.2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { title: "OTU ID"},
      hovermode: 'closest',
      plot_bgcolor:"black",
      paper_bgcolor:"#FFF3",
      yaxis:{
        automargin: true
      },
      font: {
        size: 18,
        color: '#FFFFFF'
      }    
    };

    // 2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    // 3.4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Washing Per Week", font: {size:24} },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: { color: "black" },
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ],
        }
      }
    ];
    
    // 3.5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 10, b: 10 },
      plot_bgcolor:"black",
      paper_bgcolor:"#FFF3",
      yaxis:{
        automargin: true
      },
      font: {
        size: 18,
        color: '#FFFFFF'
      }    
    };

    // 3.6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);

  });
};
