Promise.resolve('promised value').then(function() {
    throw new Error('error');
});

Promise.reject('error value').catch(function() {
    throw new Error('error');
});

new Promise(function(resolve, reject) {
    throw new Error('error');
});