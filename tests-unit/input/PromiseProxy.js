function branch (target, onResolved, onRejected) {
    var onError = Promise.reject;

    var interceptor = {
        apply: function apply(receiver) {
            onError = onRejected;
            return receiver();
        },
        get: function get(receiver) {
            onError = onRejected;
            if (typeof receiver.then !== 'undefined')
                return receiver.then.bind(receiver);
        }
    };

    console.log('4444');
    var proxy = new Proxy(target, interceptor);
    var promise = typeof target === 'function' ? proxy() : proxy;

    console.log('5555');
    return promise.then(onResolved, onError);
}

branch(Promise.resolve(), function () {}, function () {});
