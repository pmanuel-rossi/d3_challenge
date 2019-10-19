// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
	top: 30,
	right: 30,
	bottom: 30,
	left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3.select("#scatter").append("svg").attr("height", svgHeight).attr("width", svgWidth);
var tooltip = d3.select("body").append("div").attr("class", "d3-tip")

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
	.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.csv("data/data.csv").then( function (incomeData, error) {
	if (error) throw error;

	console.log(incomeData);

	// Cast the relevant values to integers
	incomeData.forEach(function (d) {
		d.healthcare = +d.healthcare;
		d.poverty = +d.poverty;
	});


	// Add X axis
	var xAxis = d3.scaleLinear().domain([7, d3.max(incomeData, d => d.poverty) + 1]).range([0, chartWidth]);
	svg.append("g")
		.attr("transform", `translate(0, ${chartHeight})`)
		.call(d3.axisBottom(xAxis));

	// Add Y axis
	var yAxis = d3.scaleLinear()
		.domain([0, d3.max(incomeData, d => d.healthcare) + 1])
		.range([chartHeight, 0]);
	svg.append("g").call(d3.axisLeft(yAxis).ticks(5));

	// Add dots
	var elem = svg.append("g").selectAll("dot").data(incomeData)
	var elemEnter = elem.enter()
	var circle = elemEnter.append("circle")
		.attr("class", "stateCircle")
		.attr("cx", function (d) { return xAxis(d.poverty); })
		.attr("cy", function (d) { return yAxis(d.healthcare); })
		.attr("r", 8)

	// add texts
	elemEnter.append("text")
		.attr("x", function (d) { return xAxis(d.poverty); })
		.attr("y", function (d) { return yAxis(d.healthcare) + 3; })
		.attr("class", "stateText")
		.attr("font-size", "8px")
		.text(d => d.abbr)
});