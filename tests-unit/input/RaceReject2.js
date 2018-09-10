var p = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, 'five');
});
var p1 = new Promise(function(resolve, reject) {
    setTimeout(reject, 100, 'six');
});

var p2 = Promise.race([p, p1]).then(function(value) {
    console.log("resolved");
    return value;
}, function(value) {
    console.log("rejected");
    return value;
});