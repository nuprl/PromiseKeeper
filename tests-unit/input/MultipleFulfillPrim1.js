var num = 1;

var p = new Promise(function (resolve, reject) {
    resolve(num);
});

var p1 = new Promise(function (resolve, reject) {
    reject(num);
});