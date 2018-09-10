// new Promise, resolve, then (anon function)

var p = new Promise(function(resolve, reject){ resolve(42); });
var p2 = p.then(function f2(value){
    console.log(value); // prints 42
    return value + 42; // returns 84
});