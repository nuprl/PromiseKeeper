// new Promise, resolve, two-arg then, catch (not triggered)

var p = new Promise(function (resolve, reject){ resolve(42) });
var p2 = p.then(function f1(value){
    console.log(value); // prints 42
    return value + 42; // returns 84
}, function f2(value){
    console.log(value); // not executed
    return 17;
});
var p3 = p2.catch(function f3(value){ // not executed
    console.log(value); // not executed
})