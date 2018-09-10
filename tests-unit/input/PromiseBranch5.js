/*
function foo () {
    var target = Promise.resolve(3);

    var interceptor = {
        apply: function apply(receiver) {
            console.log('1');
            return receiver();
        },
        get: function get(receiver) {
            console.log('2');
            return receiver.then.bind(receiver);
        }
    };

    var proxy = new Proxy(target, interceptor);
    return proxy.then(function (x) {
        console.log('=' + x);
    });
}

foo();
*/
/*
var target = Promise.resolve(3);
target.then.bind(target);
*/

function foo () {
    var target = Promise.resolve(3);
    //
    // var interceptor = {
    //     apply: function apply(receiver) {
    //         console.log('1');
    //         return receiver();
    //     },
    //     get: function get(receiver) {
    //         console.log('2');
    //         return receiver.then.bind(receiver);
    //     }
    // };
    //
    var proxy = new Proxy(target, {});
    return proxy.then(function (x) {
        console.log('=' + x);
        return 4;
    });

}

foo();
