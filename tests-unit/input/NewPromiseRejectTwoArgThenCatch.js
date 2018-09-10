// new Promise, reject, two-arg then, catch

var p = new Promise(function (resolve, reject){ reject(42) });
var p2 = p.then(function f1(value){
    console.log(value); // not executed
    return value + 42;
}, function f2(value){
    console.log(value); // prints 42
    throw 17; // causes p2 to be rejected with 17
});
var p3 = p2.catch(function f3(value){
    console.log(value); // prints 84
})