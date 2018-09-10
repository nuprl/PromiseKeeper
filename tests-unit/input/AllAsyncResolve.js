// we are passing as argument an array of promises that are already resolved,
// to trigger Promise.all as soon as possible
var resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)];

var p = Promise.all(resolvedPromisesArray);
// immediately logging the value of p
console.log(p);

// using setTimeout we can execute code after the stack is empty
setTimeout(function(){
    console.log('the stack is now empty');
    console.log(p);
});

// logs, in order:
// Promise { <state>: "pending" }
// the stack is now empty
// Promise { <state>: "fulfilled", <value>: Array[2] }