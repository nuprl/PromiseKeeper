// create a promise by calling the Promise constructor, and immediately reject it with an object

var obj = {
    name: "return obj",
    test: "PromiseReturnObjectReject"
};

var p = new Promise(function (resolve, reject){ reject(obj) });
