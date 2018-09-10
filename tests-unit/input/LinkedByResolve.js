var p1 = Promise.resolve(17);
var p2 = new Promise(function(resolve, reject){
    resolve(p1);
});
p2.then(function(v){ console.log(v); });
