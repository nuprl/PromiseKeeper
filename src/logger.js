var fs = require('fs');
var path = require('path');
var os = require('os');
var loggerUtils = require('./logger-helper');
var mkdirp = require('mkdirp');

/**
 * Class representing a logger for basic operations detected by the analysis.
 * It stores the logs as both JSON and human-readable text files.
 * @constructor
 */
function Logger () {
    this.LOG_PATH = path.join(__dirname, '..', 'tests-unit/output-actual/json-logs/');
    this.TEXT_LOG_PATH = path.join(__dirname, '..', 'tests-unit/output-actual/');
    this.trace = []; // maintains a JSON object for each observed operation
    this.textTrace = '';
    this.inputName = '';
    this.jsonFilePath = '';
    this.fulfillCounter = 0;
    this.fulfilledPromises = [];
    this.textFilePath = '';
    this.firstScriptOfExecution = true;
    this.debugMode = false;

    // enum containing all valid operations our algorithm is capable of tracing and logging
    this.OpEnum = Object.freeze({
        ENTER_SCRIPT: 'enter_script',
        EXIT_SCRIPT: 'exit_script',
        PROMISIFY_BEGIN: 'promisify_begin',
        PROMISIFY_END: 'promisify_end',
        RESOLVE: 'resolve',
        REJECT: 'reject',
        RESOLVE_FUNC_BEGIN: 'resolve_func_begin',
        REJECT_FUNC_BEGIN: 'reject_func_begin',
        RESOLVE_FUNC_END: 'resolve_func_end',
        REJECT_FUNC_END: 'reject_func_end',
        THEN: 'then',
        THEN_PROMISIFY: 'then_promisify',
        REGISTER_RESOLVE: 'register_resolve',
        REGISTER_REJECT: 'register_reject',
        CATCH: 'catch',
        CATCH_PROMISIFY: 'catch_promisify',
        ALL: 'all',
        ALL_PROMISIFY: 'all_promisify',
        RACE: 'race',
        END_EXECUTION: 'end_execution',
        LINK: 'link',
        BIND: 'bind',
        PROXY_PROMISIFY: 'proxy_promisify'
    });
}

Logger.prototype.traceLine = function (newTraceLine) {
    this.textTrace += newTraceLine + os.EOL;

    if (this.debugMode) {
        console.log(newTraceLine);
    }
};

Logger.prototype.operations = function () {
    return this.OpEnum;
};

/**
 * Invoked when instrumentation unit enters a new script file.
 * @param loc
 * @param instrumentedFile
 * @param originalFile
 */
Logger.prototype.enterScript = function (loc, instrumentedFile, originalFile) {
    if (this.firstScriptOfExecution) {
        this.inputName = originalFile;
        this.jsonFilePath = this.LOG_PATH + this.inputName + ".json";
        this.textFilePath = this.TEXT_LOG_PATH + path.basename(this.inputName, ".js") + "_out.js";
        this.firstScriptOfExecution = false;
    }

    this.trace.push({
        "op": this.OpEnum.ENTER_SCRIPT,
        "timeStamp": Date.now(),
        "loc": loc,
        "instrumentedFile": instrumentedFile,
        "originalFile": originalFile
    });

    this.traceLine(os.EOL + 'SCRIPT ENTER ' + loc + ' ' + instrumentedFile + ' ' + originalFile);
};

/**
 * Invoked when instrumentation unit exits a script file. Does not indicate the end of execution.
 * @param loc
 */
Logger.prototype.exitScript = function (loc) {
    this.trace.push({
        "op": this.OpEnum.EXIT_SCRIPT,
        "timeStamp": Date.now(),
        "loc": loc
    });

    this.traceLine('SCRIPT EXIT ' + loc);
};

/**
 * Invoked when entering a Promise constructor.
 * @param loc
 * @param promiseId - Unique promise ID assigned by the analysis.
 */
Logger.prototype.promisifyBegin = function (loc, promiseId) {
    this.trace.push({
        "op": this.OpEnum.PROMISIFY_BEGIN,
        "timeStamp": Date.now(),
        "loc": loc,
        "id": promiseId
    });

    this.traceLine('*** call to Promise() constructor at ' + loc + " creates promise " + promiseId);
};

/**
 * Invoked when exiting a Promise constructor.
 * @param loc
 * @param promiseId - Unique promise ID, created by the analysis when entering the constructor.
 * @param associatedOid
 */
