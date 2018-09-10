// new Promise, resolve, then, then, catch

var p = new Promise(function (resolve, reject){ resolve(17) });
var p2 = p.then(function f1(value){
    console.log(value); // prints 17
    return value+1;
}).then(function f2(value){
    console.log(value); // prints 18
    throw value+1; // causes the promise to be rejected with value 19
}).catch(function f3(value){
    console.log(value); // prints 19
});