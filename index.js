// Tell D3 to use the svg element in the html, set the margins for the bar-chart, for example: bottom not to small otherwise you won't see the labels
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 140},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// Declare x- and y-axis
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// Add a group element to the svg
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load tsv data and return all data-entries
d3.tsv("data.tsv", function(d) {
  d.speakers = +d.speakers;
  return d;
}, function(error, data) {
  if (error) throw error;

// Return the letter from the .tsv data on the x-axis and return the value of the frequency of that day on the y-axis
  x.domain(data.map(function(d) { return d.language; }));
  y.domain([0, d3.max(data, function(d) { return d.speakers; })]);

// select the Group element and add x-axis
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
// select the Group element and add y-axis aswell as text-attributes and declare how many ticks you want and changed from percentage to specific amount
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(20))
    .append("text")
      .attr("transform", "rotate(90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Speakers");


// select all alements in svg group, give them the class bar, load the data to create a rectangle based on the value of the data. Changed letter to day, because I changed the data
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.language); })
      .attr("y", function(d) { return y(d.speakers); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.speakers); });
});
