var fun = function () {
    return 1;
}

var p = new Promise(function (resolve, reject) {
    resolve(fun);
});

var p1 = new Promise(function (resolve, reject) {
    reject(fun);
});