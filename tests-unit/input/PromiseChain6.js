// Promise.resolve, then, skip several thens, catch

var p = Promise.resolve(17); // creates promise p0
p.then(function f1(value){   // creates promise p1
    throw 77;
}).then(function f2(value){  // creates promise p2
    return 17; // not executed
}).then(function f3(value){  // creates promise p3
    return 18; // not executed
}).then(function f4(value){  // creates promise p4
    return 19; // not executed
}).then(function f5(value){  // creates promise p5
    return 20; // not executed
}).catch(function f6(value){ // creates promise p6
    console.log("value = " + value);
    return value;
})