function foo (x) {
    console.log('foo');
}

foo(Promise.resolve(42).then(function () {
    console.log('then');
}));
