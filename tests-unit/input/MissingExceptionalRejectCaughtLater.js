// there are no reject reactions and an error is thrown
var p1 = new Promise(function (resolve) {
    resolve(42);
});
p1.then(function (x) {
    throw Error('unhandled error');
}).then(function (y) {
}, function (err) {
    console.log(err);
});
