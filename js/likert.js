// Select the SVG and apply basic formatting.

var svg = d3.select('svg');
var margin = {top:20, right:20, bottom:20, left:50};
var width = svg.attr('width') - margin.left - margin.right;
var height = svg.attr('height') - margin.top - margin.bottom;
var graphic = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Define x and y axes.

var x = d3.scaleLinear();
x.range([0, width]);

var y = d3.scaleBand();
y.rangeRound([0, height]);

// Define a categorical z axis, by color.

var z = d3.scaleOrdinal();
z.range(['#009dff','#66c4ff','#ff9400','#ffbf66']);

// Assign parsed data to attributes.
// This is the beginning of a big open '{' that covers the rest of the graph.

d3.csv('data/likert.csv', function(error, data) {
 data.forEach(function(d) {
  d.month = timeParser(d.month);
  d.selfIn = +d.selfIn;
  d.jointIn = +d.jointIn;
  d.selfOut = +d.selfOut;
  d.jointOut = +d.jointOut;
 });
 if(error) throw error;

 var keys = ['selfIn', 'jointIn', 'selfOut', 'jointOut'];
 var series = d3.stack().keys(keys).offset(d3.stackOffsetDiverging)(data);

// Assign domains to x y and z axes.

 x.domain([
  d3.timeMonth.offset(d3.min(data, function(d) { return d.month; }), -1),
  d3.timeMonth.offset(d3.max(data, function(d) { return d.month; }), 1)]);
 y.domain([
  d3.min(data, function(d) { return d.selfOut + d.jointOut; }),
  d3.max(data, function(d) { return d.selfIn + d.jointIn; })]).nice();
 z.domain(keys);

/*

// Draw the axes.

 var tickPadding = 5;

 graphic.append('g')
 .attr('class', 'axis')
 .attr('transform', 'translate(0,' + y(0) + ')')
 .call(d3.axisBottom(x)
 .tickFormat('')
 .tickSize(0));

 graphic.append('g')
 .attr('class', 'axis')
 .attr('transform', 'translate(0,' + height + ')')
 .call(d3.axisBottom(x)
 .tickSize(0)
 .tickPadding(tickPadding));

 graphic.append('g')
 .attr('class', 'axis')
 .call(d3.axisLeft(y)
 .tickFormat(d3.format('$0'))
 .tickSize(0)
 .tickPadding(tickPadding));

// Draw the bars.

 var barPadding = 2;

 graphic.append('g')
 .selectAll('g')
 .data(series)
 .enter().append('g')
 .attr('fill', function(d) { return z(d.key); })
 .selectAll('rect')
 .data(function(d) { return d; })
 .enter().append('rect')
 .attr('x', function(d) { return x(d.data.month) + barPadding; })
 .attr('y', y(0))
 .attr('width', function(d) { return x(d3.timeMonth.offset(d.data.month, 1)) - x(d.data.month) - barPadding - 1 })
 .attr('height', 0)
 .transition(d3.transition().duration(500))
 .delay(function(d, i) { return (series[0].length - i) * 20; })
 .attr('y', function(d) { return y(d[1]); })
 .attr('height', function(d) { return y(d[0]) - y(d[1]); });

// Draw color legend.

 var legend = graphic.append('g')
 .attr('class', 'legend')
 .attr('transform', 'translate(0, 1)')
 .selectAll('g')
 .data(keys.slice())
 .enter().append('g')
 .attr('transform', function(d, i) { return 'translate(0,' + i * 21 + ')'; });

 legend.append('rect')
 .attr('x', width - 20)
 .attr('width', 20)
 .attr('height', 20)
 .attr('fill', z);

 legend.append('text')
 .attr('x', width - 24)
 .attr('y', 10)
 .attr('dy', '0.2em')
 .text(function(d) { return d; });

*/

});
