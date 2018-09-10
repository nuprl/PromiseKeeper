// new Promise, resolve, then, catch

var p = new Promise(function (resolve, reject){ resolve(17) });
var p2 = p.then(function f1(value){
    throw 77;
});
p2.catch(function(result){
    console.log("result = " + result);
})