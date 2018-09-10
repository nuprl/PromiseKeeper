// example from https://gist.github.com/chrisabrams/11011880

Promise = require('bluebird')

var A = function() {

    return new Promise(function(resolve, reject) {
        var result = 'A is done'

        console.log(result)
        resolve(result);
    })
}

var B = function() {

    return new Promise(function(resolve, reject) {
        var result = 'B is done'

        setTimeout(function() {
            console.log(result)
            resolve(result);
        }, 2000)
    })
}

var C = function() {

    return new Promise(function(resolve, reject) {
        var result = 'C is done'
        console.log(result)
        resolve(result);
    })
}

var D = function() {

    return new Promise(function(resolve, reject) {
        var result = 'D is done'
        console.log(result)
        resolve(result);
    })
}

A()
    .then(function(result) {
        return B();
    })
    .then(C)
    .then(D)