function *rangeRandom(from, to) {
  for(var i = from; i <= to; i++) {
      yield random(1000);
  }
}
function random(m) {
  return (Math.random()*m).toFixed(4);
}

module.exports = function generateData() {
  const names = ['Staff Delegation', 'AAP', 'DCC', 'Council'];
  const dataSet = [...rangeRandom(1, names.length)];
  const sum = dataSet.reduce((a, b) => { return parseFloat(a) + parseFloat(b)} );
  const percent = sum/100;
  return names.map((name, index) => {
    let value = parseFloat(dataSet[index]);
    return {
      name,
      percentage: (value / percent).toFixed(2) + '%',
      value
    }
  });


}
