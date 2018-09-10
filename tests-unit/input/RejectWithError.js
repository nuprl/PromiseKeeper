



// failing test from actions-on-google-nodejs benchmark
var handler = function handler(app) {
    return Promise.reject(new Error('error'));
};

var actionMap = new Map();
actionMap.set('hello', handler);

function foo (map) {
    ???
}
foo(actionMap).catch(function (reason) {
    console.log(reason);
});
