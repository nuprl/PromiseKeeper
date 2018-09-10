var q = Promise.resolve();
q = q.then(function (_) {
    throw new Error("whoops!");
});
q = q.then(function (_) {
    console.log('hello'); // We never reach here
});