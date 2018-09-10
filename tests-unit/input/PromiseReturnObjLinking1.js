
var obj = {
    name: "return obj",
    test: "PromiseReturnObjLinking1"
};

var p0 = new Promise(function (resolve, reject){ resolve(obj) }); // p0
var p1 = Promise.resolve(17); // p1
p0.then(function(value){ // creates p2
    console.log(value);
    return p1; // link p2 with p1
}).then(function(value){ // creates p3
    console.log(value);
    return value;
});
