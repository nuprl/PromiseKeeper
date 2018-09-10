var fun = function (value) {
    console.log(value);
    return value;
}
var p = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, 'five');
});
var p1 = new Promise(function(resolve, reject) {
    reject(fun(1));
});

var p2 = Promise.race([p, p1]).then(function(value) {
    console.log("resolved by " + value);
    return value;
}, function(value) {
    console.log("rejected by " + value);
    return value;
});

var p3 = new Promise(function(resolve, reject){
    reject(2);
})

var p4 = Promise.race([p2, p3]).then(function(value) {
    console.log("resolved" + value);
    return value;
}, function(value) {
    console.log("rejected" + value);
    return value;
});