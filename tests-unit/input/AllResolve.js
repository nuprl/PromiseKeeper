//calling all

var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise(function(resolve, reject){
    setTimeout(resolve, 1000, 'foo');
});
var p4 = new Promise(function (resolve, reject){ resolve(17) });

Promise.all([p1, p2, p3, p4]).then(function (values) {
    console.log(values); // [3, 1337, "foo", 17]
});