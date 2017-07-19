// Function to remove duplicates from arrays.

function unique(arr) {
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

// Function to turn histogrammed Likert data with into d3 arrays, using d3.stack().offset().

function likert(series, order) {
 if(!((n = series.length) > 1)) return;
 var mid = (order.length - 1) / 2;
 for(var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
  for(yp = yn = 0, i = Math.ceil(mid); i < n; ++i) {
   dy = (d = series[order[i]][j])[1] - d[0];
   if(i === mid) {
    yp += dy / 2;
   } else {
    d[0] = yp;
    d[1] = yp += dy;
   }
  }
  for(yp = yn = 0, i = Math.floor(mid); i >= 0; --i) {
   dy = (d = series[order[i]][j])[1] - d[0];
   if(i === mid) {
    d[1] = yp + dy / 2;
    d[0] = yp -= dy / 2;
   } else {
    d[1] = yp;
    d[0] = yp -= dy;
   }
  }
 }
}

// Load and parse data. This is the beginning of a big '{' that covers the rest of the script.

d3.csv('data/likert.csv', function(d, i, columns) {
  for(i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  for(i = 2; i < columns.length; ++i) d[columns[i]] = d[columns[i]] / t;
  return d;
 }, function(error, data) {
 if(error) throw error;

// Define categorical arrays from the data. This is needed early to define the size of the graphic.

 var questions = unique(data.map(function(d) { return d.Question; }));
 var groups = unique(data.map(function(d) { return d.Group; }));
 var keys = data.columns.slice(2);

// Apply basic formatting.

 var svg = d3.select('svg');
 var margin = {top:40, right:20, bottom:20, left:80};
 var width = 200 * questions.length;
 var height = 40 * groups.length;
 svg.attr('width', width + margin.left + margin.right);
 svg.attr('height', height + margin.top + margin.bottom);
 var graphic = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Define overall x and y axes.

 var x = d3.scaleBand()
 .domain(questions)
 .rangeRound([0, width])
 .paddingInner(0.05)
 .paddingOuter(0);

 var y = d3.scaleBand()
 .domain(groups)
 .rangeRound([0, height])
 .paddingInner(0.05)
 .paddingOuter(0.05);

// Define x and y axes and colors for each Likert scale.

 var xLikert = d3.scaleLinear()
 .domain([-1, 1])
 .rangeRound([0, x.bandwidth()]);

 var yLikert = d3.scaleLinear()
 .domain([0, 1])
 .rangeRound([0, y.bandwidth()]);

 var color = d3.scaleSequential(d3.interpolateRdBu)
 .domain([0, keys.length - 1]);

// Draw legend for questions and groups.

 graphic.append('g')
 .attr('class', 'axis')
 .call(d3.axisTop(x)
 .tickSize(0)
 .tickPadding(10));

 graphic.append('g')
 .attr('class', 'axis')
 .call(d3.axisLeft(y)
 .tickSize(0)
 .tickPadding(10));

// Draw Likert axes for each column.

 graphic.append('g')
 .selectAll('g')
 .data(questions)
 .enter().append('g')
 .attr('class', 'axisLikert')
 .attr('transform', function(d) { return 'translate(' + x(d) + ', 0)'; })
 .call(d3.axisBottom(xLikert)
 .ticks(1)
 .tickFormat(''));

 graphic.append('g')
 .selectAll('g')
 .data(questions)
 .enter().append('g')
 .attr('class', 'axisLikert')
 .attr('transform', function(d) { return 'translate(' + x(d) + ', ' + height + ')'; })
 .call(d3.axisTop(xLikert)
 .ticks(1)
 .tickFormat(''));

 graphic.append('g')
 .selectAll('rect')
 .data(questions)
 .enter().append('rect')
 .attr('class', 'axisLikert')
 .attr('x', function(d) { return Math.ceil(x(d) + xLikert(0)); })
 .attr('y', 0)
 .attr('width', 1)
 .attr('height', height);

// Draw Likert bars.

 graphic.append('g')
 .selectAll('rect')
 .data(d3.stack().keys(keys).offset(likert)(data))
 .enter().append('g')
 .attr('fill', function(d) { return color(d.index); })
 .selectAll('rect')
 .data(function(d) { return d; })
 .enter().append('rect')
 .attr('x', function(d) { return x(d.data['Question']) + xLikert(0); })
 .attr('y', function(d) { return y(d.data['Group']) + yLikert(0.05); })
 .attr('width', 0)
 .attr('height', yLikert(0.9))
 .transition(d3.transition().duration(1000))
 .attr('x', function(d) { return x(d.data['Question']) + xLikert(d[0]); })
 .attr('width', function(d) { return xLikert(d[1]) - xLikert(d[0]); });

});