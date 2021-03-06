//
// This is abusive...
//
var util = require('util');

function add(x, y, callback) {
    return Promise.resolve(null).then(function (value) {
        return callback(null, x + y);
    });
}

function mul(x, y, callback) {
    return Promise.resolve(null).then(function (value) {
        return callback(null, x * y);
    });
}

function div(x, y, callback) {
    return Promise.resolve(null).then(function (value) {
        return callback(null, x / y);
    });
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
    return divp(value, 4);
});
var p4 = p3.then(function (value) {
    // Prints 2.25.
    console.log("Result: " + value);
});
