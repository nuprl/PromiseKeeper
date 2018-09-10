// new Promise, reject, two-arg then, catch

var arr = [0, 1, 2];

var p = new Promise(function (resolve, reject){ reject(arr) });
var p2 = p.then(function f1(value){
    console.log(value);
    return value;
}, function f2(value){
    console.log(value);
    throw 17;
});
var p3 = p2.catch(function f3(value){
    console.log(value);
})