var util = require('util');

function add(x, y, callback) {
    callback(null, x + y);
}

function mul(x, y, callback) {
    callback(null, x * y)
}

var addp = util.promisify(add);

var p1 = addp(1, 2);
var p2 = p1.then(function (value) {
    // Prints 3.
    console.log("Result: " + value);
});
