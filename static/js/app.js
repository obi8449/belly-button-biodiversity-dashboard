// Define the URL of the JSON data file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Declare a variable to store the data
let data;

// fetch the JSON data from the URL
const fetchData = async (url) => {
  const response = await d3.json(url);
  data = response;
};

// populate the sample selector dropdown
const populateSelector = () => {
  const selector = d3.select("#selDataset");
  const sampleNames = data.names;

  selector
    .selectAll("option")
    .data(sampleNames)
    .enter()
    .append("option")
    .text((sample) => sample)
    .property("value", (sample) => sample);
};

// build the charts based on sample
const buildCharts = (sample) => {
  const samples = data.samples;
  const metadata = data.metadata;

  const resultArray = samples.filter((sampleObj) => sampleObj.id == sample);
  const result = resultArray[0];

  const ids = result.otu_ids;
  const labels = result.otu_labels;
  const values = result.sample_values;

// build bar charts
  const yticks = ids
    .map((sampleObj) => `OTU ${sampleObj}  `)
    .slice(0, 10)
    .reverse();

  const barTrace = [{
    x: values.slice(0, 10).reverse(),
    y: yticks,
    type: "bar",
    orientation: "h",
    text: labels.slice(0, 10).reverse(),
  }];

  const barLayout = {
    title: "Top 10 OTU Samples",
  };

  Plotly.newPlot("bar", barTrace, barLayout);

// build bubble chart
  const bubbleTrace = [{
    x: ids,
    y: values,
    text: labels,
    mode: "markers",
    marker: {
      size: values,
      color: ids,
      sizemode: 'area',
      sizeref: 2.0 * Math.max(...values) / (80.0 ** 2),
      colorscale: "Earth",
    },
  }];

  const bubbleLayout = {
    title: "Sample Values Per OTU ID",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    automargin: true,
    hovermode: "closest",
  };

  Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
};

//metadata panel
const buildMetadata = (sample) => {
  const metadata = data.metadata;
  const resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
  const result = resultArray[0];
  const panel = d3.select("#sample-metadata");
  
  panel.html("");

  Object.entries(result).forEach(([key, value]) => {
    panel.append("h6").text(`${key.charAt(0).toUpperCase()}${key.slice(1)}:   ${value}`);
  });
};

const optionChanged = (selectedSample) => {
  buildCharts(selectedSample);
  buildMetadata(selectedSample);
};

// Fetch the data, populate the selector, build initial charts and metadata
(async () => {
  await fetchData(url);
  populateSelector();
  const firstSample = data.names[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
})();
