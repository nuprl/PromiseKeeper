var assert = require('assert');
var shell=require('shelljs');
var fs = require('fs');
var common = require('./common');
const path = require('path');

var INPUT_DIR = common.TOOL_HOME + path.sep + 'tests-unit' + path.sep + 'input';
var ACTUAL_OUTPUT_DIR = common.TOOL_HOME + path.sep + 'tests-unit' + path.sep + 'output-actual';
var EXPECTED_OUTPUT_DIR = common.TOOL_HOME + path.sep + 'tests-unit'+ path.sep + 'output-expected';

/**
 * Perform the following steps for each test case:
 *   1) run Jalangi
 *   2) check if the actually generated code matches the expected generated code
 * Each of these steps is performed by a separate sub-test, and expects that the preceeding
 * steps have already been performed.
 *
 * @param testName
 */

function runTests(testName){
    it(testName + '(runJalangi)', function (done) {                                     /* subtest 1: run the Jalangi-instrumented code */
        this.timeout(10000);
        common.runJalangi(testName, INPUT_DIR, ACTUAL_OUTPUT_DIR);
        done();
    });
    it(testName + '(checkoutput)', function (done) {                                    /* subtest 2: check that the expected output is computed */
        common.checkGeneratedCode(testName, ACTUAL_OUTPUT_DIR, EXPECTED_OUTPUT_DIR);
        done();
    });
    it(testName + 'checkGraph', function (done) {
        common.checkGeneratedGraph(testName, ACTUAL_OUTPUT_DIR, EXPECTED_OUTPUT_DIR);
        done();
    });
}

/**
 * The test suite. Runs all the sub-tests on all the test cases.
 */
