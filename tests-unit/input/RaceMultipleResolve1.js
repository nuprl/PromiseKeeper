var p1 = new Promise(function(resolve, reject){
    resolve(1);
})
var p2 = new Promise(function(resolve, reject){
    reject(2);
})

var p3 = Promise.race([p1, p2]).then(function(value){
    console.log(value);
    return value;
})

var p4 = Promise.race([p1, p2, p3, 4]).then(function(value){
    console.log(value);
    return value;
})