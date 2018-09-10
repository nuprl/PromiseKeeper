//
// Newer versions of Node.js come with a utility function to turn
// callback based functions it promise-returning functions.
//
// This function is called util.promisify and here is how it works.
//
var util = require('util');

//
// Assume we have a function that takes a number, increments it, and invokes the callback with the result.
//
function inc(x, callback) {
    // The callback must be of the form (error, value) => ...
    // Hence we pass `null` as the error.
    callback(null, x + 1);
}

//
// We can turn inc function into a promise-based verrsion with promisify:
//
var incp = util.promisify(inc);

//
// And then we can use it:
//
var p = incp(123);

//
// And inspect the result.
//
p.then(function (result) {
    console.log("Result: " + result)
}).catch(function (reason) {
    console.log("Error: " + reason)
});

