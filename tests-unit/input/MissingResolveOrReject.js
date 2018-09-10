// Bug pattern: promise is missing a resolve/reject reaction. The promise is resolve/rejected with a non-undefined value, which will be lost

var p = new Promise(function (resolve, reject) {
    // setTimeout(resolve(42), 5000);
    resolve(42);
});
// p.then is never called and 42 is lost
