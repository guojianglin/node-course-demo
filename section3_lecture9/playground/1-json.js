const fs = require('fs');
const dataBuff = fs.readFileSync('1-json.json');
const data = JSON.parse(dataBuff.toString());

data.name = 'Peter';
data.age = '25';
data.planet = 'Mark';

fs.writeFileSync('1-json.json', JSON.stringify(data));