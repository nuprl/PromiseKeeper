var resolve = null;
var reject = null;

var p1 = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
});

var p2 = p1.then(function (value) {
    // prints 42, but not 82.
    console.log(value);
});

resolve(42);
reject(82); // no effect

