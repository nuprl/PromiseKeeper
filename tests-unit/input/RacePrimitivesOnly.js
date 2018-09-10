var p = Promise.race([1, 2, 3]);

var p1 = p.then(function (value){
    console.log("resolved");
    return value;
}, function (value) {
    console.log("rejected");
    return value;
})