Logger.prototype.promisifyEnd = function (loc, promiseId, associatedOid) {
    this.trace.push({
        "op": this.OpEnum.PROMISIFY_END,
        "timeStamp": Date.now(),
        "loc": loc,
        "id": promiseId,
        "associatedOID": associatedOid
    });

    this.traceLine('*** return from call to Promise() constructor at ' + loc +" associates OID " + associatedOid
        + ' with promise ' + promiseId);
};

/**
 * Invoked when a Promise is resolved.
 * Checks if it's a implicit return or explicit return for the resolve;
 * Adds json log for resolve action;
 * Checks if is throw
 * Checks if it's a nameless function
 * Checks if there's linking
 * @param loc
 * @param promiseId - Unique promise ID, created by the analysis when entering the constructor.
 * @param returnVal
 * @param returnValId
 * @param explicitOrImplicitRaw
 * @param isThrowRaw
 * @param functionObjectId
 * @param functionName
 * @param isLinking
 */
Logger.prototype.resolve = function (loc, promiseId, returnVal, returnValId, explicitOrImplicitRaw, isThrowRaw, functionObjectId, functionName,
                                     isLinking) {

    var explicit = loggerUtils.explicitOrImplicit(explicitOrImplicitRaw)[0];
    var explicitOrImplicit = loggerUtils.explicitOrImplicit(explicitOrImplicitRaw)[1];

    this.trace.push({
        "op": this.OpEnum.RESOLVE,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "returnVal": loggerUtils.addType(returnVal),
        "returnValId": returnValId,
        "explicit": explicit,
        "fID": functionObjectId,
        "isThrow": isThrowRaw,
        "fulfillCounter": this.fulfillCounter++
    });

    var isThrow = isThrowRaw ? " threw" : " returned";

    if (typeof functionName !== 'undefined'){
        this.traceLine('*** function ' + functionName + isThrow + " value " + returnVal + " at " + loc);
    }

    if (isLinking) {
        this.traceLine('*** promise ' + promiseId + " RESOLVED with" + explicitOrImplicit + " value " + returnVal
            + " linked from promise " + returnValId + " at " + loc);
    } else if (this.fulfilledPromises.indexOf(promiseId) !== -1) {
        this.traceLine("*** attempt to resolve settled promise " + promiseId + " with value " + returnVal
            + " at " + loc)
    } else {
        this.fulfilledPromises.push(promiseId);
        this.traceLine('*** promise ' + promiseId + " RESOLVED with" + explicitOrImplicit + " value " + returnVal
            + " at " + loc)
    }
};

/**
 * Invoked when a Promise is rejected.
 * Checks if it's a implicit return or explicit return for the resolve;
 * Adds json log for resolve action;
 * Checks if is throw
 * Checks if it's a nameless function
 * Checks if there's linking
 * @param loc
 * @param promiseId - Unique promise ID, created by the analysis when entering the constructor.
 * @param returnVal
 * @param returnValId
 * @param explicitOrImplicitRaw
 * @param isThrowRaw
 * @param functionObjectId
 * @param functionName
 * @param isLinking
 */
Logger.prototype.reject = function (loc, promiseId, returnVal, returnValId, explicitOrImplicitRaw, isThrowRaw, functionObjectId, functionName,
                                    isLinking) {
    var explicit = loggerUtils.explicitOrImplicit(explicitOrImplicitRaw)[0];

    this.trace.push({
        "op": this.OpEnum.REJECT,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "returnVal": loggerUtils.addType(returnVal),
        "returnValId": returnValId,
        "explicit": explicit,
        "fID": functionObjectId,
        "isThrow": isThrowRaw,
        "fulfillCounter": this.fulfillCounter++
    });

    var isThrow = isThrowRaw ? " threw" : " returned";

    if (typeof functionName !== 'undefined'){
        this.traceLine('*** function ' + functionName + isThrow + " value " + returnVal + " at " + loc);
    }

    if (isLinking) {
        this.traceLine('*** promise ' + promiseId + " REJECTED with value " + returnVal
            + " linked from promise " + returnValId + " at " + loc);
    } else if (this.fulfilledPromises.indexOf(promiseId) !== -1) {
        this.traceLine('*** attempt to reject settled promise ' + promiseId + ' with value ' + returnVal
            + ' at ' + loc);
    } else {
        this.fulfilledPromises.push(promiseId);
        this.traceLine('*** promise ' + promiseId + " REJECTED with value " + returnVal + " at " + loc);
    }

};

