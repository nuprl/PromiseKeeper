//returning an object to fulfill the promises. onResolve of then is not executed; onReject of catch is exeuted.

var obj = {
    name: "return obj",
    test: "PromiseReturnObjChain2"
};

var p = new Promise(function (resolve, reject){ reject(obj) });
var p2 = p.then(function f1(value){
    console.log(value);
    return value;
}).catch(function f2(value){
    console.log(value);
    return value;
});