var q = Promise.resolve('a');
q = q.then(function (_) {
    return 'b';
});
q = q.then(function (result) {
    console.log(result); // 'b'
});