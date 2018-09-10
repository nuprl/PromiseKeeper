var p0 = Promise.resolve(17);
var p1 = Promise.resolve(18);

var p2 = p1.then(function(value){
   throw p0;
});

p2.then(function(value){
   console.log("value: " + value);
}, function(value){
   console.log("caught: " + value);
   console.log(value instanceof Promise);
});