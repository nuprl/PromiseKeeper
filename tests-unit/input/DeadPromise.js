// dead promise bug: promise is created but is never resolved or rejected, hence anything bound to its fulfilment would be dead code

var p = new Promise(function (resolve, reject) {
    console.log('p');
    // do not resolve/reject promise here or outside
});
p.then(function (x) {console.log(x)});
