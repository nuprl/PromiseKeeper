var link = require("./Interlink1Dep");

var p = new Promise(function (resolve, reject) {
    resolve(link);
});

var p1 = new Promise(function (resolve, reject) {
    reject(link);
});