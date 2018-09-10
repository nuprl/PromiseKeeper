// new Promise, reject asynchronously via setTimeout with function

var p0 = Promise.resolve("foo");

var fun = function () { //gives a unhandled rejection warning here?
    return p0;
}

var p = new Promise(function(resolve, reject){
    setTimeout(reject, 1000, fun);
});

p.then(function(value){
    console.log("value = " + value);
    return value;
});