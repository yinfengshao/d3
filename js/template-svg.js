var svg = d3.select("svg"),
margin = {top: 20, right: 20, bottom: 20, left: 20},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear();
var y = d3.scaleLinear();
