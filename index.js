
const Vue = require('vue');
const drawer = require('./app/drawer.js');
const dataGenerator = require('./app/dataGenerator.js');
const randomColor = require('randomcolor');

function getData() {
  return fetch('/data/data.json')
    .then(res => res.json())
    .then((res) => { window.data = res; });
}
const methods = {
  changeNav(index) {
    if(this.active == index) return;

    this.active = index;
    this.draw();
  },
  initCanvasHistogram(index) {
    for( var tab of this.tabs){
      let canvas = document.querySelector("#histogram > #canvas-tab-" + tab.mainTitle);
      let context = canvas.getContext("2d");
      drawer.initCanvasHistogram(canvas, context)(tab);
    }
  },
  draw() {
    const canvas = document.querySelector("#piechart > canvas");
    const context = canvas.getContext("2d");
    const data = dataGenerator();
    const colors = randomColor({
       count: 7,
       luminosity: 'dark'
    });

    drawer.legend(data,'#piechart',colors);
    drawer.initCanvasPie(canvas, context, colors)(data);
  }
};

getData().then(()=>{
  new Vue({
    el: '#app',
    data: Object.assign({ active: 0 }, window.data),
    ready() {
      console.log(this);
      this.draw();
      this.initCanvasHistogram()
    },
    methods
  });
});
