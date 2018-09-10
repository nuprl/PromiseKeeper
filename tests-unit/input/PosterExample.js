var p0 = Promise.resolve('error');
var p1 = new Promise(function (resolve, reject) {
    // never resolved or rejected
    resolve('success');
});
Promise.all([p0, p1]).then(function (values) {
   // do stuff
});
