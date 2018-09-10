var fs = require('fs');
var p1 = Promise.resolve(fs.readFile('./LinkedByResolve', '', function foo() {

}));
var p2 = new Promise(function(resolve, reject){
    // resolve(p1);
    return p1;
});
p2.then(function(v){ console.log(v); });


