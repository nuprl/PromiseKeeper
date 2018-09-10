// create a promise by calling the Promise constructor, and immediately resolve it with an object

var obj = {
    name: "return obj",
    test: "PromiseReturnResolve"
};

var p = new Promise(function (resolve, reject){ resolve(obj) });