var BluebirdPromise = require('bluebird');

/**
 * This class contains helper functions for the analysis,
 * including detection of various types of promise objects and their reactions
 * @returns {{}}
 * @constructor
 */
function Helper () {
    var proxyPromiseCount = 0; // used to create oid's for promises created by proxies
    // supporting promises created by libraries over native js promises
    function isPromise (obj) {
        if (obj !== null && typeof obj !== 'undefined') {
            if (obj === Promise || obj instanceof Promise || obj instanceof BluebirdPromise || obj === BluebirdPromise)
                return true;
            else if (obj.hasOwnProperty('name') && typeof obj.name !== 'undefined' && obj.name !== null && obj.name === 'Promise')
                return true;
        }
        return false;
    }

    var hasProp = {}.hasOwnProperty;
    function isAnyBluebirdPromise (obj) {
        try {
            return hasProp.call(obj, "_promise0");
        } catch (e) {
            return false;
        }
    }

    function isPromiseThen (fun) {
        return (fun === Promise.prototype.then || fun === BluebirdPromise.prototype.then);
    }

    function isBluebirdPromiseThen (base, fun) {
        return (fun === base.then || fun === BluebirdPromise.prototype.then); // || fun === base._then);
    }

    function isPromiseCatch (fun) {
        return (fun === Promise.prototype.catch || fun === BluebirdPromise.prototype.catch);
    }

    function isPromiseResolve (fun) {
        return (fun === Promise.resolve || fun === BluebirdPromise.resolve);
    }

    function isPromiseReject (fun) {
        return (fun === Promise.reject || fun === BluebirdPromise.reject);
    }

    function isPromiseAll (fun) {
        return (fun === Promise.all || fun === BluebirdPromise.all);
    }

    function isPromiseRace (fun) {
        return (fun === Promise.race || fun === BluebirdPromise.race);
    }

    var getName = function (f, iid) {
        if (f === null){
            return false;
        }
        return f.name;
    };

    /**
     * Gets oid of proxy objects not supported by jalangi
     */
    var getProxyPromiseId = function (obj, prop, isGetField) {
        var resultOid;
        try {
            resultOid = Utils.getObjectID(obj, prop, isGetField);
        }
        catch (e) {
            // console.warn(e);
        }
        if (typeof resultOid === 'undefined' || resultOid === 'objundefined') {
            resultOid = 'obj-pr' + proxyPromiseCount;
            proxyPromiseCount ++;
        }
        return resultOid;
    };

    return {
        isPromise: isPromise,
        isAnyBluebirdPromise: isAnyBluebirdPromise,
        isPromiseThen: isPromiseThen,
        isBluebirdPromiseThen: isBluebirdPromiseThen,
        isPromiseCatch: isPromiseCatch,
        isPromiseResolve: isPromiseResolve,
        isPromiseReject: isPromiseReject,
        isPromiseAll: isPromiseAll,
        isPromiseRace: isPromiseRace,
        getName: getName,
        getProxyPromiseId: getProxyPromiseId
    };
}

module.exports = Helper();