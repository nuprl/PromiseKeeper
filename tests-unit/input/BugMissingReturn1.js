// A reaction unintentionally returns undefined.
var p1 = Promise.resolve(42);

var p2 = p1.then(function (value) {
    console.log(value);
    // ups, forgot a return.
});

var p3 = p2.then(function (value) {
    // ups, value is now undefined.
    console.log(value)
});
