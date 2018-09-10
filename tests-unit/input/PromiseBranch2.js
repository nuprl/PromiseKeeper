function branch (target, onResolved, onRejected) {
    var onError = Promise.reject;

    var interceptor = {
        apply: function apply(receiver) {
            // console.log('0 - receiver: ' + receiver);
            onError = onRejected;
            return receiver();
        },
        get: function get(receiver) {
            console.log('1');
            onError = onRejected;
            // console.log('bind on <' + receiver + '>.then');
            // console.log('== ' + typeof receiver.then);
            if (typeof receiver.then !== 'undefined')
                return receiver.then.bind(receiver);
        }
    };

    var proxy = new Proxy(target, interceptor);
    var promise = typeof target === 'function' ? proxy() : proxy;

    return promise.then(onResolved, onError);
};

branch(function () {
    return Promise.resolve();
}, function () {
    return Promise.resolve('targetResolved');
}, function () {
    return Promise.resolve('targetRejected');
}).then(function (data) {
    console.log('data: "' + data + '" should equal "targetResolved"');
});