/**
 * Invoked when resolve() is immediately invoked on Promise, creating a new promise as a result.
 * @param loc
 * @param newPromiseId
 */
Logger.prototype.resolveFun = function (loc, newPromiseId) {
    this.trace.push({
        "op": this.OpEnum.RESOLVE_FUNC_BEGIN,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": newPromiseId
    });

    this.traceLine('*** call to Promise.resolve() at ' + loc + ' creates promise ' + newPromiseId);
};

Logger.prototype.resolveFuncEnd = function (loc, promiseId, associatedOID) {
    this.trace.push({
        "op": this.OpEnum.RESOLVE_FUNC_END,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "associatedOID": associatedOID
    });

    this.traceLine('*** return from call to Promise.resolve() at ' + loc + ' associates OID ' + associatedOID
                       + ' with promise ' + promiseId);
};

/**
 * Invoked when reject() is immediately invoked on Promise, creating a new promise as a result.
 * @param loc
 * @param newPromiseId
 */
Logger.prototype.rejectFun = function (loc, newPromiseId) {
    this.trace.push({
        "op": this.OpEnum.REJECT_FUNC_BEGIN,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": newPromiseId
    });

    this.traceLine('*** call to Promise.reject() at ' + loc + ' creates promise ' + newPromiseId);
};

/**
 * Invoked after reject() has been invoked on Promise.
 * @param loc
 * @param newPromiseId
 * @param value
 */
Logger.prototype.rejectFuncEnd = function (loc, promiseId, value) {
    this.trace.push({
        "op": this.OpEnum.REJECT_FUNC_END,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "value": value
    });

    this.traceLine('*** return from call to Promise.reject() at ' + loc + ' associates OID ' + value
                       + ' with promise ' + promiseId);
};

/**
 * Invoked when then() is called on a promise.
 * @param loc
 * @param promiseId
 */
Logger.prototype.then = function (loc, promiseId) {
    var log = {
        "op": this.OpEnum.THEN,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId
    };

    this.trace.push(log);

    if (this.debugMode) {
        console.log(JSON.stringify(log));
    }
};

/**
 * Invoked when then() is called on a promise. Also logs the creation of the new promise as a result of executing then().
 * @param loc
 * @param promiseId
 * @param newPromiseId
 */
Logger.prototype.promisifyByThen = function (loc, promiseId, newPromiseId) {
    this.trace.push({
        "op": this.OpEnum.THEN_PROMISIFY,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": newPromiseId
    });

    this.traceLine('*** call to then() on promise ' + promiseId + " at " + loc + " creates promise " + newPromiseId);
};

/**
 * Invoked when a new promise is created by creating a proxy on an existing promise.
 * @param loc
 * @param promiseId
 * @param newPromiseId
 */
Logger.prototype.promisifyByProxy = function (loc, promiseId, newPromiseId) {
    this.trace.push({
        "op": this.OpEnum.PROXY_PROMISIFY,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": newPromiseId,
        "origPID": promiseId
    });

    this.traceLine('*** call to Proxy on promise ' + promiseId + " at " + loc + " creates promise " + newPromiseId);
};

/**
 * Invoked when a resolve reaction is registered through a then() or a catch().
 * @param loc
 * @param promiseId
 * @param functionName
 * @param functionObjectId
 * @param argumentOfReaction
 */
Logger.prototype.registerResolve = function (loc, promiseId, functionName, functionObjectId, argumentOfReaction) {
    this.trace.push({
        "op": this.OpEnum.REGISTER_RESOLVE,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "functionName": functionName,
        "fID": functionObjectId,
        "numOfArgs": argumentOfReaction
    });
    this.traceLine('*** resolve identity ' + functionName + " registered at " + loc + " on " + promiseId);
};

/**
 * Invoked when a reject reaction is registered through a then() or a catch().
 * @param loc
 * @param promiseId
 * @param functionName
 * @param functionObjectId
 * @param argumentOfReaction
 */
