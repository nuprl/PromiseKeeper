var util = require('util');

function add(x, y, callback) {
    callback(null, x + y)
}

function mul(x, y, callback) {
    callback(null, x * y)
}

function div(x, y, callback) {
    if (y === 0) {
        callback("Division by zero.", null)
    } else {
        callback(null, x / y)
    }
}

var addp = util.promisify(add);
var mulp = util.promisify(mul);
var divp = util.promisify(div);

var p1 = addp(1, 2);
var p2 = p1.then(function (value) {
    return mulp(value, 3);
});
var p3 = p2.then(function (value) {
    // Divide by zero.
    return divp(value, 0);
});
var p4 = p3.then(function (value) {
    // Ignored, the promise has rejected.
    console.log("Result: " + value);
});
var p5 = p4.catch(function (reason) {
    // Prints "Division by zero".
    console.log(reason);
});
