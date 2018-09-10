// Promise.all is rejected if any of the elements are rejected. For example,
// if you pass in four promises that resolve after a timeout and one promise that rejects immediately,
// then Promise.all will reject immediately

var p1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'one');
});
var p2 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 200, 'two');
});
var p3 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 300, 'three');
});
var p4 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 400, 'four');
});
var p5 = new Promise(function (resolve, reject) {
    reject('reject');
});

Promise.all([p1, p2, p3, p4, p5]).then(function (values) {
    console.log(values);
}, function (reason) {
    console.log(reason)
});

//From console:
//"reject"

//You can also use .catch
Promise.all([p1, p2, p3, p4, p5]).then(function (values) {
    console.log(values);
}).catch(function (reason) {
    console.log(reason)
});

//From console:
//"reject"
