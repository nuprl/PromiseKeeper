var util = require('util');

function add(x, y, callback) {
    setTimeout(function () {
        callback(null, x + y);
    }, 1000);
}

function mul(x, y, callback) {
    setTimeout(function () {
        callback(null, x * y);
    }, 1000);
}

function div(x, y, callback) {
    setTimeout(function () {
        callback(null, x / y);
    }, 1000);
}

var addp = util.promisify(add);
var mulp = util.promisify(mul);
var divp = util.promisify(div);

var p1 = addp(1, 2);
var p2 = p1.then(function (value) {
    return mulp(value, 3);
});
var p3 = p2.then(function (value) {
    return divp(value, 4);
});
var p4 = p3.then(function (value) {
    // Prints 2.25 after a delay.
    console.log("Result: " + value);
});
