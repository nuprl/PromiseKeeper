// new Promise, resolve, then (named function)

var p = new Promise(function f1(resolve, reject){ resolve(42); });
var p2 = p.then(function f2(value){
    console.log(value); // prints 42
    return value + 42; // returns 84
});