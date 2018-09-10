
function branch (target, onResolved) {

    var interceptor = {
        get: function get(target) {
            return target.then.bind(target); //p0
        }
    };

    var proxy = new Proxy(target, interceptor);

    return proxy.then(onResolved); //p2 + p3 + p4, p3 p4 linked
}

Promise.resolve().then(function () { //p0 + p1
    return branch(Promise.resolve(), function () {return Promise.resolve('targetResolved'); });
}).then(function (data) { //p5
    console.log('== second then');
    console.log('data: "' + data + '" should equal "targetResolved"');
});