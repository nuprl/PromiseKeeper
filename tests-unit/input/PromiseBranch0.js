
function branch (target) {

    var interceptor = {
        apply: function apply(receiver) {
            return receiver;
        },
        get: function get(receiver) {
            return receiver.then.bind(receiver);//p0
        }
    };

    var proxy = new Proxy(target, interceptor);

    return proxy; //p0
};

var p2 = branch(Promise.resolve(42)).then(function(val) { //p1
    console.log(val + 1);
    return val + 1;
});
