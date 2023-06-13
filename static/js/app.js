const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

// Function which creates a bar chart for top ten OTUs of the given sample (individual).
function createBarChart(indSample) {
  d3.json(URL).then(function(data) {
    let allSamples = data.samples;
    //console.log(allSamples);

    // Create a bar chart for given individual.
    let indSampleInfoArray = allSamples.filter(sample => sample.id == indSample);
    let indSampleInfo = indSampleInfoArray[0];
    //console.log(indSampleInfo);

    // Get the top 10 Otu_ids, sample_values and  otu_labels for the individual.
    let topTenOtu = indSampleInfo.otu_ids.slice(0, 10);
    let topTenSampleValues = indSampleInfo.sample_values.slice(0, 10);
    let topTenOtuLabels = indSampleInfo.otu_labels.slice(0, 10);
    topTenOtu = topTenOtu.map(otuID => "OTU " + otuID);

    //console.log(topTenOtu);
    //console.log(topTenSampleValues);
    //console.log(topTenOtuLabels);

    // Create a horizontal bar chart 
    let trace = {
      x:topTenSampleValues.reverse(),
      y:topTenOtu.reverse(),
      text: topTenOtuLabels.reverse(),
      type: "bar",
      orientation: "h",
    }
    let myData = [trace];
    let layout = {
    title: "Top 10 OTUs of Individual " + indSample,
    titlefont: { color: "black", size: 14},
    margin: { t: 50, r: 50, l: 100, b: 50 },

    };
    Plotly.newPlot("bar", myData, layout);

  });
}

// Function which creates a bubble chart for all OTUs of a given sample (individual).
function createBubbleChart(indSample) {
  d3.json(URL).then(function(data) {
    let allSamples = data.samples;
    //console.log("samples");
    //console.log(allSamples);

    // Create a bar chart for the given individual.
    let indSampleInfoArray = allSamples.filter(sample => sample.id == indSample);
    let indSampleInfo = indSampleInfoArray[0];
    //console.log(indSampleInfo);
    sampleValues = indSampleInfo.sample_values;
    otuIds = indSampleInfo.otu_ids;
    otuLabels = indSampleInfo.otu_labels;

  // Create a bubble chart 
  
  let trace = {
    y:sampleValues,
    x:otuIds,
    text:otuLabels,
    mode: "markers",
    marker:{
      size:sampleValues,
      color:otuIds,
      colorscale: "Earth"
  },
    type: "bubble"
  }
  let myData = [trace];
  let layout = {
    title: "All OTUs of Individual " + indSample,
    titlefont: { color: "black", size: 14},
    hovermode:"closest",
    xaxis:{title:"OTU ID"},
    yaxis:{title:"Sample Values"}          
  };

  Plotly.newPlot("bubble", myData, layout);

});
}

// Display the sample's metadata, i.e., an individual's demographic information.
function displayMetadata(indSample) {
  d3.json(URL).then(function(data) {
    let allMetaData = data.metadata;
    //console.log(allMetaData);

    let metaArray = allMetaData.filter(sample => sample.id == indSample);
    let metaInfo = metaArray[0];
    //console.log("This is the metadata");
    //console.log(metaInfo);

    //Capture the html for the metadata
    let metaPanel = d3.select("#sample-metadata").html("");

    // Add the indinidual's metadata to the container
    Object.entries(metaInfo).forEach(([key, value]) => {
      metaPanel.append("p").text(`${key}: ${value}`);
    });

  });
}

// Create gauge chart  to display the weekly washing frequency of the individual.
function createGaugeChart(indSample) {
  d3.json(URL).then(function(data) {
    let allMetaData = data.metadata;
    let metaArray = allMetaData.filter(sample => sample.id == indSample);
    let wfreq = metaArray[0]["wfreq"];
    //console.log(wfreq);

  // Create gauge
  var gaugeData = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: 'Belly Button Washing Frequency<br> Scrubs per Week',
      titlefont: { color: "black", size: 14},

      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },    
        bgcolor: "green",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "cyan" },
          { range: [1, 2], color: "pink" },
          { range: [2, 3], color: "cyan" },
          { range: [3, 4], color: "pink" },
          { range: [4, 5], color: "cyan" },
          { range: [5, 6], color: "pink" },
          { range: [6, 7], color: "cyan" },
          { range: [7, 8], color: "pink" },
          { range: [8, 9], color: "cyan" },


        ],
        
        
      }
    }
  ];
 

  var layout = {
    width: 390,
    height: 390,
    margin: { t: 35, r: 30, l: 30, b: 25 },

    paper_bgcolor: "lavender",
    font: { color: "darkblue", family: "Arial" },

  };
  
  Plotly.newPlot('gauge', gaugeData, layout);

});
}

// Update dashboard when a new sample is selected. 
function optionChanged(newSample) {
  createBarChart(newSample);
  createBubbleChart(newSample);
  displayMetadata(newSample);
  createGaugeChart(newSample);

}

// Function which initializes a dropdown menu to display the top 10 OTUs found in that individual.
function init() {
  d3.json(URL).then(function(data) {
    let allNames = data.names;
    // console.log(allNames);

    // Select the dropdown menu
    let selecIdNum = d3.select("#selDataset");
    allNames.forEach(name => {
      selecIdNum.append("option").text(name).property("value", name);
    });

    //Initialize the dashboard with the first sample in the list
    createBarChart(940);
    createBubbleChart(940);
    displayMetadata(940);
    createGaugeChart(940);

  });

}

init();
