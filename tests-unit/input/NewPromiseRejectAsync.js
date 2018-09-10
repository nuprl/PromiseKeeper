// new Promise, resolve asynchronously via setTimeout

var p = new Promise(function(resolve, reject){
    setTimeout(reject, 1000, 'foo');
});

p.then(function(value){
    console.log("resolve; value = " + value);
    return value;
}, function(value){
    console.log("reject; value = " + value);
    return value;
});