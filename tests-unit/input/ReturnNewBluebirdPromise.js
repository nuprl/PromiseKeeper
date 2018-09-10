// this test creates a new Bluebird promise in the return statement
var Promise = require('bluebird');

function foo () {
    return new Promise(function (resolve, reject) {
        console.log('new promise');
        resolve();
    });
}

foo();
