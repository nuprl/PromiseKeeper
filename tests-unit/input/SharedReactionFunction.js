function foo (x) {
    console.log(x);
}

Promise.resolve(1).then(foo);
Promise.resolve(2).then(foo);