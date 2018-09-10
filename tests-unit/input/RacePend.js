var p = Promise.race([]);

var p1 = p.then(function (value){
    console.log("resolved");
    return value;
}, function (value) {
    console.log("rejected");
    return value;
});