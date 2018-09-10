// basic case where there are no reject reactions
var p1 = new Promise(function (resolve) {
    resolve(42);
});
p1.then(function (x) {
}).then(function (y) {
});


// basic case where there are no reject reactions
var p1 = new Promise(function (resolve) {
    resolve(42);
});
p1.then(function (x) {
    // throw Error('unhandled error');
}).then(function (y) {

});
