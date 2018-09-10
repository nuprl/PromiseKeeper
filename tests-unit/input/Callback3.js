var util = require('util');

function add(x, y, callback) {
    callback(null, x + y);
}

function mul(x, y, callback) {
    callback(null, x * y)
}

var addp = util.promisify(add);
var mulp = util.promisify(mul);

var p1 = addp(1, 2);
var p2 = p1.then(function (value) {
    return mulp(value, 3);
});
var p3 = p2.then(function (value) {
    // Prints 9.
    console.log("Result: " + value);
});
