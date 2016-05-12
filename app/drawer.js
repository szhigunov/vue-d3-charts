const d3 = require('d3');
const {arc, pie} = require('d3-shape');
const {scaleBand, scaleLinear} = require('d3-scale');

function legend(data, selector, colors, valuename) {
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
    .attr("fill",function(d, index){ return colors[index] || '#ccc' });
    // second column for each segment.
    tr.append("td").text(function(d){ return d[valuename] });
    // third column for each segment. disabled
    /*
    tr.append("td").attr("class",'legendFreq')
        .text(function(d){ return d.percentage; }); */

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
function initCanvasHistogram(canvas, context, colors) {
  const margin = {top: 20, right: 20, bottom: 30, left: 80};
  const width = canvas.width - margin.left - margin.right;
  const height = canvas.height - margin.top - margin.bottom;
  const chartProps = { x: {
      axis: {
         textAlign: 'center',
         textBaseline: 'top',
         lineWidth: (data.verticalLine && data.verticalLine.x) || '1',
         strokeStyle: (data.verticalLine && data.verticalLine.color) || 'black'
      }
  }, y: {
      axis: {
         textAlign: 'right',
         textBaseline: 'middle',
         lineWidth: (data.horizontalLine && data.horizontalLine.y) || '1',
         strokeStyle: (data.horizontalLine && data.horizontalLine.color) || 'black'
      }
  } };

  const x = scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

  const y = scaleLinear()
    .rangeRound([height, 0]);

context.translate(margin.left, margin.top);

return function(data) {
  x.domain(data.dataset.map(function(d) { return d.year; }));
  y.domain([1, 5]);

  const yTickCount = 5;
  const yTicks = y.ticks(yTickCount);
  const yTickFormat = y.tickFormat(yTickCount, "");

  function drawXAxis (properties) {
      context.beginPath();
      x.domain().forEach(function(d) {
        context.moveTo(x(d) + x.bandwidth() / 2, height);
        context.lineTo(x(d) + x.bandwidth() / 2, height + 6);
      });
      context.strokeStyle = properties.strokeStyle;
      context.stroke();

      context.textAlign = properties.textAlign;
      context.textBaseline = properties.textBaseline;
      x.domain().forEach(function(d) {
        context.fillText(d, x(d) + x.bandwidth() / 2, height + 6);
      });
  }
  function drawYAxis (properties) {
      context.beginPath();
      context.lineWidth = properties.lineWidth;
      yTicks.forEach(function(d) {
        context.moveTo(-6, y(d) + 0.5);
        context.lineTo(width, y(d) + 0.5);
      });
      context.strokeStyle = properties.strokeStyle;
      context.stroke();

      context.textAlign = properties.textAlign;
      context.textBaseline = properties.textBaseline;
      yTicks.forEach(function(d) {
        context.fillText(yTickFormat(d), -9, y(d));
      });
  }

  function drawSeries(properties = {textAlign : "right", textBaseline: "top", font: "bold 10px sans-serif"}) {
      context.beginPath();
      context.moveTo(-6.5, 0 + 0.5);
      context.lineTo(0.5, 0 + 0.5);
      context.lineTo(0.5, height + 0.5);
      context.lineTo(-6.5, height + 0.5);
      context.strokeStyle = "black";
      context.stroke();

      context.save();
      context.rotate(-Math.PI / 2);
      context.textAlign = properties.textAlign;
      context.textBaseline = properties.textBaseline;
      context.font = properties.font;
      context.fillText(data.yLabel || '', -10, -35);
      context.restore();
  }

  function drawData(data){
      let fillStyle;
      if(!colors || colors.length){
          fillStyle = '#ccc';
      }
      data.forEach((d, i) => {
        let  fillStyle = d.color || colors[i]
        context.fillStyle = fillStyle;
        context.fillRect(x(d.year), y(+d.value), x.bandwidth(), height - y(+d.value));
      });
  }

  drawXAxis(chartProps.x.axis);
  drawYAxis(chartProps.y.axis);
  drawSeries();
  drawData(data.dataset);

  }
}
module.exports = {
  legend,
  initCanvasPie,
  initCanvasHistogram
};
