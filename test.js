const fs = require('fs');


const programming3 = require('./programming3.js');
const MinCutter = programming3.MinCutter;

const contents = fs.readFileSync('kargerMinCut.txt', 'utf8').split('\r\n');
let minc = new MinCutter(contents);

let b = minc.find_mincut(1000000000000000000000);

console.log(b);


