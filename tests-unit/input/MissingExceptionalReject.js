// bug pattern: promise is implicitly rejected by throwing an exception

var p1 = new Promise(function (resolve, reject) {
    // setTimeout(resolve(42), 5000);
    resolve(42);
});
var p2 = p1.then(function (x) {
    throw Error('unhandled error');
});
// [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js