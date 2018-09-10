// branching with implicit return

var p = new Promise(function(resolve, reject){ resolve(42); });
var p2 = p.then(function f2(value){
    console.log(value); // prints 42
});
var p3 = p.then(function f3(value){
    console.log(value); // prints 42
});