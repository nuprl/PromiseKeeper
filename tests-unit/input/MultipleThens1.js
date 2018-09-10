var p = Promise.resolve('a');
p.then(function () {
    return 'b';
});
p.then(function (result) {
    console.log(result); // 'a'
});