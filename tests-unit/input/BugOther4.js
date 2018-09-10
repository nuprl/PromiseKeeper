var p1 = Promise.reject(42);

// ups, the value 3.14 is silently ignored -- passing a non-function value should be handled as passing a function(x){ throw x; }
var p2 = p1.then(17, 18);

var p3 = p2.catch(function (value) {
    // ups, this prints 42 and not 18 !!!
    console.log(value)
});

