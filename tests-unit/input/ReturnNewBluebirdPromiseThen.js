// this test creates a new Bluebird promise in the return statement
// also tests return promise.then
var Promise = require('bluebird');

function foo () {
    return new Promise(function (resolve, reject) {
        console.log('new promise');
        resolve();
    });
}

function bar () {
    return foo().then(function () {
        console.log('then');
    });
}

bar();