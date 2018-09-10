var obj = {
    name: "return obj",
    test: ""
};

var p = new Promise(function (resolve, reject) {
    resolve(obj);
});

var p1 = new Promise(function (resolve, reject) {
    reject(obj);
});