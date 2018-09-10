//calling race

var p1 = new Promise(function(resolve, reject){
    reject(1);
})
var p2 = new Promise(function(resolve, reject){
    reject(2);
})

Promise.race([p1, p2]).then(function(value){
    console.log(value);
    return value;
})