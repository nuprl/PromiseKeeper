function branch (target, onResolved, onRejected) {
    var onError = Promise.reject;

    var interceptor = {
        apply: function apply(receiver) {
            onError = onRejected;
            return receiver();
        },
        get: function get(receiver) {
            onError = onRejected;
            return receiver.then.bind(receiver);
        }
    };

    var proxy = new Proxy(target, interceptor);
    var promise = typeof target === 'function' ? proxy() : proxy;

    return promise.then(onResolved, onError);
};

branch(Promise.resolve(), function () {
    return Promise.resolve('targetResolved');
}, function () {
    return Promise.resolve('targetRejected');
}).then(function (data) {
    console.log('data: "' + data + '" should equal "targetResolved"');
});
