var util = require('util');

function add(x, y, callback) {
    callback(null, x + y);

    // This seemingly has no effect.
    callback(null, x * y);

    // This value seems to be lost.
    return 42;
}

var addp = util.promisify(add);

// This seemingly has no effect:
addp = util.promisify(addp);
addp = util.promisify(addp);
addp = util.promisify(addp);

var p1 = addp(1, 2);
var p2 = p1.then(function (value) {
    console.log("Result: " + value);
});
