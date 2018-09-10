var fs = require('fs');
var util = require('util');

var readFile = util.promisify(fs.readFile);

var p = readFile('./index.js', 'utf8');

p.then(function (result) {
    console.log("Result: " + reason);
}).catch(function (reason) {
    console.log("Error: " + reason);
});
