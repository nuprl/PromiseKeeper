var obj = {
    name: "return obj",
    test: ""
};

var p = new Promise(function (resolve, reject) {
    resolve(obj);
});

obj.test = "MultipleFulfillObj2";

var p1 = p.then(function (value){
    console.log("resolved: " + value.test);
    return value;
}, function (value){
    console.log("rejected: " + value.test);
    return value;
})