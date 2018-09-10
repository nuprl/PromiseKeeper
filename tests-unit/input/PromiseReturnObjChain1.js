//returning an object to fulfill the promises. onResolve of then is executed; onReject of catch is not exeuted.

var obj = {
    name: "return obj",
    test: "PromiseReturnObjChain1"
};

var p = new Promise(function (resolve, reject){ resolve(obj) });
var p2 = p.then(function f1(value){
    console.log(value);
    return value;
}).catch(function f2(value){
    console.log(value);
    return value;
});