describe('unit-tests', function() {
    // note: need to keep the "describe" here so that the WebStorm IDE will let us re-run individual tests.

    describe('NewPromiseImmediateResolve', function() { runTests('NewPromiseImmediateResolve'); }); // new Promise, resolve
    describe('NewPromiseImmediateReject', function() { runTests('NewPromiseImmediateReject'); }); // new Promise, reject
    describe('NewPromiseResolveThen1', function() { runTests('NewPromiseResolveThen1'); }); // new Promise, resolve, then (anon function)
    describe('NewPromiseResolveThen2', function() { runTests('NewPromiseResolveThen2'); }); // new Promise, resolve, then (named function)
    describe('PromiseResolveThen', function() { runTests('PromiseResolveThen'); }); // Promise.resolve(), then
    describe('NewPromiseThenThen', function() { runTests('NewPromiseThenThen'); }); // new Promise, then, then
    describe('NewPromiseResolveTwoArgThenThen', function() { runTests('NewPromiseResolveTwoArgThenThen'); });  // new Promise, resolve, two-arg then, then
    describe('NewPromiseRejectTwoArgThenCatch', function() { runTests('NewPromiseRejectTwoArgThenCatch'); });  // new Promise, reject, two-arg then, catch
    describe('NewPromiseResolveTwoArgThenCatch', function() { runTests('NewPromiseResolveTwoArgThenCatch'); });  // new Promise, resolve, two-arg then, catch (not triggered)
    describe('NewPromiseRejectTwoArgThenThen', function() { runTests('NewPromiseRejectTwoArgThenThen'); });    // new Promise, reject, two-arg then, then
    describe('PromiseChain1', function() { runTests('PromiseChain1'); }); // new Promise, resolve, then, then, catch
    describe('PromiseChain2', function() { runTests('PromiseChain2'); }); // new Promise, resolve, then, then, catch
    describe('PromiseChain3', function() { runTests('PromiseChain3'); }); // new Promise, resolve, then, then, catch
    describe('PromiseChain4', function() { runTests('PromiseChain4'); }); // new Promise, resolve, then, catch
    describe('PromiseChain5', function() { runTests('PromiseChain5'); }); // Promise.resolve, then, skip several thens, catch
    describe('PromiseChain6', function() { runTests('PromiseChain6'); }); // Promise.resolve, then, skip several thens, catch
    describe('BypassCatch', function() { runTests('BypassCatch'); }); // Promise.resolve, catch, using default catch onResolve
    describe('NewPromiseThenImplicitReturns', function() { runTests('NewPromiseThenImplicitReturns'); }); // new Promise, resolve, then (implicit return), then (implicit return)
    describe('NewPromiseBranchingThens1', function() { runTests('NewPromiseBranchingThens1'); }); // two then reactions on the same promise
    describe('NewPromiseBranchingThens2', function() { runTests('NewPromiseBranchingThens2'); }); // two then reactions on the same promise
    describe('NewPromiseBranchingThens3', function() { runTests('NewPromiseBranchingThens3'); }); // two then reactions on the same promise
    describe('NewPromiseResolveLater1', function() { runTests('NewPromiseResolveLater1'); }); // assign resolve fun to variable, invoke later
    describe('NewPromiseResolveLater2', function() { runTests('NewPromiseResolveLater2'); }); // assign resolve fun to variable, invoke later
    describe('NewPromiseResolveAsync', function() { runTests('NewPromiseResolveAsync'); }); // new Promise, resolve asynchronously via setTimeout
    describe('NewPromiseRejectAsync', function() { runTests('NewPromiseRejectAsync'); }); // new Promise, reject asynchronously via setTimeout
    describe('LinkedPromises1', function() { runTests('LinkedPromises1'); }); // example of linked promises
    describe('LinkedPromises2', function() { runTests('LinkedPromises2'); }); // example of linked promises with setTimeOut resolve
    describe('LinkedPromises3', function() { runTests('LinkedPromises3'); }); // example of linked promises with explicit then onReject
    describe('LinkedPromises4', function() { runTests('LinkedPromises4'); }); // example of linked promises with default then onReject
    describe('LinkedPromises5', function() { runTests('LinkedPromises5'); }); // example of linked promises with default then onReject and catch
    describe('LinkedPromises6', function() { runTests('LinkedPromises6'); }); // example of linked promises with setTimeOut reject
    describe('LinkedByResolve', function() { runTests('LinkedByResolve'); });
    describe('LinkedByResolve2', function() { runTests('LinkedByResolve2'); });
    describe('PromiseReturnObjReject', function() { runTests('PromiseReturnObjReject'); });
    describe('PromiseReturnObjResolve', function() { runTests('PromiseReturnObjResolve'); });
    describe('PromiseReturnObjLinking1', function() { runTests('PromiseReturnObjLinking1'); });
    describe('PromiseReturnObjLinking2', function() { runTests('PromiseReturnObjLinking2'); });
    describe('PromiseReturnObjChain1', function() { runTests('PromiseReturnObjChain1'); });
    describe('PromiseReturnObjChain2', function() { runTests('PromiseReturnObjChain2'); });
    describe('PromiseReturnObjChain3', function() { runTests('PromiseReturnObjChain3'); });
    describe('PromiseReturnFunReject', function() { runTests('PromiseReturnFunReject'); });
    describe('PromiseReturnFunResolve', function() { runTests('PromiseReturnFunResolve'); });
    describe('PromiseReturnFunAsync1', function() { runTests('PromiseReturnFunAsync1'); });
    describe('PromiseReturnFunAsync2', function() { runTests('PromiseReturnFunAsync2'); });
    describe('PromiseReturnArrReject', function() { runTests('PromiseReturnArrReject'); });
    describe('PromiseReturnArrResolve', function() { runTests('PromiseReturnArrResolve'); });
    describe('PromiseReturnArrCatch1', function() { runTests('PromiseReturnArrCatch1'); });
    describe('PromiseReturnArrCatch2', function() { runTests('PromiseReturnArrCatch2'); });
    describe('AllResolve', function() { runTests('AllResolve'); });   // resolved Promise.all()
    describe('AllResolveAndReject', function() { runTests('AllResolveAndReject'); });   // rejected Promise.all()
    describe('AllAsyncResolve', function() { runTests('AllAsyncResolve'); });   // Promise.all() asynchronously resolved (most cases)
    describe('AllAsyncReject', function() { runTests('AllAsyncReject'); });   // Promise.all() asynchronously rejected
    describe('AllSyncResolve', function() { runTests('AllSyncResolve'); });   // Promise.all() synchronously resolved (only with an empty input array)
    describe('AllFailFirstBehaviour', function() { runTests('AllFailFirstBehaviour'); });   // Promise.all() immediately rejected after first rejected input
    describe('AllPendingFulfillment', function() { runTests('AllPendingFulfillment'); });   // Promise.all() pending fulfillment when an argument is never fulfilled (and nothing is rejected)
    describe('AllRejectedWhilePending', function() { runTests('AllRejectedWhilePending'); });   // Promise.all() rejected (one input promise is never fulfilled)
    describe('RacePrimitivesOnly', function() { runTests('RacePrimitivesOnly'); });
    describe('RaceResolve1', function() { runTests('RaceResolve1'); });
    describe('RaceResolve2', function() { runTests('RaceResolve2'); });
    describe('RaceReject1', function() { runTests('RaceReject1'); });
    describe('RaceReject2', function() { runTests('RaceReject2'); });
    describe('RacePend', function() { runTests('RacePend'); });
    describe('RaceMultipleReject1', function() { runTests('RaceMultipleReject1'); });
    describe('RaceMultipleResolve1', function() { runTests('RaceMultipleResolve1'); });
    describe('MultipleFulfillPrim1', function() { runTests('MultipleFulfillPrim1'); });
    describe('MultipleFulfillPrim2', function() { runTests('MultipleFulfillPrim2'); });
    describe('MultipleFulfillFunc1', function() { runTests('MultipleFulfillFunc1'); });
    describe('MultipleFulfillFunc2', function() { runTests('MultipleFulfillFunc2'); });
    describe('MultipleFulfillObj1', function() { runTests('MultipleFulfillObj1'); });
    describe('MultipleFulfillObj2', function() { runTests('MultipleFulfillObj2'); });
    describe('PromiseBranch0', function() { runTests('PromiseBranch0'); });
    describe('PromiseBranch', function() { runTests('PromiseBranch'); });
    describe('PromiseBranch2', function() { runTests('PromiseBranch2'); });
    describe('PromiseBranch3', function() { runTests('PromiseBranch3'); });
    describe('PromiseBranch4', function() { runTests('PromiseBranch4'); });
    describe('PromiseProxyThen', function() { runTests('PromiseProxyThen'); });
    describe('ReturnNewBluebirdPromise', function() { runTests('ReturnNewBluebirdPromise'); }); // new bluebird Promise
    describe('ReturnNewBluebirdPromiseThen', function() { runTests('ReturnNewBluebirdPromiseThen'); }); // call then on new bluebird Promise
    describe('BluebirdPromiseChain', function() { runTests('BluebirdPromiseChain'); });
    describe('BluebirdPromiseReject', function() { runTests('BluebirdPromiseReject'); });
    describe('PosterExample', function() { runTests('PosterExample'); }); //git di

    // examples of buggy promise-based programs
    describe('BugDeadPromise1', function() { runTests('BugDeadPromise1'); }); //
    describe('BugDeadPromise2', function() { runTests('BugDeadPromise2'); }); //
    describe('BugDeadPromise3', function() { runTests('BugDeadPromise3'); }); //
    describe('BugDoubleSettle1', function() { runTests('BugDoubleSettle1'); }); //
    describe('BugDoubleSettle2', function() { runTests('BugDoubleSettle2'); }); //
    describe('BugMissingReturn1', function() { runTests('BugMissingReturn1'); }); //
    describe('BugMissingReturn2', function() { runTests('BugMissingReturn2'); }); //
    describe('BugMissingReturn3', function() { runTests('BugMissingReturn3'); }); //
    describe('BugMissingReturn4', function() { runTests('BugMissingReturn4'); }); //
    describe('BrokenPromiseChain', function() { runTests('BrokenPromiseChain'); }); //
    describe('BrokenPromiseChain2', function() { runTests('BrokenPromiseChain2'); }); //
    describe('PromiseCallbackHell', function() { runTests('PromiseCallbackHell'); });
    describe('MultipleThens1', function() { runTests('MultipleThens1'); }); // new Promise, resolve
    describe('MultipleThensError1', function() { runTests('MultipleThensError1'); }); // new Promise, resolve
    describe('MultipleThensError2', function() { runTests('MultipleThensError2'); }); // new Promise, resolve
    describe('PromisesInLoop1', function() { runTests('PromisesInLoop1'); }); // new Promise, resolve
    describe('PromisesInLoop2', function() { runTests('PromisesInLoop2'); }); // new Promise, resolve
    describe('MissingExceptionalReject2', function() { runTests('MissingExceptionalReject2'); }); //
    describe('MissingExceptionalReject3', function() { runTests('MissingExceptionalReject3'); }); //
    describe('MissingExceptionalRejectCaughtLater', function() { runTests('MissingExceptionalRejectCaughtLater'); }); //
    describe('MissingExceptionalRejectCaughtLater2', function() { runTests('MissingExceptionalRejectCaughtLater2'); }); //
    describe('ExplicitConstructionAntiPattern', function() { runTests('ExplicitConstructionAntiPattern'); });

    // several cases where a non-function argument is passed to "then" or "catch"
    // rename them to something more appropriate
    describe('BugOther1', function() { runTests('BugOther1'); }); //
    describe('BugOther2', function() { runTests('BugOther2'); }); //
    describe('BugOther3', function() { runTests('BugOther3'); }); //
    describe('BugOther4', function() { runTests('BugOther4'); }); //

    // bug patterns
    describe('DeadPromise', function() { runTests('DeadPromise'); }); //
    describe('MissingResolveOrReject', function() { runTests('MissingResolveOrReject'); }); //
    describe('MissingExceptionalReject', function() { runTests('MissingExceptionalReject'); }); //

    // create many promises in a loop
    describe('Loop1', function() { runTests('Loop1'); }); //

    // use the same function as a reaction for multiple promises
    describe('SharedReaction', function() { runTests('SharedReaction'); }); //
    describe('SharedReactionFunction', function() { runTests('SharedReactionFunction'); });

    // throwing a promise in a reaction TODO test doesn't exist
    // describe('ThrowPromise', function() { runTests('ThrowPromise'); }); //
});
