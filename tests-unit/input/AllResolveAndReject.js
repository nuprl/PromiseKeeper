// this will be counted as if the iterable passed is empty, so it gets fulfilled
var p = Promise.all([1,2,3]);
// this will be counted as if the iterable passed contains only the resolved promise with value "444", so it gets fulfilled
var p2 = Promise.all([1,2,3, Promise.resolve(444)]);
// this will be counted as if the iterable passed contains only the rejected promise with value "555", so it gets rejected
var p3 = Promise.all([1,2,3, Promise.reject(555)]);

// using setTimeout we can execute code after the stack is empty
setTimeout(function(){
    console.log(p);
    console.log(p2);
    console.log(p3);
});

// logs
// Promise { <state>: "fulfilled", <value>: Array[3] }
// Promise { <state>: "fulfilled", <value>: Array[4] }
// Promise { <state>: "rejected", <reason>: 555 }