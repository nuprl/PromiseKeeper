var p1 = Promise.reject('immediate reject');
var p2 = 1337;
var p3 = new Promise(function(resolve, reject){});
var p4 = new Promise(function (resolve, reject){ resolve(17) });

Promise.all([p1, p2, p3, p4]).then(function (values) {
    console.log('all is resolved');
}).catch(function (reason) {
    console.log(reason);
});