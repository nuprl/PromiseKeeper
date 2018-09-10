var fs = require('fs');
var path = require('path');
var os = require('os');

var LoggerUtils = {};

LoggerUtils.explicitOrImplicit = function (explicitOrImplicit) {
    var explicit = "yes";

    if (typeof explicitOrImplicit !== 'undefined' && explicitOrImplicit.length > 0) {
        if (explicitOrImplicit.includes('implicit')) {
            explicit = "no";
        }
        else if (!explicitOrImplicit.includes('explicit')) {
            console.log('Error in type of resolution of promise');
            explicit = 'error' + explicitOrImplicit;
        }
    }

    if (typeof explicitOrImplicit === 'undefined') {
        explicitOrImplicit = "";
    }
    return [explicit, explicitOrImplicit];
};

LoggerUtils.isPrim = function (value) {
    if (this.isString(value)) {
        return true;
    } else if (this.isNumber(value)) {
        return true;
    } else if (this.isNull(value)) {
        return true;
    } else if (this.isUndefined(value)) {
        return true;
    } else if (this.isBoolean(value)) {
        return true;
    } else if (this.isSymbol(value)) {
        return true;
    } else {
        return false;
    }
};

LoggerUtils.findType = function (value) {
    if (this.isString(value)) {
        return "string";
    } else if (this.isNumber(value)) {
        return "number";
    } else if (this.isArray(value)) {
        return "array";
    } else if (this.isFunction(value)) {
        return "function";
    } else if (this.isObject(value)) {
        return "object";
    } else if (this.isNull(value)) {
        return "null";
    } else if (this.isUndefined(value)) {
        return "undefined";
    } else if (this.isBoolean(value)) {
        return "boolean " + value;
    } else if (this.isRegExp(value)) {
        return "regExp";
    } else if (this.isError(value)) {
        return "error";
    } else if (this.isDate(value)) {
        return "date";
    } else if (this.isSymbol(value)) {
        return "symbol";
    } else if (this.isPromise(value)) {
        return "promise";
    } else {
        return "unhandled type";
        console.log("LoggerUtils.findType: Unhandled data type.");
    }
};

LoggerUtils.addType = function (value) {
    if (this.isString(value)) {
        return "String " + value;
    } else if (this.isNumber(value)) {
        return "Number " + value;
    } else if (this.isArray(value)) {
        return "Array";
    } else if (this.isFunction(value)) {
        return "Function";
    } else if (this.isObject(value)) {
        return "Object";
    } else if (this.isNull(value)) {
        return "Null";
    } else if (this.isUndefined(value)) {
        return "Undefined";
    } else if (this.isBoolean(value)) {
        return "Boolean " + value;
    } else if (this.isRegExp(value)) {
        return "RegExp";
    } else if (this.isError(value)) {
        return "Error";
    } else if (this.isDate(value)) {
        return "Date";
    } else if (this.isSymbol(value)) {
        return "Symbol";
    } else if (this.isPromise(value)) {
        return "Promise";
    } else {
        return "unhandled type";
        console.log("LoggerUtils.addType: Unhandled data type.");
    }
};

LoggerUtils.isString = function isString (value) {
    return typeof value === 'string' || value instanceof String;
};

LoggerUtils.isNumber = function isNumber (value) {
    return typeof value === 'number' && isFinite(value);
};

LoggerUtils.isArray = function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
};

LoggerUtils.isFunction = function isFunction (value) {
    return typeof value === 'function';
};

LoggerUtils.isObject = function (value) {
    return value && typeof value === 'object' && value.constructor === Object;
};

LoggerUtils.isNull = function isNull (value) {
    return value === null;
};

LoggerUtils.isUndefined = function isUndefined (value) {
    return typeof value === 'undefined';
};

LoggerUtils.isBoolean = function isBoolean (value) {
    return typeof value === 'boolean';
};

LoggerUtils.isRegExp = function isRegExp (value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
};

LoggerUtils.isError = function isError (value) {
    return value instanceof Error && typeof value.message !== 'undefined';
};

LoggerUtils.isDate = function isDate (value) {
    return value instanceof Date;
};

LoggerUtils.isSymbol = function isSymbol (value) {
    return typeof value === 'symbol';
};

LoggerUtils.isPromise = function isPromise (value) {
    console.log(value);
    return value && typeof value === 'object' && value.constructor === Promise;
}


module.exports = LoggerUtils;