Logger.prototype.registerReject = function (loc, promiseId, functionName, functionObjectId, argumentOfReaction) {
    this.trace.push({
        "op": this.OpEnum.REGISTER_REJECT,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "functionName": functionName,
        "fID": functionObjectId,
        "numOfArgs": argumentOfReaction
    });

    this.traceLine('*** reject identity ' + functionName + " registered at " + loc + " on " + promiseId);
};

/**
 * Invoked when catch() is called on a promise.
 * @param loc
 * @param promiseId
 */
Logger.prototype.catch = function (loc, promiseId) {
    this.trace.push({
        "op": this.OpEnum.CATCH,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId
    });

    this.traceLine('*** call to catch() on promise ' + promiseId + " at " + loc);
};

/**
 * Invoked when catch() is called on a promise. Also logs the creation of the new promise as a result of executing catch().
 * @param loc
 * @param promiseId
 * @param newPromiseId
 */
Logger.prototype.promisifyByCatch = function (loc, promiseId, newPromiseId) {
    this.trace.push({
        "op": this.OpEnum.CATCH_PROMISIFY,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": newPromiseId
    });

    this.traceLine('*** call to catch() on promise ' + promiseId + " at " + loc + " creates promise " + newPromiseId);
};

/**
 * Invoked when two promises are linked together, when a resolve reaction returns a promise
 * @param loc
 * @param promiseId
 * @param oldPromiseId
 */
Logger.prototype.link = function(loc, promiseId, oldPromiseId){
    this.trace.push({
        "op": this.OpEnum.LINK,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "opID": oldPromiseId
    });
    this.traceLine("promise " + promiseId + " LINKED with promise " + oldPromiseId);
};

/**
 * Invoked when encountering Promise.all(). Logs the arguments provided to all(), including promise objects.
 * @param loc
 * @param promiseId
 * @param allArgs
 */
Logger.prototype.all = function (loc, promiseId, allArgs) {
    this.trace.push({
        "op": this.OpEnum.ALL,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "args": allArgs
    });

    var argsArray = [];
    allArgs.forEach(function (arrayElement) {
        if (arrayElement.type === 'promise')
            argsArray.push(arrayElement.pID);
        else if (arrayElement.type === 'number')
            argsArray.push(arrayElement.value);
        else if (arrayElement.type === 'string')
            argsArray.push('"' + arrayElement.value + '"');
        else
            argsArray.push(arrayElement);
    });
    this.traceLine("*** call to all() on array [" + argsArray.toString() + "] at " + loc + " creates promise " + promiseId);
};

/**
 * Invoked when encountering Promise.race(). Logs the arguments provided to race(), including promise objects.
 * @param loc
 * @param promiseId
 * @param raceArgs
 */
Logger.prototype.race = function (loc, promiseId, raceArgs) {
    this.trace.push({
        "op": this.OpEnum.RACE,
        "timeStamp": Date.now(),
        "loc": loc,
        "pID": promiseId,
        "args": raceArgs
    });

    var argsArray = [];
    raceArgs.forEach(function (arrayElement) {
        argsArray.push(arrayElement.value);
    });

    this.traceLine("*** call to race() on array [" + argsArray.toString() + "] at " + loc + " creates promise " + promiseId);
};

/**
 * Invoked when the whole execution ends, including all scripts and asynchronous operations.
 * Persists the collected logs in both JSON and human-readable text formats.
 * @param appName
 * @param loc
 * @param textLogPath
 * @param jsonLogPath
 */
Logger.prototype.endExecution = function (appName, loc, textLogPath, jsonLogPath) {
    this.trace.push({
        "op": this.OpEnum.END_EXECUTION,
        "timeStamp": Date.now(),
        "app": appName,
        "loc": loc
    });

    if (typeof textLogPath !== 'undefined' && textLogPath.indexOf('tests-nodejs') > -1) {  // node js tests
        mkdirp.sync(path.dirname(jsonLogPath));
        fs.writeFileSync(jsonLogPath, JSON.stringify(this.trace, null, 2), 'utf8');

        this.traceLine("** endExecution for " + appName);

        mkdirp.sync(path.dirname(textLogPath));
        fs.writeFileSync(textLogPath, this.textTrace, 'utf8');

        return;
    }

    mkdirp.sync(path.dirname(this.jsonFilePath));
    fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.trace, null, 2), 'utf8');

    this.traceLine("** endExecution for " + appName);
    fs.writeFileSync(this.textFilePath, this.textTrace, 'utf8');
};

module.exports = Logger;
