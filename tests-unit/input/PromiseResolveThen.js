// Promise.resolve(), then

var p1 = Promise.resolve(3);
p1.then(function(value){
    console.log("value = " + value);
    return value+1;
});