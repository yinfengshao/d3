// Select the SVG and apply basic formatting.

var svg = d3.select('svg');
var margin = {top:20, right:20, bottom:20, left:50};
var width = svg.attr('width') - margin.left - margin.right;
var height = svg.attr('height') - margin.top - margin.bottom;
var graphic = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Define overall x and y axes.

var x = d3.scaleBand()
.rangeRound([0, width])
.paddingInner(0.05);

var y = d3.scaleBand()
.rangeRound([0, height])
.paddingInner(0.05);

// Define Likert scale colors.

var color = d3.scaleOrdinal()
.range(['#f25500','#f27c3d','#f2a379','#eeeeee','#79c4f2','#3dacf2','#009df2']);

// Load and parse data. This is the beginning of a big '{' that covers the rest of the script.

d3.csv('data/likert.csv', function(d, i, columns) {
  for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  for (i = 2; i < columns.length; ++i) d[columns[i]] = d[columns[i]] / t;
  return d;
 }, function(error, data) {
 if(error) throw error;

 var keys = data.columns.slice(2);

// Assign domains to scales.

 x.domain(data.map(function(d) { return d.Question; }));
 y.domain(data.map(function(d) { return d.Group; }));
 color.domain(keys);

 console.log(data);
 console.log(keys);

});
