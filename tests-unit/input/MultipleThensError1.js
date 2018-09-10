var p = Promise.resolve();
p.then(function (_) {
    throw new Error("whoops!");
});
p.then(function (_) {
    console.log('hello!'); // 'hello!'
});