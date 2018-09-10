function f () {
    var p = new Promise(function (resolve, reject) {
        setTimeout(resolve, 100);
    });
    p.then(function () {
        return 'hello';
    });
    return p;
}
var p2 = f();
p2.then(function (x) {
    console.log(x);
});
