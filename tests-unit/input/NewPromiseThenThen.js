// new Promise, then, then

var p = new Promise(function (resolve, reject){ resolve(42) });
var p2 = p.then(function f1(value){
    console.log(value); // prints 42
    return value + 42; // returns 84
});
var p3 = p2.then(function f2(value){
    console.log(value); // prints 84
    return value+1; // returns 85
});