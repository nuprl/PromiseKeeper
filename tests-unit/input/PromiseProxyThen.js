var target = Promise.resolve(42);
var interceptor = {
    apply: function apply(receiver) {
        return receiver;
    },
    get: function get(receiver) {
        return receiver.then.bind(receiver);//p0
    }
};
var proxy = new Proxy(target, interceptor);
var p = proxy.then(function (x) {
    console.log(x);
});
