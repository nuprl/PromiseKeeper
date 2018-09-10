// A promise is neither resolved nor rejected.
var p1 = new Promise(function (resolve, reject) {
    // resolve and reject are unused.
});

var p2 = p1.then(function (value) {
    // never executed.
    console.log(value);
    return 42;
});
