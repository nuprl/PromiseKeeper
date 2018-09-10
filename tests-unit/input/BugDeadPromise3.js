// A promise is neither resolved nor rejected.
var p1 = new Promise(function (resolve, reject) {
    // resolve and reject are unused.
});

var p2 = new Promise(function (resolve, reject) {
    resolve(42);
});

var p3 = p2.then(function (value) {
    // executed because p2 is resolved with 42.
    console.log(value);
    return p1; // returns p1 which is never resolved.
});

var p4 = p3.then(function (value) {
    // never executed.
    console.log(value);
});
