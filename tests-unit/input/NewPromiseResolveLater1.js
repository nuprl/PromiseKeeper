// assign resolve fun to variable, invoke later

var r1;
var r2;

var p1 = new Promise(function (resolve, reject){ r1 = resolve; });
var p2 = new Promise(function (resolve, reject){ r2 = resolve; });

p1.then(function(value){
    console.log("value = " + value);
});
p2.then(function(value){
    console.log("value = " + value);
});

r1('foo');
r2('bar');