// new Promise, reject, two-arg then, then

var p = new Promise(function (resolve, reject){ reject(42) });
var p2 = p.then(function f1(value){
    console.log(value); // prints 42
    return value + 42; // returns 84
}, function f2(value){
    console.log(value); // prints 42
    return 17; // returns 17
});
var p3 = p2.then(function f3(value){
    console.log(value); // prints 17
})