var p0 = Promise.resolve(17);

var identity = function(x){ return x; };
var print = function(x){ console.log(x); };


p0.then(identity,identity).then(identity,identity).then(identity,identity).then(print, print);