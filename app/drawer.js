const d3 = require('d3');
const {arc, pie} = require('d3-shape');
const {scaleBand, scaleLinear} = require('d3-scale');

function legend(data, selector, colors) {
    var leg = {};

    //clear legend
    d3.select(selector).select("table").remove();
    // create table for legend.
    var legend = d3.select(selector).append("table").attr('class','legend');
    // if(legend.children.length) {legend.remove('tbody');}
    // create one row per segment.
    var tr = legend.append("tbody").selectAll("tr").data(data).enter().append("tr");

    // first column for each segment.
    tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
        .attr("width", '16').attr("height", '16')
	.attr("fill",function(d, index){ return colors[index] });
    // second column for each segment.
    tr.append("td").text(function(d){ return d.name });
    // third column for each segment. disabled
    /*
    tr.append("td").attr("class",'legendFreq')
        .text(function(d){ return d.percentage; }); */

    function getLegend(d,aD){ // Utility function to compute percentage.
        return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
    }

    return leg;
}
function initCanvasPie(canvas, context, colors) {
  let width = canvas.width,
      height = canvas.height,
      radius = Math.min(width, height) / 2;

  context.clearRect(0,0, width, height);

  const _arc = arc()
      .outerRadius(radius - 10)
      .innerRadius(0)
      .context(context);

  const labelArc = arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40)
      .context(context);

  const _pie = pie()
      .sort(null)
      .value(function(d) { return d.value; });

  context.translate(width / 2, height / 2);

  return function(data) {
    var arcs = _pie(data);
    arcs.forEach(function(d, i) {
      context.beginPath();
      _arc(d);
      context.fillStyle = colors[i];
      context.fill();
    });

    context.beginPath();
    arcs.forEach(arc);
    context.strokeStyle = "#000";
    context.stroke();

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#fff";
    arcs.forEach(function(d) {
      var c = labelArc.centroid(d);
      context.fillText(d.data.percentage, c[0], c[1]);
    });

    context.translate( -(width / 2), -(height / 2));
  }

};
function initCanvasHistogram(canvas, context) {
  var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = canvas.width - margin.left - margin.right,
    height = canvas.height - margin.top - margin.bottom;

    var x = scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    var y = scaleLinear()
        .rangeRound([height, 0]);

    context.translate(margin.left, margin.top);

    return function(data) {
      x.domain(data.dataset.map(function(d) { return d.year; }));
      y.domain([1, 5]);

      var yTickCount = 5,
          yTicks = y.ticks(yTickCount),
          yTickFormat = y.tickFormat(yTickCount, "");

      context.beginPath();
      x.domain().forEach(function(d) {
        context.moveTo(x(d) + x.bandwidth() / 2, height);
        context.lineTo(x(d) + x.bandwidth() / 2, height + 6);
      });
      context.strokeStyle = "black";
      context.stroke();

      context.textAlign = "center";
      context.textBaseline = "top";
      x.domain().forEach(function(d) {
        context.fillText(d, x(d) + x.bandwidth() / 2, height + 6);
      });

      context.beginPath();
      yTicks.forEach(function(d) {
        context.moveTo(-6, y(d) + 0.5);
        context.lineTo(width, y(d) + 0.5);
      });
      context.strokeStyle = "black";
      context.stroke();

      context.textAlign = "right";
      context.textBaseline = "middle";
      yTicks.forEach(function(d) {
        context.fillText(yTickFormat(d), -9, y(d));
      });

      context.beginPath();
      context.moveTo(-6.5, 0 + 0.5);
      context.lineTo(0.5, 0 + 0.5);
      context.lineTo(0.5, height + 0.5);
      context.lineTo(-6.5, height + 0.5);
      context.strokeStyle = "black";
      context.stroke();

      context.save();
      context.rotate(-Math.PI / 2);
      context.textAlign = "right";
      context.textBaseline = "top";
      context.font = "bold 10px sans-serif";
      context.fillText(data.yLabel, -10, -35);
      context.restore();

      context.fillStyle = "steelblue";
      data.dataset.forEach(function(d) {
        context.fillRect(x(d.year), y(+d.value), x.bandwidth(), height - y(+d.value));
      });
  }
}
module.exports = {
  legend,
  initCanvasPie,
  initCanvasHistogram
};
