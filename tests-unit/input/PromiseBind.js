function foo (x) {
    var p0 = Promise.resolve(x);
    return p0.then.bind(p0);
}

foo(function (x) {
    console.log('then: ' + x);
});

/*
function branch (target, onResolved, onRejected) {
    console.log('1111');
    var onError = Promise.reject;

    var interceptor = {
        apply: function apply(receiver) {
            console.log('2222');
            onError = onRejected;
            return receiver();
        },
        get: function get(receiver) {
            console.log('3333');
            onError = onRejected;
            // var temp = receiver.then.bind(receiver);
            // console.log('3333**** ' + (typeof temp));
            // if (typeof receiver.then !== 'undefined')
            return receiver.then.bind(receiver);
        }
    };

    console.log('4444');
    var proxy = new Proxy(target, interceptor);
    var promise = typeof target === 'function' ? proxy() : proxy;

    console.log('5555');
    return promise.then(onResolved, onError);
}

Promise.resolve().then(function () {
    console.log('6666');
    return branch(Promise.resolve(), function () {
        console.log('7777');
        return Promise.resolve('targetResolved');
    }, function () {
        console.log('8888');
        console.log('== before rejection');
        return Promise.resolve('targetRejected');
    });
}).then(function (data) {
    console.log('== second then');
    console.log('data: "' + data + '" should equal "targetResolved"');
});
*/