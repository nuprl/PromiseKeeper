// assign resolve fun to variable, invoke later

var promises = [];
var resolveFunctions = [];

for (var i=0; i < 2; i++) {
    promises.push(new Promise(function (resolve, reject) {
        resolveFunctions.push(resolve);
    }));
}


promises[0].then(function(value){
    console.log("value = " + value);
    return value;
});
promises[1].then(function(value){
    console.log("value = " + value);
    return value;
});

resolveFunctions[0]('foo');
resolveFunctions[1]('bar');