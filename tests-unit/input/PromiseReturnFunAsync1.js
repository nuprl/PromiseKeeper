// new Promise, resolve asynchronously via setTimeout with function

var fun = function () {
    return 1;
}

var p = new Promise(function(resolve, reject){
    setTimeout(resolve, 1000, fun);
});

p.then(function(value){
    console.log("value = " + value);
    return value;
});