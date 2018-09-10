//linking

var p0 = new Promise(function (resolve, reject){ resolve(42) }); // p0
var p1 = Promise.reject(17); // p1
p0.then(function(value){ // creates p2
    console.log("value = " + value);
    return p1; // link p2 with p1
}).then(function(value){ // creates p3
    console.log("value = " + value);
    return 42;
});