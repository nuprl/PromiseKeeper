// A reaction unintentionally returns undefined.
var p1 = Promise.reject(42);

var p2 = p1.then(function (value) {
    console.log(value);
    return 82;
}, function (reason) {
    console.log(reason)
    // ups, forgot a return.
    // the dependent promise is now resolved with undefined.
});

var p3 = p2.then(function (value) {
    // ups, value is now undefined.
    console.log(value)
});
