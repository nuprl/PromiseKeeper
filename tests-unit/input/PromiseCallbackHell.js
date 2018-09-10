// Recreating callback hell
foo(1).then(function (amount) {
    amount ++;
    bar(2, amount).then(function (update) {
        baz(3).then(function (deletion) {
            console.log('done!');
        });
    });
});

function foo (x) {
    return Promise.resolve(x);
}

function bar (y) {
    return Promise.resolve(y);
}

function baz (z) {
    return Promise.resolve(z);
}