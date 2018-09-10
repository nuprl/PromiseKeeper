// new Promise, resolve asynchronously via setTimeout

var p = new Promise(function(resolve, reject){
    setTimeout(resolve, 1000, 'foo');
});

p.then(function(value){
    console.log("value = " + value);
    return value;
});