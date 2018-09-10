// A reaction unintentionally returns undefined.
var p1 = Promise.resolve([1, 2, 3]);

var p2 = p1.then(function (value) {
    console.log(value);
    value.forEach(function (v) {
        if (v === 2) {
            console.log("Yay, I found it!");
            // ups, this does not return from the then reaction,
            // but from the inner lambda.
            return true;
        }
    })
    // implicitly returns undefined here.
});

var p3 = p2.then(function (value) {
    // ups, value is now undefined.
    console.log(value)
});
