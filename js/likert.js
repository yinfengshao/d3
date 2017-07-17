// Select the SVG and apply basic formatting.

var svg = d3.select('svg');
var margin = {top:20, right:20, bottom:20, left:50};
var width = svg.attr('width') - margin.left - margin.right;
var height = svg.attr('height') - margin.top - margin.bottom;
var graphic = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Define x and y axes.

var x = d3.scaleLinear()
.range([0, width])
.domain([-1,1]);

var y = d3.scaleBand()
.rangeRound([0, height])
.paddingInner(0.05);

// Define a categorical z axis, by color.

var z = d3.scaleOrdinal();
z.range(['#eeeeee','#f2a379','#f27c3d','#f25500','#eeeeee','#79c4f2','#3dacf2','#009df2']);

// Assign parsed data to attributes.
// This is the beginning of a big open '{' that covers the rest of the graph.

d3.csv('data/likert.csv', function(error, data) {
 data.forEach(function(d) {
  d.question = d.question;
  d.total = +d.disagreeC + (d.disagreeB * 1) + (d.disagreeA * 1) + (d.neutral * 1) + (d.agreeA * 1) + (d.agreeB * 1) + (d.agreeC * 1);
  d.neg3 = +d.disagreeC / d.total * -1;
  d.neg2 = +d.disagreeB / d.total * -1;
  d.neg1 = +d.disagreeA / d.total * -1;
  d.neuN = +d.neutral / 2 / d.total * -1;
  d.neuP = +d.neutral / 2 / d.total;
  d.pos1 = +d.agreeA / d.total;
  d.pos2 = +d.agreeB / d.total;
  d.pos3 = +d.agreeC / d.total;
 });
 if(error) throw error;

 var keys = ['neuN', 'neg1', 'neg2', 'neg3', 'neuP', 'pos1', 'pos2', 'pos3'];
 var series = d3.stack().keys(keys).offset(d3.stackOffsetDiverging)(data);

// Assign domains to x y and z axes.

 y.domain(data.map(function(d) { return d.question; }));
 z.domain(keys);

 console.log(data);
 console.log(series);

// Draw the bars.

 graphic.append('g')
 .selectAll('g')
 .data(series)
 .enter().append('g')
 .attr('fill', function(d) { return z(d.key); })
 .selectAll('rect')
 .data(function(d) { return d; })
 .enter().append('rect')
 .attr('x', x(0))
 .attr('y', function(d) { return y(d.data.question); })
 .attr('width', 0)
 .attr('height', y.bandwidth())
 .transition(d3.transition().duration(1000))
 .delay(function(d, i) { return i * 50; })
 .attr('x', function(d) { return x(d[0]); })
 .attr('width', function(d) { return x(d[1]) - x(d[0]); });

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
