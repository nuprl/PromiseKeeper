// bypassing a catch in a chain..

var p0 = Promise.resolve(17); // p0
p0.catch(function(value){
    console.log("not printed " + value); // not executed
    return 55;
}).then(function(value){
    console.log(value);
    return 88;
});