// Function to remove duplicates from arrays.

var unique = function(arr) {
 var m = {};
 var newarr = [];
 for (var i = 0; i < arr.length; i++) {
  var v = arr[i];
  if(!m[v]) {
   newarr.push(v);
   m[v] = true;
  }
 }
 return newarr;
}

// Load and parse data. This is the beginning of a big '{' that covers the rest of the script.

d3.csv('data/likert.csv', function(d, i, columns) {
  for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  for (i = 2; i < columns.length; ++i) d[columns[i]] = Math.round(d[columns[i]] / t * 10000) / 10000;
  return d;
 }, function(error, data) {
 if(error) throw error;

// Define arrays of questions and groups. This is needed early to define the size of the graphic.

 var questions = unique(data.map(function(d) { return d.Question; }));
 var groups = unique(data.map(function(d) { return d.Group; }));
 var keys = data.columns.slice(2);

// Select the SVG and apply basic formatting.

 var svg = d3.select('svg');
 var margin = {top:40, right:20, bottom:20, left:80};
 var barWidth = 160;
 var barHeight = 40;
 var width = barWidth * questions.length;
 var height = barHeight * groups.length;
 svg.attr('width', width + margin.left + margin.right);
 svg.attr('height', height + margin.top + margin.bottom);
 var graphic = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Define overall x and y axes.

 var x = d3.scaleBand()
 .domain(questions)
 .rangeRound([0, width])
 .paddingInner(0.05)
 .paddingOuter(0.05);

 var y = d3.scaleBand()
 .domain(groups)
 .rangeRound([0, height])
 .paddingInner(0.05)
 .paddingOuter(0.05);

// Define x axis for each Likert scale.

 var xInner = d3.scaleLinear()
 .domain([-1, 1])
 .rangeRound([0, x.bandwidth()]);

// Define Likert scale colors.

 var color = d3.scaleOrdinal()
 .domain(keys)
 .range(['#f25500','#f27c3d','#f2a379','#eeeeee','#79c4f2','#3dacf2','#009df2']);

 console.log(data);
 console.log(questions);
 console.log(groups);

 graphic.append('g')
 .attr('class', 'axis')
 .call(d3.axisTop(x)
 .tickSize(0));

 graphic.append('g')
 .attr('class', 'axis')
 .call(d3.axisLeft(y)
 .tickSize(0));

 graphic.append('g')
 .selectAll('rect')
 .data(data)
 .enter().append('rect')
 .attr('x', function(d) { return x(d.Question); })
 .attr('y', function(d) { return y(d.Group); })
 .attr('width', 20)
 .attr('height', 20)
 .attr('fill', color(keys[2]));

});