/**
 * A simple Jalangi instrumentation that prints out some information about executed functions, etc.
 *
 */

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT
const path = require('path');
var IntermediateLogger = require('./log/promiseLogger');
var promiseLogger = new IntermediateLogger();
// var path = require('path');
// global.appRoot = path.resolve();
var PromisesGraph = require('./graph/graph');
var __originalFileNames = [];
var common = require('../test/common');
var loggerUtils = require('./log/loggerUtils');
var BluebirdPromise = require('bluebird');


(function (sandbox) {
    function MyAnalysis() {

        var DEBUG = false;

        /**import other modules*/
        var Logger = sandbox.InformationFlow.Logger;
        var Utils = sandbox.InformationFlow.Utils;
        process.on('unhandledRejection', function(r){console.log(r)});
        /* ---------------------------------------------------------------------------------------------- */

        // TODO: this will not be sufficient for native functions
        var getName = function (f, iid) {
            return f.name;
        };

        var getValOid = function (value) {
            var retVal;
            var objOid = loggerUtils.isPrim(value) ? "" : Utils.getObjectID(value, "", loggerUtils.isFunction(value));
            retVal = objOid;
            if (value instanceof Promise) {
                oidToPromiseInfo[objOid].id ? retVal = oidToPromiseInfo[objOid].getPromiseId() : retVal = proxyPromisesIds[JSON.stringify(value)];
            }
            return retVal;
        };

        // supporting promises created by libraries over native js promises
        function isPromise (obj) {
            // console.log('====  ' + (obj === Promise || obj instanceof Promise || obj instanceof BluebirdPromise || obj === BluebirdPromise));
            // if ((obj === Promise || obj instanceof Promise || obj instanceof BluebirdPromise || obj === BluebirdPromise)) {
            //     console.log('++++++++++++++');
            //     console.log('======= ' + obj);
            // }
            return (obj === Promise || obj instanceof Promise || obj instanceof BluebirdPromise || obj === BluebirdPromise);
        }

        function isPromiseThen (fun) {
            return (fun === Promise.prototype.then || fun === BluebirdPromise.prototype.then || fun === BluebirdPromise.then);
        }

        function isPromiseCatch (fun) {
            return (fun === Promise.prototype.catch || fun === BluebirdPromise.prototype.catch || fun === BluebirdPromise.catch);
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

        // TODO other bluebird/library functionality?

        /* ---------------------------------------------------------------------------------------------- */
        /* Jalangi callbacks below */

        // used to match up functionEnter()/functionExit() because function argument f is not available in functionExit
        // each element of the stack is a pair <function,boolean> where the boolean indicates if we have seen
        // an explicit return for this function.
        var functionStack = [];

        this.functionEnter = function (iid, f, dis, args) {
            if (DEBUG) Logger.log("** functionEnter " + getName(f) + " at " + Utils.getLocation(iid) + " " + iid);
            functionStack.push({fun: f, explicitReturn: false});
        };

        var explReturnMessage, isThrow, f;

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            f = functionStack[functionStack.length - 1].fun;
            if (DEBUG) Logger.log("*** functionExit " + getName(f) + " at " + Utils.getLocation(iid) + " exception: "
                + wrappedExceptionVal + "  returnVal: " + returnVal);

            var explicitReturn = functionStack[functionStack.length - 1].explicitReturn;
            isThrow = functionStack[functionStack.length - 1].isThrow;
            explReturnMessage = !explicitReturn ? " implicitly returned" : " explicitly returned";
            f = functionStack.pop().fun;
        };

        this._return = function (iid, val) {
            if (DEBUG) Logger.log("*** Return: " + Utils.getLocation(iid));
            functionStack[functionStack.length - 1].explicitReturn = true;
        };

        this._throw = function (iid, val) {
            if (DEBUG) Logger.log("*** Throw: " + Utils.getLocation(iid));
            functionStack[functionStack.length - 1].isThrow = true;
        };

        /**
         * Mapping from resolve/reject function to their associated PromiseInfo.
         */
        var resolveToPromise = new Map();
        var rejectToPromise = new Map();

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            if (DEBUG) Logger.log("** declare: name =  " + name + ", isArgument = " + isArgument);
            if (promiseStack.length > 0) { // are we currently executing a Promise() constructor?
                var pInfo = promiseStack[promiseStack.length - 1]; // get current PromiseInfo object
                if (pInfo.argCount === 0) {
                    /* first declare() is for arguments --- skip */
                } else if (!isArgument) {
                    /* ignore function name */
                    pInfo.argCount--;  // adjust counter
                }
                if (pInfo.argCount === 1) {
                    pInfo.resolveFunName = name; // record resolveFun and its name
                    pInfo.resolveFun = val;
                    resolveToPromise.set(val, pInfo);
                } else if (pInfo.argCount === 2) { // record rejectFun and its name
                    pInfo.rejectFunName = name;
                    pInfo.rejectFun = val;
                    rejectToPromise.set(val, pInfo);
                }
                pInfo.argCount++;
            }
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            if (DEBUG) Logger.log("** read: name =  " + name);
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            if (DEBUG) Logger.log("** write: name =  " + name);
        };


        var promiseCount = 0;  // used to create unique ID for each promise created using "new Promise()"
        var promiseStack = []; // stack of PromiseInfo objects -- push in invokeFunPre(), pop in invokeFun()
        var oidToPromiseInfo = {}; // used for mapping an oid to corresponding PromiseInfo object
        var boundThenFunctions = {}; // then functions can be bound and hence we need to transfer the context of their call site (their og promise info). map from id of then function to its og promise
        var proxyPromiseCount = 0; // used to create oid's for promises created by proxies
        var proxyPromisesIds = {};

        // get oid of proxy objects not supported by jalangi
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

        function PromiseInfo(pid, iid, argCount, resolveFunName, resolveFun, rejectFunName, rejectFun, oid) {
            this.id = pid;
            this.iid = iid;
            this.argCount = argCount;
            this.resolveFunName = resolveFunName;
            this.resolveFun = resolveFun;
            this.rejectFunName = rejectFunName;
            this.rejectFun = rejectFun;
            this.oid = oid;

            this.getPromiseId = function () {
                return "p" + pid;
            };
        }

        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid) {
            if (DEBUG) Logger.log("** invokeFunPre: " + getName(f, iid));

            var location = Utils.getLocation(iid);
            var oid;
            var pInfo;
            var resultPromiseInfo;

            // the context is transferred with .bind() in js, and so we need to keep the original promise here to simulate that in our analysis
            if (f === Function.prototype.bind) {
                if (isPromiseThen(base)) {
                    if (args[0] instanceof Promise) {
                        // todo promiseLogger.bindPromise
                        boundThenFunctions[Utils.getObjectID(base, '', false)] = {
                            promise: Utils.getObjectID(args[0], '', false),
                            funcBody: base
                        }
                    }
                }
            }

            if (f === setTimeout) { // if we call a function via setTimeout, wrap it and emit the appropriate information
                // if the callee is the resolve/reject function for a promise
                var fun = args[0];
                setTimeout(function (value) {
                        // check if resolve() or reject() is called
                        if (fun.name === "") { // check if the callee is an anonymous function
                            if (resolveToPromise.get(fun) !== undefined) {
                                pInfo = resolveToPromise.get(fun);
                                promiseLogger.resolve(location, pInfo.getPromiseId(), value, getValOid(value), "", isThrow,
                                    Utils.getObjectID(args[0], '', false), getName(args[0], iid));
                            } else if (rejectToPromise.get(fun) !== undefined) {
                                pInfo = rejectToPromise.get(fun);
                                promiseLogger.reject(location, pInfo.getPromiseId(), value, getValOid(value), "", isThrow,
                                    Utils.getObjectID(args[0], '', false), getName(args[0], iid));
                            } else if (boundThenFunctions[Utils.getObjectID(fun, '', false)] !== 'undefined') {
                                console.log('analysis.js::invokeFunPre >> BINDING promises');
                            }
                        }
                        fun(value);
                    }, args[1], args[2]
                ); // wrap a function around the asynchronously called function
                return {"skip": true}; // skip normal execution of this function
            }

            if (isConstructor && (isPromise(f))) {
                pInfo = new PromiseInfo(promiseCount++, iid, 0);
                promiseStack.push(pInfo); // push new PromiseInfo onto stack, record iid and initialize number of args
                promiseLogger.promisifyBegin(location, pInfo.getPromiseId());
            }

            if (isConstructor && f === Proxy) {
                // handle proxies in invokeFun()
            }

            if (isPromiseResolve(f)) {
                pInfo = new PromiseInfo(promiseCount++, iid, 0);
                promiseStack.push(pInfo); // push new PromiseInfo onto stack, record iid and initialize number of args
                promiseLogger.resolveFun(location, pInfo.getPromiseId());
            }

            if (isPromiseReject(f)) {
                pInfo = new PromiseInfo(promiseCount++, iid, 0);
                promiseStack.push(pInfo); // push new PromiseInfo onto stack, record iid and initialize number of args
                promiseLogger.rejectFun(location, pInfo.getPromiseId());
            }

            if (isPromiseCatch(f)) {
                oid = Utils.getObjectID(base, '', false);
                pInfo = oidToPromiseInfo[oid];
                resultPromiseInfo = new PromiseInfo(promiseCount++, iid);

                var catchResolveReaction, catchRejectReaction, catchResName, catchResOid, catchRejName, catchRejOid;

                if (typeof pInfo === 'undefined') {
                    pInfo = oidToPromiseInfo[boundThenFunctions[Utils.getObjectID(f, '', false)].promise];
                }

                catchResolveReaction = function _default(value) {
                    promiseLogger.resolve(location, resultPromiseInfo.getPromiseId(), value, getValOid(value), explReturnMessage, isThrow,
                                          catchResOid, catchResName);
                    return value;
                };

                catchResName = getName(catchResolveReaction, iid);
                catchResOid = Utils.getObjectID(catchResolveReaction, '', false);
                promiseLogger.registerResolve(location, pInfo.getPromiseId(), catchResName, catchResOid);
                var handlerType = loggerUtils.findType(args[0]);
                if (handlerType !== "function"){
                    catchRejectReaction = function _default(value) {
                        promiseLogger.reject(location, resultPromiseInfo.getPromiseId(), value, getValOid(value), explReturnMessage, isThrow,
                                             catchRejOid, catchRejName);
                        throw value;
                    };
                }
                else {
                    catchRejectReaction = function (value) {
                        try {
                            var catchReturnVal = args[0].call(base, value); //TODO why was this resultPromiseInfo and not value before? -d
                            promiseLogger.resolve(location, resultPromiseInfo.getPromiseId(), catchReturnVal, getValOid(catchReturnVal),
                                explReturnMessage, isThrow, catchRejOid, catchRejName);
                            return catchReturnVal;
                        } catch (exc) {
                            promiseLogger.reject(location, resultPromiseInfo.getPromiseId(), exc, getValOid(exc), "", isThrow,
                                catchRejOid, catchRejName);
                            // FT: explReturnMessage N/A when promises are rejected
                            throw exc;
                        }
                    };
                }

                catchRejName = (handlerType === "function") ? getName(args[0], iid) : getName(catchRejectReaction, iid);
                catchRejOid = (handlerType === "function") ? Utils.getObjectID(args[0], '', false) : Utils.getObjectID(catchRejectReaction, '', false);

                promiseLogger.registerReject(location, pInfo.getPromiseId(), catchRejName, catchRejOid);

                // todo implement for BluebirdPromise or wouldn't matter?
                catchResult = Promise.prototype.then.call(base, catchResolveReaction, catchRejectReaction);
                var catchResultOid = Utils.getObjectID(catchResult, '', false);
                resultPromiseInfo.oid = catchResultOid;
                oidToPromiseInfo[catchResultOid] = resultPromiseInfo;

                promiseLogger.promisifyByCatch(location, pInfo.getPromiseId(), resultPromiseInfo.getPromiseId());

                return {"skip": true, "f": f, "base": base, "args": args}; // skip normal execution of this function
            }

            if (isPromiseThen(f) || (getName(f) === 'bound then' && isPromise(base))) {
                oid = Utils.getObjectID(base, '', false);

                if (typeof oid === 'undefined' || oid === 'objundefined') {
                    oid = proxyPromisesIds[JSON.stringify(base)];
                }

                pInfo = oidToPromiseInfo[oid];
                resultPromiseInfo = new PromiseInfo(promiseCount++, iid);
                var rejectReaction, resolveReaction, resOid, resName, rejOid, rejName, resType, rejType;

                // check if the then function was bound (using Function.prototype.bind) and thus we need to look up its original context
                if (typeof pInfo === 'undefined') {
                    pInfo = oidToPromiseInfo[boundThenFunctions[Utils.getObjectID(f, '', false)].promise];
                }

                promiseLogger.then(location, pInfo.getPromiseId());
                resType = loggerUtils.findType(args[0]);
                if (resType !== "function") {
                    resolveReaction = function _default(value) {
                        promiseLogger.resolve(location, resultPromiseInfo.getPromiseId(), value, getValOid(value), explReturnMessage, isThrow,
                                              resOid, resName);
                        return value;
                    };
                } else {
                    resolveReaction = function _resolveReactionWrapper(value) {
                        try {
                            var returnVal = args[0].call(base, value);
                            if (isPromise(returnVal)) { // handle linking case
                                var returnValOID = Utils.getObjectID(returnVal, '', false);
                                if (typeof returnValOID === 'undefined' || returnValOID === 'objundefined' || (typeof oidToPromiseInfo[returnValOID] === 'undefined')) {
                                    console.log('xxx invalid result oid for proxy promises xxx');
                                    returnValOID = proxyPromisesIds[JSON.stringify(returnVal)];
                                }
                                var returnValInfo = oidToPromiseInfo[returnValOID];
                                promiseLogger.link(location, resultPromiseInfo.getPromiseId(), returnValInfo.getPromiseId());

                                // when returnValInfo promise is resolved, generate message that resultPromiseInfo was resolved with the same value
                                returnVal.then(function (value) {
                                    // Logger.log("promise " + resultPromiseInfo.getPromiseId() + " RESOLVED with value " + value + " at " + location);
                                    promiseLogger.resolve(location, resultPromiseInfo.getPromiseId(), value, returnValInfo.getPromiseId(),
                                        explReturnMessage, isThrow, resOid, resName, true);
                                }, function (value) {
                                    // Logger.log("promise " + resultPromiseInfo.getPromiseId() + " RESOLVED with value " + value + " at " + location);
                                    promiseLogger.reject(location, resultPromiseInfo.getPromiseId(), value, returnValInfo.getPromiseId(),
                                        explReturnMessage, isThrow, resOid, resName, true);
                                });
                                return returnVal;
                            } else {
                                // Logger.log("promise " + resultPromiseInfo.getPromiseId() + " RESOLVED with " +
                                // explReturnMessage + " value " + returnVal + " at " + location);
                                promiseLogger.resolve(location, resultPromiseInfo.getPromiseId(), returnVal, getValOid(returnVal), explReturnMessage,
                                    isThrow, resOid, resName);
                                return returnVal;
                            }
                        } catch (exc) {
                            promiseLogger.reject(location, resultPromiseInfo.getPromiseId(), exc, getValOid(exc), "", isThrow, resOid, resName);
                            // FT: explReturnMessage N/A when promises are rejected
                            throw exc;
                        }
                    };
                }

                resName = (resType === "function") ? getName(args[0], iid) : getName(resolveReaction, iid);
                resOid = (resType === "function") ? Utils.getObjectID(args[0], '', false) : Utils.getObjectID(resolveReaction, '', false);

                promiseLogger.registerResolve(location, pInfo.getPromiseId(), resName, resOid);

                rejType = args.length === 1 || loggerUtils.findType(args[1]) !== "function";

                if (rejType) {
                    rejectReaction = function _default(value) {
                        promiseLogger.reject(location, resultPromiseInfo.getPromiseId(), value, getValOid(value), "", isThrow, rejOid, rejName);
                        // FT: explReturnMessage N/A when promises are rejected

                        throw value;
                    };
                } else {
                    rejectReaction = function _rejectReactionWrapper(value) {
                        try {
                            var returnVal = args[1].call(base, value);
                            promiseLogger.resolve(location, resultPromiseInfo.getPromiseId(), returnVal, getValOid(returnVal), explReturnMessage,
                                                  isThrow, rejOid, rejName);
                            return returnVal;
                        } catch (exc) {
                            promiseLogger.reject(location, resultPromiseInfo.getPromiseId(), exc, getValOid(exc), "", isThrow, rejOid, rejName);
                            // FT: explReturnMessage N/A when promises are rejected
                            throw exc;
                        }
                    }
                }
                rejName = (!rejType) ? getName(args[1], iid) : getName(rejectReaction, iid);
                rejOid = (!rejType) ? Utils.getObjectID(args[1], '', false) : Utils.getObjectID(rejectReaction, '', false);
                promiseLogger.registerReject(location, pInfo.getPromiseId(), rejName, rejOid);

                thenResult = f.call(base, resolveReaction, rejectReaction);
                var resultOid = Utils.getObjectID(thenResult, '', false);
                resultPromiseInfo.oid = resultOid;
                oidToPromiseInfo[resultOid] = resultPromiseInfo;
                promiseLogger.promisifyByThen(location, pInfo.getPromiseId(), resultPromiseInfo.getPromiseId());
                return {"skip": true, "f": f, "base": base, "args": args}; // skip normal execution of this function
            }
        };

        var catchResult = undefined;
        var thenResult = undefined;

        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid) {
            var pInfo, oid, resultOid, resultPromiseInfo, argLog, argType, argOid, argPInfo;

            if (isPromiseThen(f) || (f !== undefined && getName(f) === 'bound then' && isPromise(base))) {
                return {"result": thenResult};
            }
            if (isPromiseCatch(f)) {
                return {"result": catchResult};
            }
/*
            if (getName(f) === 'bound then') {
                // TODO @DI please implement
                if (base instanceof Promise || base instanceof BluebirdPromise) {
                    var proxyPromiseId = proxyPromisesIds[JSON.stringify(base)];
                    if (typeof proxyPromiseId !== 'undefined') {
                        console.log('<then> should be registered for promise: <' + proxyPromiseId + '> to resolve function <' + Utils.getObjectID(args[0], '', false) + '> (and similarly to the reject reaction if there is one)');

                        console.log(proxyPromiseId + ' is the promise oID');
                        console.log(oidToPromiseInfo[proxyPromiseId] + ' is the promise pID');
                        console.log(args[0] + ' is the resolve function');
                        console.log(args[1] + ' [if existent] is the reject function');
                    }
                }
            }
*/
            // f is undefined if we skipped the invokeFunPre
            if (f === undefined) {
                return;
            }

            if (DEBUG) Logger.log("*** invokeFun: " + getName(f));

            // check if resolve() or reject() is called
            // directly resolving, no need to add f->v link here
            if (f.name === "") { // check if the callee is an anonymous function
                /*
                if (boundThenFunctions[Utils.getObjectID(f, '', false)] !== undefined) {
                    // use .funcBody ??? or use another body
                    var tempF = boundThenFunctions[Utils.getObjectID(f, '', false)];
                    // todo
                }
                */
                if (resolveToPromise.get(f) !== undefined) {
                    pInfo = resolveToPromise.get(f);
                    promiseLogger.resolve(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], getValOid(args[0]), "");
                } else if (rejectToPromise.get(f) !== undefined) {
                    pInfo = rejectToPromise.get(f);
                    promiseLogger.reject(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], getValOid(args[0]), "");
                }
            }


            // return from call to Promise constructor -- record OID
            if (isConstructor && isPromise(f)) {
                pInfo = promiseStack[promiseStack.length - 1];
                oid = Utils.getObjectID(result, '', false);
                pInfo.oid = oid;  // record oid for current promise
                oidToPromiseInfo[oid] = pInfo; // add mapping for this OID
                promiseLogger.promisifyEnd(Utils.getLocation(iid), pInfo.getPromiseId(), oid);
                promiseStack.pop();
            }

            if (isConstructor && f === Proxy) {
                var location = Utils.getLocation(iid);
                // if args[0] input promise
                // result should be output promise
                // todo wrappers of proxy

                if (isPromise(args[0])) {
                    pInfo = new PromiseInfo(promiseCount ++, iid, 0);

                    var resultOid = getProxyPromiseId(result, '', false);
                    proxyPromisesIds[JSON.stringify(result)] = resultOid; /// todo what if result is undefined. where is this used
                    oidToPromiseInfo[resultOid] = pInfo;
                    pInfo.oid = resultOid; //

                    promiseLogger.promisifyByProxy(location, oidToPromiseInfo[Utils.getObjectID(args[0], '', false)].getPromiseId(), pInfo.getPromiseId());
                }
                else {
                    // todo any treatment for proxies on other objects
                    // console.log('=== not a promise ===');
                }

            }

            // return from call to Promise.resolve() -- record OID, process resolve
            if (isPromiseResolve(f)) {
                pInfo = promiseStack[promiseStack.length - 1];
                oid = Utils.getObjectID(result, '', false);
                pInfo.oid = oid;  // record oid for current promise
                oidToPromiseInfo[oid] = pInfo; // add mapping for this OID=

                promiseLogger.resolveFuncEnd(Utils.getLocation(iid), pInfo.getPromiseId(), oid);
                promiseLogger.resolve(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], getValOid(args[0]), "");
            }

            // return from call to Promise.reject() -- record OID, process reject
            if (isPromiseReject(f)) {
                pInfo = promiseStack[promiseStack.length - 1];
                oid = Utils.getObjectID(result, '', false);
                pInfo.oid = oid;  // record oid for current promise
                oidToPromiseInfo[oid] = pInfo; // add mapping for this OID

                promiseLogger.rejectFuncEnd(Utils.getLocation(iid), pInfo.getPromiseId(), oid);
                promiseLogger.reject(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], getValOid(args[0]), 'explicit?');
            }

            if (isPromiseAll(f)) {
                // create PromiseInfo for the promise created by all
                resultOid = Utils.getObjectID(result, '', false);
                resultPromiseInfo = new PromiseInfo(promiseCount ++, iid);
                resultPromiseInfo.oid = resultOid;
                oidToPromiseInfo[resultOid] = resultPromiseInfo;

                var allArgs = args[0];
                var allArgsLog = [];
                for (i = 0; i < allArgs.length; i ++) {
                    argLog = {};
                    argType = typeof allArgs[i];
                    switch (argType) {
                        case 'number':
                            argLog['type'] = 'number';
                            argLog['value'] = allArgs[i];

                            break;
                        case 'string':
                            argLog['type'] = 'string';
                            argLog['value'] = allArgs[i];

                            break;
                        case 'object':
                            if (isPromise(allArgs[i])) {
                            // if (allArgs[i] instanceof Promise) {
                                argLog['type'] = 'promise';
                                argLog['value'] = allArgs[i].toString();
                                argOid = Utils.getObjectID(allArgs[i], '', false);
                                argPInfo = oidToPromiseInfo[argOid];
                                argLog['pID'] = argPInfo.getPromiseId();
                            }
                            else {
                                argLog['type'] = 'object';
                                argLog['value'] = allArgs[i].toString();
                            }

                            break;
                        default:
                            argLog['type'] = argType;

                            console.log("WARNING: type <" + argType + "> is currently not analyzed");
                            break;
                    }

                    allArgsLog.push(argLog);
                }

                promiseLogger.all(Utils.getLocation(iid), resultPromiseInfo.getPromiseId(), allArgsLog);
            }

            if (isPromiseRace(f)) {
                resultOid = Utils.getObjectID(result, '', false);
                resultPromiseInfo = new PromiseInfo(promiseCount++, iid);
                resultPromiseInfo.oid = resultOid;
                oidToPromiseInfo[resultOid] = resultPromiseInfo;

                var raceArgs = args[0];
                var raceArgsLog = [];
                for (var i = 0; i < raceArgs.length; i ++) {
                    argLog = {};
                    argType = loggerUtils.findType(raceArgs[i]);
                    if (argType === 'promise'){ // todo implement for BluebirdPromise
                        argLog['type'] = 'promise';
                        argOid = Utils.getObjectID(raceArgs[i], '', false);
                        argPInfo = oidToPromiseInfo[argOid];
                        argLog['pID'] = argPInfo.getPromiseId();
                        argLog['value'] = loggerUtils.addType(raceArgs[i]) + " " + argLog['pID'];
                    }
                    else {
                        argLog['type'] = argType;
                        argLog['value'] = loggerUtils.addType(raceArgs[i]);
                    }
                    raceArgsLog.push(argLog);
                }

                promiseLogger.race(Utils.getLocation(iid), resultPromiseInfo.getPromiseId(), raceArgsLog);
            }
        };

        this.literal = function (iid, val, hasGetterSetter) {
            var str;
            if (typeof val === 'function') {
                str = '<function>';
            } else if (typeof val === 'object') {
                str = '<object>';
            } else if (typeof val === 'undefined') {
                str = '<undefined>';
            } else {
                str = val.toString();
            }
            if (DEBUG) Logger.log("** literal: val =  " + str);
        };

        this.binary = function (iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
            if (DEBUG) Logger.log("** binary: op =  " + op);
        };

        this.unary = function (iid, op, left, result) {
            if (DEBUG) Logger.log("** unary: op =  " + op);
        };

        this.conditional = function (iid, result) {
            if (DEBUG) Logger.log("** conditional: location =  " + Utils.getLocation(iid));
        };

        this.endExpression = function (iid) {
            if (DEBUG) Logger.log("** endExpression: location =  " + Utils.getLocation(iid));
        };

        this.endExecution = function () {
            var appName = sandbox.Spec.appInfo.name;
            if (DEBUG) Logger.log("** endExecution for " + appName);
            promiseLogger.endExecution(appName);

            var firstFileName = __originalFileNames[0];
            var fileName = firstFileName.split(path.sep).pop();
            var promisesGraph = new PromisesGraph(fileName);
            promisesGraph.importLog(fileName, common.TOOL_HOME + path.sep + 'tests-unit/output-actual/json-logs',
                common.TOOL_HOME + path.sep + 'tests-unit/output-actual/graphs',
                common.TOOL_HOME + path.sep + 'tests-unit/output-actual/graph-vis');
        };

        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            if (DEBUG) Logger.log("*** getFieldPre: " + Utils.getLocation(iid));
        };

        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            if (DEBUG) Logger.log("*** getField: " + Utils.getLocation(iid));
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            if (DEBUG) Logger.log("*** putFieldPre: " + Utils.getLocation(iid));
        };

        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            if (DEBUG) Logger.log("*** putField: " + Utils.getLocation(iid));
        };

        this.forinObject = function (iid, val) {
            if (DEBUG) Logger.log("*** forinObject: " + Utils.getLocation(iid));
        };

        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            promiseLogger.enterScript(Utils.getLocation(iid), path.basename(instrumentedFileName), path.basename(originalFileName));
            __originalFileNames.push(originalFileName);
        };

        this.scriptExit = function (iid, wrappedExceptionVal) {
            promiseLogger.exitScript(Utils.getLocation(iid));
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);