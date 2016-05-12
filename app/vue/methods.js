const drawer = require('../drawer.js');
const dataGenerator = require('../dataGenerator.js');
const randomColor = require('randomcolor');

module.exports = {
  changeNav(index) {
    if(this.active == index) return;

    this.active = index;
    this.draw();
  },
  drawCanvasHistogram() {
    const colors = randomColor({
      count: 7,
      hue: 'green'
    });
    this.tabs.forEach((tab, index) => {
      let canvas = document.querySelector("#histogram-"+ index +" > #canvas-tab-" + index);
      let context = canvas.getContext("2d");
      if(tab.showLegend !== false) {
              drawer.legend(tab.dataset, "#histogram-"+ index, colors, 'year');
      }
      drawer.initCanvasHistogram(canvas, context, colors)(tab);
    });
  },
  draw() {
    const canvas = document.querySelector("#piechart > canvas");
    const context = canvas.getContext("2d");
    const data = dataGenerator();
    const colors = randomColor({
       count: 7,
       luminosity: 'dark'
    });

    drawer.legend(data,'#piechart',colors , 'name');
    drawer.initCanvasPie(canvas, context, colors)(data);
  }
};
