// bug pattern: fulfill or reject reaction unintentionally returns 'undefined' and this value is used to resolve or reject a dependent promise

var p1 = new Promise(function (resolve, reject) {
    resolve(42);
});
var p2 = p1.then(function (x) {
    console.log(x);
});
var p3 = p2.then(function (x) {
    console.log(x);
});