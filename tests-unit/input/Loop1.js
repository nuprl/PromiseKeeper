var promises = [];
var i;
for (i=0; i < 10; i++){
    if (i % 2 === 0) {
        promises[i] = Promise.resolve(i);
    } else {
        promises[i] = Promise.reject(i);
    }
}

promises.forEach(function(item, index){
    item.then(function(value){
       console.log("promise " + index + " was fulfilled with value " + value);
    }, function(err){
        console.log("promise " + index + " was rejected with value " + err);
    });
});