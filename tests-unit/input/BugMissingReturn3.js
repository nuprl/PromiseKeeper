// A reaction unintentionally returns undefined.
var p1 = Promise.resolve([1, 2, 3]);

function inc(x) {
    return x + 1;
}

var p2 = p1.then(function (value) {
    console.log(value);
    // ups, Array.prototype.forEach returns undefined.
    return value.forEach(inc);
});

var p3 = p2.then(function (value) {
    // ups, value is now undefined.
    console.log(value)
});
