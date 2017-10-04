// Tell D3 to use the svg element in the html, set the margins for the bar-chart, for example: bottom not to small otherwise you won't see the labels, /Declare x- and y-axis/ Add a group element to the svg/ add tooltip which returns the amount of speakers
var svg = d3.select("svg"),
    margin = {top: 120, right: 20, bottom: 30, left: 120},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]),
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    tool_tip = d3.tip().attr("class", "d3-tip").offset([-15, 0]).html(function(d) { return (d.speakers + " Speakers") })

// Load tsv data and get all the data-entries 
d3.tsv("data.tsv", function (d) {
    d.speakers = +d.speakers;
    return d;
}, function (error, data) {
    if (error) throw error;

    
// Return the language from the .tsv data on the x-axis and create a y-axis based on the maximum value in the data
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
      .call(d3.axisLeft(y).ticks(15))
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")

// select all alements in svg group, give them the class bar, load the data to create a rectangle based on the value of the data. Give rects random color with fill. Added a tooltip on hover with mouseover/mouseout
  g.selectAll(".bar")
    .data(data)
    .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.language); })
      .attr("y", function(d) { return y(d.speakers); })
      .attr("width", x.bandwidth())
      .style("fill", function() { return "hsl(" + Math.random() * 360 + ",100%,50%)"})
      .attr("height", function(d) { return height - y(d.speakers); })
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide)

    
   //Call tooltip     
   svg.call(tool_tip);
});



