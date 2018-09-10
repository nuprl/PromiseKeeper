//linking


var p = new Promise(function(resolve, reject){
    setTimeout(resolve, 6000, 'foo');
});

var q = new Promise(function (resolve, reject){ resolve('bar') });
q.then(function(value){
   console.log("q's value was: " + value);
   return p;
}).then(function(value){
    console.log("p's value was: " + value);
    return value;
});


// var p2 = new Promise(function (resolve, reject){ return p; });