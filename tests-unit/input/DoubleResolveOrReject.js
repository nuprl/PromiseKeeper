var p = new Promise(function (resolve, reject) {
    resolve(42);
    resolve(41);
    return 1;
});
p.then(function (x) {
    console.log(x);
    return 1;
});