/**
 * A simple Jalangi instrumentation that prints out some information about executed functions, etc.
 *
 */

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT
const path = require('path');
var PromisesGraph = require('./graph/graph');
var __originalFileNames = [];
var common = require('../test/common');
var IntermediateLogger = require('./logger');
var Logger = new IntermediateLogger(common.ACTUAL_OUTPUT_DIR);
var loggerUtils = require('./logger-helper');
var Module = require('module');
var helper = require('./analysis-helper');

(function (sandbox) {
    function MyAnalysis() {

        var DEBUG = false;
        var currentTestName = '';
        // used to match up functionEnter()/functionExit() because function argument f is not available in functionExit
        // each element of the stack is a pair <function,boolean> where the boolean indicates if we have seen
        // an explicit return for this function.
        var functionStack = [];
        var explReturnMessage, isThrow, f;
        /**
         * Mapping from resolve/reject function to their associated PromiseInfo.
         */
        var resolveToPromise = new Map();
        var rejectToPromise = new Map();
        var promiseCount = 0;  // used to create unique ID for each promise created using "new Promise()"
        var promiseStack = []; // stack of PromiseInfo objects -- push in invokeFunPre(), pop in invokeFun()
        var oidToPromiseInfo = {}; // used for mapping an oid to corresponding PromiseInfo object
        var boundThenFunctions = {}; // then functions can be bound and hence we need to transfer the context of their call site (their og promise info). map from id of then function to its og promise
        var proxyPromisesIds = {};
        var catchResult = undefined;
        //used to store the result of catch from the catch that's been called with rewritten resolve and reject reactions in handlePromiseCatch() from invokeFunPre(),
        //the result is later used in invokeFun()
        var thenResult = undefined;
        //used to store the result of then from the then that's been called with rewritten resolve and reject reactions in handlePromiseThen() from invokeFunPre(),
        //the result is later used in invokeFun()

        /**
         * Maintains information of promise objects
         * @param pid
         * @param iid
         * @param argCount
         * @param resolveFunName
         * @param resolveFun
         * @param rejectFunName
         * @param rejectFun
         * @param oid
         * @constructor
         */
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

        /**
         * This function modifies Jalangi loader to exclude the core.js library from
         * the files Jalangi instruments. Instrumenting core.js makes Jalangi start
         * instrumenting its own functions, and runs into an infinitely nested stack.
         * onReady is a function Jalangi provides for if the user want any action
         * done before Jalangi starts moving.
         */
        var originalLoader = Module._extensions['.js'];
        this.onReady = function (start) {
            var jalangiModifiedLoader = Module._extensions['.js'];

            Module._extensions['.js'] = function (module, filename) {
                if (filename.indexOf('core-js') === -1) {
                    jalangiModifiedLoader(module, filename);
                } else {
                    originalLoader(module, filename);
                }
            };

            start();
        };

        /**
         * Extract the name of current test being executed from parameters provided to the process
         */
        process.argv.forEach(function (val, index, array) {
            if (val.toString().indexOf('--pk_') > -1) {
                currentTestName = val.toString().split('--pk_').pop();
            }
        });

        /**import other modules*/
        var Utils = sandbox.InformationFlow.Utils;
        process.on('unhandledRejection', function(r){console.log(r)});
        /* ---------------------------------------------------------------------------------------------- */
        /* ---------------------------------------------------------------------------------------------- */
        /* Jalangi callbacks below */

        /**
         * Logs the name and location of a function upon entering the function
         * @param iid
         * @param f
         * @param dis
         * @param args
         */
        this.functionEnter = function (iid, f, dis, args) {
            if (DEBUG) Logger.log("** functionEnter " + helper.getName(f) + " at " + Utils.getLocation(iid) + " " + iid);
            functionStack.push({fun: f, explicitReturn: false});
        };

        /**
         * Logs the name and location of a function immediately after exiting the function
         * Detects whether the program normally exited the function or an exception was thrown
         * Also determines if the function returns a value
         * @param iid
         * @param returnVal
         * @param wrappedExceptionVal
         */
        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            f = functionStack[functionStack.length - 1].fun;
            if (DEBUG) Logger.log("*** functionExit " + helper.getName(f) + " at " + Utils.getLocation(iid) + " exception: "
                + wrappedExceptionVal + "  returnVal: " + returnVal);

            var explicitReturn = functionStack[functionStack.length - 1].explicitReturn;
            isThrow = functionStack[functionStack.length - 1].isThrow;
            explReturnMessage = !explicitReturn ? " implicitly returned" : " explicitly returned";
            f = functionStack.pop().fun;
        };

        /**
         * Maintains the value being returned from a function to be used on functionExit
         * @param iid
         * @param val
         * @private
         */
        this._return = function (iid, val) {
            if (DEBUG) Logger.log("*** Return: " + Utils.getLocation(iid));
            functionStack[functionStack.length - 1].explicitReturn = true;
        };

        /**
         * Maintains a thrown exception to be used on functionExit
         * @param iid
         * @param val
         * @private
         */
        this._throw = function (iid, val) {
            if (DEBUG) Logger.log("*** Throw: " + Utils.getLocation(iid));
            functionStack[functionStack.length - 1].isThrow = true;
        };

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

        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid) {
            if (DEBUG) Logger.log("** invokeFunPre: " + helper.getName(f, iid));

            var location = Utils.getLocation(iid);
            var oid;
            var pInfo;
            var resultPromiseInfo;

            // the context is transferred with .bind() in js, and so we need to keep the original promise here to simulate that in our analysis
            if (f === Function.prototype.bind) {
                handleBindPromiseThen(base, args);
            }

            if (f === setTimeout) { // if we call a function via setTimeout, wrap it and emit the appropriate information
                // if the callee is the resolve/reject function for a promise
                var fun = args[0];
                handleSetTimeout(fun, args, location, iid); // wrap a function around the asynchronously called function
                return {"skip": true}; // skip normal execution of this function
            }

            if (isConstructor && (helper.isPromise(f) || helper.isAnyBluebirdPromise())) {
                pInfo = new PromiseInfo(promiseCount++, iid, 0);
                promiseStack.push(pInfo); // push new PromiseInfo ƒonto stack, record iid and initialize number of args
                Logger.promisifyBegin(location, pInfo.getPromiseId());
            }

            if (isConstructor && f === Proxy) {
                // handle proxies in invokeFun()
            }

            if (helper.isPromiseResolve(f)) {
                pInfo = new PromiseInfo(promiseCount++, iid, 0);
                promiseStack.push(pInfo); // push new PromiseInfo onto stack, record iid and initialize number of args
                Logger.resolveFun(location, pInfo.getPromiseId());
            }

            if (helper.isPromiseReject(f)) {
                pInfo = new PromiseInfo(promiseCount++, iid, 0);
                promiseStack.push(pInfo); // push new PromiseInfo onto stack, record iid and initialize number of args
                Logger.rejectFun(location, pInfo.getPromiseId());
            }

            if (helper.isPromiseCatch(f)) {
                handlePromiseCatch(args, iid, location, base);
                return {"skip": true, "f": f, "base": base, "args": args}; // skip normal execution of this function
            }

            if (helper.isPromiseThen(f) || (helper.getName(f) === 'bound then' && helper.isPromise(base))) {
                handlePromiseThen(f, args, iid, location, base);
                return {"skip": true, "f": f, "base": base, "args": args}; // skip normal execution of this function
            }
        };


        /* ---------------------------------------------------------------------------------------------- */
        /* ---------------------------------------------------------------------------------------------- */
        /* helper functions for invokeFunPre below */

        /**
         * checks if there is a bound promise, if yes, puts the bound promise into boundThenFunctions for future reference
         * @param base
         * @param args
         */
        function handleBindPromiseThen(base, args){
            if (helper.isPromiseThen(base)) {
                if (helper.isPromise(args[0])) {
                    boundThenFunctions[Utils.getObjectID(base, '', false)] = {
                        promise: Utils.getObjectID(args[0], '', false),
                        funcBody: base
                    }
                }
            }
        }

        /**
         * prepare the settimeout function for if the callee is the resolve/reject function for a promise
         * @param fun
         * @param args
         * @param location
         * @param iid
         */
        function handleSetTimeout(fun, args, location, iid){
            setTimeout(function (value) {
                // check if resolve() or reject() is called
                if (fun.name === "") { // check if the callee is an anonymous function
                    if (resolveToPromise.get(fun) !== undefined) {
                        var pInfo = resolveToPromise.get(fun);
                        Logger.resolve(location, pInfo.getPromiseId(), value, Utils.getValOid(value, oidToPromiseInfo, proxyPromisesIds), "", isThrow, Utils.getObjectID(args[0], '', false), helper.getName(args[0], iid));
                    } else if (rejectToPromise.get(fun) !== undefined) {
                        var pInfo = rejectToPromise.get(fun);
                        Logger.reject(location, pInfo.getPromiseId(), value, Utils.getValOid(value, oidToPromiseInfo, proxyPromisesIds), "", isThrow, Utils.getObjectID(args[0], '', false), helper.getName(args[0], iid));
                    } else if (boundThenFunctions[Utils.getObjectID(fun, '', false)] !== 'undefined') {
                        console.log('analysis.js::invokeFunPre >> BINDING promises');
                    }
                }
                fun(value);
            }, args[1], args[2]); // wrap a function around the asynchronously called function
        }


        /**
         * Retrieve informations related to the catch() function.
         * Calls logger for Logger.registerResolve(), Logger.registerReject(), Logger.promisifyByCatch()
         * Also calls rewriteThenResolveReaction and rewriteThenRejectReaction for rewriting the two reactions
         * @param args
         * @param iid
         * @param location
         * @param base
         */
        function handlePromiseCatch(args, iid, location, base){
            var oid = Utils.getObjectID(base, '', false);
            var pInfo = oidToPromiseInfo[oid];
            var resultPromiseInfo = new PromiseInfo(promiseCount++, iid);

            var catchResolveReaction, catchRejectReaction, catchResName, catchResOid, catchRejName, catchRejOid, argumentOfReaction;

            if (typeof pInfo === 'undefined') {
                pInfo = oidToPromiseInfo[boundThenFunctions[Utils.getObjectID(f, '', false)].promise];
            }

            catchResolveReaction = function _default(value) {
                Logger.resolve(location, resultPromiseInfo.getPromiseId(), value, Utils.getValOid(value, oidToPromiseInfo, proxyPromisesIds), explReturnMessage, isThrow,
                    catchResOid, catchResName);
                return value;
            };

            catchResName = helper.getName(catchResolveReaction, iid);
            catchResOid = Utils.getObjectID(catchResolveReaction, '', false);
            Logger.registerResolve(location, pInfo.getPromiseId(), catchResName, catchResOid);
            var handlerType = loggerUtils.findType(args[0]);
            if (handlerType !== "function"){
                catchRejectReaction = function _default(value) {
                    Logger.reject(location, resultPromiseInfo.getPromiseId(), value, Utils.getValOid(value, oidToPromiseInfo, proxyPromisesIds), explReturnMessage, isThrow,
                        catchRejOid, catchRejName);
                    throw value;
                };
            }
            else {
                catchRejectReaction = function (value) {
                    try {
                        var catchReturnVal = args[0].call(base, value);
                        Logger.resolve(location, resultPromiseInfo.getPromiseId(), catchReturnVal, Utils.getValOid(catchReturnVal, oidToPromiseInfo, proxyPromisesIds),
                            explReturnMessage, isThrow, catchRejOid, catchRejName);
                        return catchReturnVal;
                    } catch (exc) {
                        Logger.reject(location, resultPromiseInfo.getPromiseId(), exc, Utils.getValOid(exc, oidToPromiseInfo, proxyPromisesIds), "", isThrow,
                            catchRejOid, catchRejName);
                        // FT: explReturnMessage N/A when promises are rejected
                        throw exc;
                    }
                };
            }

            catchRejName = (handlerType === "function") ? helper.getName(args[0], iid) : helper.getName(catchRejectReaction, iid);
            catchRejOid = (handlerType === "function") ? Utils.getObjectID(args[0], '', false) : Utils.getObjectID(catchRejectReaction, '', false);

            Logger.registerReject(location, pInfo.getPromiseId(), catchRejName, catchRejOid);

            catchResult = Promise.prototype.then.call(base, catchResolveReaction, catchRejectReaction);
            var catchResultOid = Utils.getObjectID(catchResult, '', false);
            resultPromiseInfo.oid = catchResultOid;
            oidToPromiseInfo[catchResultOid] = resultPromiseInfo;

            Logger.promisifyByCatch(location, pInfo.getPromiseId(), resultPromiseInfo.getPromiseId());
        }

        /**
         * Retrieve informations related to the then() function.
         * Calls logger for Logger.then(), Logger.registerResolve(), Logger.registerReject(), Logger.promisifyByThen()
         * Also calls rewriteThenResolveReaction and rewriteThenRejectReaction for rewriting the two reactions
         * @param f
         * @param args
         * @param iid
         * @param location
         * @param base
         */
        function handlePromiseThen(f, args, iid, location, base) {
            var oid = Utils.getObjectID(base, '', false);

            if (typeof oid === 'undefined' || oid === 'objundefined') {
                oid = proxyPromisesIds[JSON.stringify(base)];
            }

            var pInfo = oidToPromiseInfo[oid];
            var resultPromiseInfo = new PromiseInfo(promiseCount++, iid);
            var argumentOfReaction = args[0].length;
            var rejectReaction, resolveReaction, resOid, resName, rejOid, rejName, resType, rejType;

            // check if the then function was bound (using Function.prototype.bind) and thus we need to look up its original context
            if (typeof pInfo === 'undefined') {
                pInfo = oidToPromiseInfo[boundThenFunctions[Utils.getObjectID(f, '', false)].promise];
            }

            Logger.then(location, pInfo.getPromiseId());
            resType = loggerUtils.findType(args[0]);
            if (resType !== "function") {
                resolveReaction = function _default(value) {
                    Logger.resolve(location, resultPromiseInfo.getPromiseId(), value, Utils.getValOid(value, oidToPromiseInfo, proxyPromisesIds), explReturnMessage, isThrow,
                        resOid, resName);
                    return value;
                };
            } else if (JSON.stringify(args[0]) !== "undefined") {
                resolveReaction = function _resolveReactionWrapper(value) {
                    try {
                        var returnVal = args[0].call(base, value);

                        if (helper.isPromise(returnVal)) { // handle linking case
                            var returnValOID = Utils.getObjectID(returnVal, '', false);
                            if (typeof returnValOID === 'undefined' || returnValOID === 'objundefined' || (typeof oidToPromiseInfo[returnValOID] === 'undefined')) {
                                returnValOID = proxyPromisesIds[JSON.stringify(returnVal)];
                            }
                            var returnValInfo = oidToPromiseInfo[returnValOID];
                            Logger.link(location, resultPromiseInfo.getPromiseId(), returnValInfo.getPromiseId());

                            // when returnValInfo promise is resolved, generate message that resultPromiseInfo was resolved with the same value
                            returnVal.then(function (value) {
                                Logger.resolve(location, resultPromiseInfo.getPromiseId(), value, returnValInfo.getPromiseId(),
                                    explReturnMessage, isThrow, resOid, resName, true);

                            }, function (value) {
                                Logger.reject(location, resultPromiseInfo.getPromiseId(), value, returnValInfo.getPromiseId(),
                                    explReturnMessage, isThrow, resOid, resName, true);
                            });
                            return returnVal;
                        } else {
                            Logger.resolve(location, resultPromiseInfo.getPromiseId(), returnVal, Utils.getValOid(returnVal, oidToPromiseInfo, proxyPromisesIds), explReturnMessage,
                                isThrow, resOid, resName);
                            return returnVal;
                        }
                    } catch (exc) {
                        Logger.reject(location, resultPromiseInfo.getPromiseId(), exc, Utils.getValOid(exc, oidToPromiseInfo, proxyPromisesIds), "", isThrow, resOid, resName);
                        // FT: explReturnMessage N/A when promises are rejected
                        throw exc;
                    }
                };
            }

            resName = (resType === "function") ? helper.getName(args[0], iid) : helper.getName(resolveReaction, iid);
            resOid = (resType === "function") ? Utils.getObjectID(args[0], '', false) : Utils.getObjectID(resolveReaction, '', false);

            Logger.registerResolve(location, pInfo.getPromiseId(), resName, resOid, argumentOfReaction);

            rejType = args.length === 1 || loggerUtils.findType(args[1]) !== "function";

            if (rejType) {
                rejectReaction = function _default(value) {
                    Logger.reject(location, resultPromiseInfo.getPromiseId(), value, Utils.getValOid(value, oidToPromiseInfo, proxyPromisesIds), "", isThrow, rejOid, rejName);
                    // FT: explReturnMessage N/A when promises are rejected

                    throw value;
                };
            } else {
                rejectReaction = function _rejectReactionWrapper(value) {
                    try {
                        var returnVal = args[1].call(base, value);
                        Logger.resolve(location, resultPromiseInfo.getPromiseId(), returnVal, Utils.getValOid(returnVal, oidToPromiseInfo, proxyPromisesIds), explReturnMessage,
                            isThrow, rejOid, rejName);
                        return returnVal;
                    } catch (exc) {
                        Logger.reject(location, resultPromiseInfo.getPromiseId(), exc, Utils.getValOid(exc, oidToPromiseInfo, proxyPromisesIds), "", isThrow, rejOid, rejName);
                        // FT: explReturnMessage N/A when promises are rejected
                        throw exc;
                    }
                }
            }
            rejName = (!rejType) ? helper.getName(args[1], iid) : helper.getName(rejectReaction, iid);
            rejOid = (!rejType) ? Utils.getObjectID(args[1], '', false) : Utils.getObjectID(rejectReaction, '', false);
            Logger.registerReject(location, pInfo.getPromiseId(), rejName, rejOid, argumentOfReaction);

            thenResult = f.call(base, resolveReaction, rejectReaction);
            var resultOid = Utils.getObjectID(thenResult, '', false);
            resultPromiseInfo.oid = resultOid;
            oidToPromiseInfo[resultOid] = resultPromiseInfo;
            Logger.promisifyByThen(location, pInfo.getPromiseId(), resultPromiseInfo.getPromiseId());
        }


        /* end helper functions for invokeFunPre */
        /* ---------------------------------------------------------------------------------------------- */
        /* ---------------------------------------------------------------------------------------------- */


        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid) {
            var pInfo, oid, resultOid, resultPromiseInfo, argLog, argType, argOid, argPInfo;

            // the then function or catch function has been executed in invokeFunPre(), so we simply return the stored result in here
            // (see the Promise.prototype.then.call in handlePromiseCatch()--because catch has been rewrote in rewriteCatchResolve/RejectReaction
            // to include both reject reaction and a default resolve reaction--and f.call in handlePromiseThen(), both called in invokeFunPre())
            if (helper.isPromiseThen(f) || (f !== undefined && helper.getName(f) === 'bound then' && helper.isPromise(base))) {
                return {"result": thenResult};
            }
            if (helper.isPromiseCatch(f)) {
                return {"result": catchResult};
            }

            // f is undefined if we skipped the invokeFunPre
            if (f === undefined) {
                return;
            }

            if (DEBUG) Logger.log("*** invokeFun: " + helper.getName(f));

            // check if resolve() or reject() is called
            // directly resolving, no need to add f->v link here
            if (f.name === "") { // check if the callee is an anonymous function
                if (resolveToPromise.get(f) !== undefined) {
                    handleDirectResolve(f, args, iid);
                } else if (rejectToPromise.get(f) !== undefined) {
                    handleDirectReject(f, args, iid);
                }
            }

            // return from call to Promise constructor -- record OID
            if (isConstructor && helper.isPromise(f)) {
                handlePromisifyEnd(iid, result);
            }

            if (isConstructor && f === Proxy) {
                handleProxyPromise(iid, result, args);
            }

            // return from call to Promise.resolve() -- record OID, process resolve
            if (helper.isPromiseResolve(f)) {
                handlePromiseResolve(result, args, iid);
            }

            // return from call to Promise.reject() -- record OID, process reject
            if (helper.isPromiseReject(f)) {
                handlePromiseReject(result, args, iid);
            }

            if (helper.isPromiseAll(f)) {
                // create PromiseInfo for the promise created by all
                handlePromiseAll(result, args, iid);
            }

            if (helper.isPromiseRace(f)) {
                handlePromiseRace(result, args, iid);
            }
        };


        /* ---------------------------------------------------------------------------------------------- */
        /* ---------------------------------------------------------------------------------------------- */
        /* helper functions for invokeFun below */



        /**
         * This function deals with collecting information for Promise.resolve() calls and passing them to corresponding logger
         * function (namely Logger.resolve)
         * @param f
         * @param args
         * @param iid
         */
        function handleDirectResolve (f, args, iid) {
            var pInfo = resolveToPromise.get(f);
            // check if argument is a promise, then it should be linked
            if (helper.isPromise(args[0]) || helper.isAnyBluebirdPromise(args[0])) {
                // promise passed to resolve function
                var argOid = Utils.getObjectID(args[0], '', false);
                var argPInfo = oidToPromiseInfo[argOid];
                Logger.resolve(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], argPInfo.getPromiseId());
            }
            else {
                Logger.resolve(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], Utils.getValOid(args[0], oidToPromiseInfo, proxyPromisesIds), "");
            }
        }

        /**
         * This function deals with collecting information for Promise.reject() calls and passing them to corresponding logger
         * function (namely Logger.reject)
         * @param f
         * @param args
         * @param iid
         */
        function handleDirectReject (f, args, iid) {
            var pInfo = rejectToPromise.get(f);
            Logger.reject(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], Utils.getValOid(args[0], oidToPromiseInfo, proxyPromisesIds), "");
        }

        /**
         * This function collects data for when the program returned from call to promise constructor, and pass them to logger
         * @param iid
         * @param result
         */
        function handlePromisifyEnd(iid, result) {
            var pInfo = promiseStack[promiseStack.length - 1];
            var oid = Utils.getObjectID(result, '', false);
            pInfo.oid = oid;  // record oid for current promise
            oidToPromiseInfo[oid] = pInfo; // add mapping for this OID
            Logger.promisifyEnd(Utils.getLocation(iid), pInfo.getPromiseId(), oid);
            promiseStack.pop();
        }

        /**
         * This function collects data for when it's a proxy promise, and pass them to logger
         * @param iid
         * @param result
         * @param args
         */
        function handleProxyPromise (iid, result, args) {
            var location = Utils.getLocation(iid);
            // if args[0] input promise
            // result should be output promise

            if (helper.isPromise(args[0])) {
                var pInfo = new PromiseInfo(promiseCount ++, iid, 0);

                var resultOid = helper.getProxyPromiseId(result, '', false);
                proxyPromisesIds[JSON.stringify(result)] = resultOid;
                oidToPromiseInfo[resultOid] = pInfo;
                pInfo.oid = resultOid; //

                Logger.promisifyByProxy(location, oidToPromiseInfo[Utils.getObjectID(args[0], '', false)].getPromiseId(), pInfo.getPromiseId());
            }
            else {
                // here you can add treatment for proxies on other objects
            }
        }

        /**
         * Used to collect information from promise resolve, and call logger to log the information
         * @param result
         * @param args
         * @param iid
         */
        function handlePromiseResolve(result, args, iid){
            var pInfo = promiseStack[promiseStack.length - 1];
            var oid = Utils.getObjectID(result, '', false);
            pInfo.oid = oid;  // record oid for current promise
            oidToPromiseInfo[oid] = pInfo; // add mapping for this OID=

            Logger.resolveFuncEnd(Utils.getLocation(iid), pInfo.getPromiseId(), oid);
            Logger.resolve(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], Utils.getValOid(args[0], oidToPromiseInfo, proxyPromisesIds), "");
        }

        /**
         * Used to collect information from promise reject, and call logger to log the information
         * @param result
         * @param args
         * @param iid
         */
        function handlePromiseReject(result, args, iid){
            var pInfo = promiseStack[promiseStack.length - 1];
            var oid = Utils.getObjectID(result, '', false);
            pInfo.oid = oid;  // record oid for current promise
            oidToPromiseInfo[oid] = pInfo; // add mapping for this OID=

            Logger.rejectFuncEnd(Utils.getLocation(iid), pInfo.getPromiseId(), oid);
            Logger.reject(Utils.getLocation(iid), pInfo.getPromiseId(), args[0], Utils.getValOid(args[0], oidToPromiseInfo, proxyPromisesIds), 'explicit?');
        }

        /**
         * Used to collect information from promise.all(), and call logger to log the information
         * @param result
         * @param args
         * @param iid
         */
        function handlePromiseAll(result, args, iid){
            resultOid = Utils.getObjectID(result, '', false);
            resultPromiseInfo = new PromiseInfo(promiseCount ++, iid);
            resultPromiseInfo.oid = resultOid;
            oidToPromiseInfo[resultOid] = resultPromiseInfo;

            var allArgsLog = logPromiseAll(args, resultOid, resultPromiseInfo, oidToPromiseInfo);
            Logger.all(Utils.getLocation(iid), resultPromiseInfo.getPromiseId(), allArgsLog);
        }

        /**
         * Used to collect information from promise.race(), and call logger to log the information
         * @param result
         * @param args
         * @param iid
         */
        function handlePromiseRace(result, args, iid){
            resultOid = Utils.getObjectID(result, '', false);
            resultPromiseInfo = new PromiseInfo(promiseCount ++, iid);
            resultPromiseInfo.oid = resultOid;
            oidToPromiseInfo[resultOid] = resultPromiseInfo;

            var raceArgsLog = logPromiseRace(args, resultOid, resultPromiseInfo, oidToPromiseInfo);
            Logger.race(Utils.getLocation(iid), resultPromiseInfo.getPromiseId(), raceArgsLog);
        }

        /**
         * This function collects all the information we need from Promise.all, puts them into a log file
         * and returns it, for later use when calling Logger.all()
         * @param args
         * @param resultOid
         * @param resultPromiseInfo
         * @param oidToPromiseInfo
         * @returns allArgsLog
         */
        function logPromiseAll(args, resultOid, resultPromiseInfo, oidToPromiseInfo){
            var allArgs = args[0];
            var allArgsLog = [];
            for (i = 0; i < allArgs.length; i ++) {
                var argLog = {};
                var argType = typeof allArgs[i];
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
                        if (helper.isPromise(allArgs[i])) {
                            // if (allArgs[i] instanceof Promise) {
                            argLog['type'] = 'promise';
                            argLog['value'] = allArgs[i].toString();
                            var argOid = Utils.getObjectID(allArgs[i], '', false);
                            var argPInfo = oidToPromiseInfo[argOid];
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

            return allArgsLog;
        }

        /**
         * This function collects all the information we need from Promise.race, puts them into a log file
         * and returns it, for later use when calling Logger.race()
         * @param args
         * @param resultOid
         * @param resultPromiseInfo
         * @param oidToPromiseInfo
         * @returns raceArgsLog
         */
        function logPromiseRace (args, resultOid, resultPromiseInfo, oidToPromiseInfo) {
            var raceArgs = args[0];
            var raceArgsLog = [];
            for (var i = 0; i < raceArgs.length; i ++) {
                var argLog = {};
                var argType = loggerUtils.findType(raceArgs[i]);
                if (argType === 'promise'){
                    argLog['type'] = 'promise';
                    var argOid = Utils.getObjectID(raceArgs[i], '', false);
                    var argPInfo = oidToPromiseInfo[argOid];
                    argLog['pID'] = argPInfo.getPromiseId();
                    argLog['value'] = loggerUtils.addType(raceArgs[i]) + " " + argLog['pID'];
                }
                else {
                    argLog['type'] = argType;
                    argLog['value'] = loggerUtils.addType(raceArgs[i]);
                }
                raceArgsLog.push(argLog);
            }

            return raceArgsLog;
        }

        /* end helper functions for invokeFunPre */
        /* ---------------------------------------------------------------------------------------------- */
        /* ---------------------------------------------------------------------------------------------- */




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

        /**
         * This function is invoked when the whole execution finishes (different from exitScript, which only considers one script file)
         * After the execution of the instrumented application finishes and the JSON logs are persisted,
         * this function starts the post-analysis phase of the algorithm,
         * which includes creating the promise graphs, inferring the anti-patterns, and visualizing the graphs overlaid with anti-pattern information as well as the textual reports
         */
        this.endExecution = function () {
            var appName = sandbox.Spec.appInfo.name;
            if (DEBUG) Logger.log("** endExecution for " + appName);
            var firstFileName = __originalFileNames[0];

            if (firstFileName.indexOf('tests-nodejs') > -1) {  // nodejs tests
                createNodeAppGraphs(firstFileName, appName);
            }
            else {  // unit tests
                createSingleFileGraphs(firstFileName, appName);
            }
        };

        /**
         * This function creates graphs for single JS files as input, when execution ends
         * @param firstFileName
         * @param appName
         */
        function createSingleFileGraphs (firstFileName, appName) {
            var fileName = path.basename(firstFileName);
            Logger.endExecution(appName);
            var promisesGraph = new PromisesGraph(fileName);

            promisesGraph.importLog(fileName, common.TOOL_HOME + path.sep + 'tests-unit/output-actual/json-logs',
                common.TOOL_HOME + path.sep + 'tests-unit/output-actual/graphs',
                common.TOOL_HOME + path.sep + 'tests-unit/output-actual/graph-vis');
        }

        /**
         * This function creates graphs for Node.js applications, inferred by running their test suites
         * @param firstFileName
         * @param appName
         */
        function createNodeAppGraphs (firstFileName, appName) {
            if (currentTestName === '' || currentTestName === undefined) {
                throw "Expecting --pk_ argument in currentTestName in nodejs branch for endExecution";
            }
            var fileName = currentTestName;
            var benchmarkInputPath = path.join(path.dirname(firstFileName), '..');
            var benchmarkName = benchmarkInputPath.split(path.sep).pop();
            var nodejsTestPath = path.join(benchmarkInputPath, '../..');

            var getFileNameWithPath = function(rawName) {
                if (rawName.endsWith(".js")) {
                    return rawName.substring(0, -3);
                } else {
                    return rawName;
                }
            };

            var textLogPath = path.join(nodejsTestPath, 'output-actual', 'text-logs', benchmarkName, getFileNameWithPath(fileName) + '_out.js');
            var jsonLogPath = path.join(nodejsTestPath, 'output-actual', 'json-logs', benchmarkName, fileName + '.json');

            Logger.endExecution(appName, '', textLogPath, jsonLogPath);
            var promiseGraph = new PromisesGraph(fileName);

            var graphLogPath = path.join(nodejsTestPath, 'output-actual', 'graphs', benchmarkName);
            var graphVisLogPath = path.join(nodejsTestPath, 'output-actual', 'graph-vis', benchmarkName);

            promiseGraph.importLog(fileName, path.join(nodejsTestPath, 'output-actual', 'json-logs', benchmarkName),
                graphLogPath, graphVisLogPath);
        }

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

        /**
         * Records the original file name and its name after being instrumented by jalangi, when entering the file
         * @param iid
         * @param instrumentedFileName
         * @param originalFileName
         */
        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            Logger.enterScript(Utils.getLocation(iid), path.basename(instrumentedFileName), path.basename(originalFileName));
            __originalFileNames.push(originalFileName);
        };

        /**
         * Records the location of exiting a script file
         * @param iid
         * @param wrappedExceptionVal
         */
        this.scriptExit = function (iid, wrappedExceptionVal) {
            Logger.exitScript(Utils.getLocation(iid));
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);