//calling race, async resolve
var fun = function (value) {
    console.log(value);
    return value;
}

var p1 = new Promise(function(resolve, reject){
    setTimeout(resolve, 1000, fun(1));
})
var p2 = new Promise(function(resolve, reject){
    resolve(2);
})

Promise.race([p1, p2]).then(function(value){
    console.log(value);
    return value;
})