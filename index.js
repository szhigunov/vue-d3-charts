
const Vue = require('vue');

function getData() {
  return fetch('/data/data.json')
    .then(res => res.json())
    .then((res) => { window.data = res; });
}
const methods = require('./app/vue/methods')

getData().then(()=>{
  new Vue({
    el: '#app',
    data: Object.assign({ active: 0 }, window.data),
    ready() {
      this.drawCanvasHistogram();
      this.draw();
    },
    methods
  });
});
