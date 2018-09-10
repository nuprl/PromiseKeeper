
var obj = {
    name: "return obj",
    test: "PromiseReturnObjLinking2"
};

var p0 = new Promise(function (resolve, reject){ resolve(obj) }); // p0
var p1 = Promise.reject(17); // p1
p0.then(function(value){ // creates p2
    console.log(value);
    return p1; // link p2 with p1
}).then(function(value){ // creates p3
    console.log(value);
    return value;
});
