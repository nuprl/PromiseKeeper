var assert = require('assert');
var shell = require('shelljs');
var fs = require('fs');
const path = require('path');

function Common() {

    var JALANGI_HOME = shell.env['JALANGI_HOME'];
    var TOOL_HOME = shell.env['PROMISES_HOME'];
    var ANALYSIS_SRC_DIR = TOOL_HOME + path.sep + 'src';

    /**
     * retrieve the contents of a file (as an array of strings for each of its lines). Use
     * an array so that WebStorm's difference viewer works properly.
     * @param fileName
     * @returns {Array}
     */
    function getFileContents(fileName) {
        var result = fs.readFileSync(fileName).toString().split('\n'); // hack: use .split('\n') to ensure that the differences viewer shows line breaks
        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].trim();
        }
        return result;
    }

    /**
     * Compare actual and expected output and assert that they are the same
     */
    var checkOutput = function (actualOutputFileName, expectedOutputFileName) {
        shell.echo('actualOutputFileName: ' + actualOutputFileName);
        shell.echo('expectedOutputFileName: ' + expectedOutputFileName);
        var actualOutput = getFileContents(actualOutputFileName);
        var expectedOutput = getFileContents(expectedOutputFileName);

        // deepEqual fails with out-of-memory errors if the arrays become too large (e.g., on modulify-eval)
        if (actualOutput.length < 10000) {
            assert.deepEqual(actualOutput, expectedOutput);
        } else {
            for (var i = 0; i < actualOutput.length; i++) {
                var actualLine = "line #" + i + ": " + actualOutput[i];
                var expectedLine = "line #" + i + ": " + expectedOutput[i];
                assert.deepEqual(actualLine, expectedLine);
            }
        }
    };

    var checkOutput_temp = function (actualOutput, expectedOutput) {
        shell.echo('actualOutput: ' + actualOutput);
        shell.echo('expectedOutput: ' + expectedOutput);

        // deepEqual fails with out-of-memory errors if the arrays become too large (e.g., on modulify-eval)
        if (actualOutput.length < 10000) {
            assert.deepEqual(actualOutput, expectedOutput);
        } else {
            for (var i = 0; i < actualOutput.length; i++) {
                var actualLine = "line #" + i + ": " + actualOutput[i];
                var expectedLine = "line #" + i + ": " + expectedOutput[i];
                assert.deepEqual(actualLine, expectedLine);
            }
        }
    };


    /**
     * Compare actual and expected output and assert that they are the same
     * Same as checkOutput(), only does not consider the lines that have timeStamps since they may vary in each execution
     */
    var checkOutputTimeless = function (actualOutputFileName, expectedOutputFileName) {
        shell.echo('actualOutputFileName: ' + actualOutputFileName);
        shell.echo('expectedOutputFileName: ' + expectedOutputFileName);
        var actualOutput = getFileContents(actualOutputFileName);
        var expectedOutput = getFileContents(expectedOutputFileName);

        for (var i = 0; i < actualOutput.length; i++) {
            var actualLine = "line #" + i + ": " + actualOutput[i];
            var expectedLine = "line #" + i + ": " + expectedOutput[i];
            if (actualLine.indexOf('timeStamp') < 0 && expectedLine.indexOf('timeStamp') < 0)
                assert.deepEqual(actualLine, expectedLine);
        }
    };

    /**
     * Check that the generated code for a test case matches the expected generated code
     * (e.g., "example0_out.js" in the output/expected subdirectory).
     *
     * @param testName
     */
    var checkGeneratedCode = function (testName, actualOutputDir, expectedOutputDir) {
        var actualOutputFileName = actualOutputDir + path.sep + testName + '_out.js';
        var expectedOutputFileName = expectedOutputDir + path.sep + testName + '_out.js';
        checkOutput(actualOutputFileName, expectedOutputFileName);
    };

    /**
     * Check that the generated graph for a test case matches the expected generated graph
     * (e.g., "example0.js.json" in the output/expected -> graphs subdirectory).
     *
     * @param testName
     */
    var checkGeneratedGraph = function (testName, actualOutputDir, expectedOutputDir) {
        var actualOutputFileName = actualOutputDir + path.sep + 'graphs' + path.sep + testName + '.js.json';
        var expectedOutputFileName = expectedOutputDir + path.sep + 'graphs' + path.sep + testName + '.js.json';
        checkOutputTimeless(actualOutputFileName, expectedOutputFileName);
    };

    /**
     * 1. Run our Jalangi-based information-flow analysis on a test with the
     * specified name. Store the output in testName_actual_out.js. Check
     * for normal termination (exit code 0).
     * @param testName
     */
    var runJalangi = function (testName, inputDir, actualOutputDir, commandLineArgs) {

        var appFileName = inputDir + path.sep + testName + '.js';

        var actualOutputFileName = actualOutputDir + path.sep + testName + '_out.js';
        var command =
            'node ' + JALANGI_HOME + '/src/js/commands/jalangi.js --inlineIID --inlineSource ' +
            // ' --exclude **/example3.*' +
            ' --analysis ' + ANALYSIS_SRC_DIR + '/TraceWriter.js' +
            ' --analysis ' + JALANGI_HOME + '/src/js/sample_analyses/ChainedAnalyses.js' +
            ' --analysis ' + JALANGI_HOME + '/src/js/runtime/SMemory.js' +
            ' --analysis ' + ANALYSIS_SRC_DIR + '/utils.js' +
            ' --analysis ' + ANALYSIS_SRC_DIR + '/analysis.js' +
            ' --analysis ' + JALANGI_HOME + '/src/js/sample_analyses/dlint/Utils.js ' +
            // ' --analysis ' + ANALYSIS_SRC_DIR + '/node_modules/angular/angular.js' +
            appFileName +
            (commandLineArgs === undefined ? '' : ' ' + commandLineArgs);
        shell.echo('command: ' + command);
        var exitCode = shell.exec(command).code;
        assert.equal(exitCode, 0);

    };

    var runJalangiBenchmark = function (appName, inputDir, actualOutputDir, testName, commandLineArgs) {

        // var appFileName = inputDir + path.sep + testName + '.js';
        var appFileName = inputDir + path.sep + appName + '.js';

        // if (typeof testName !== 'undefined')
        //     commandLineArgs = testName;

        var actualOutputFileName = actualOutputDir + path.sep + testName + '_out.js';
        var command =
            'node ' + JALANGI_HOME + '/src/js/commands/jalangi.js --inlineIID --inlineSource ' +
            // ' --exclude **/example3.*' +
            ' --analysis ' + ANALYSIS_SRC_DIR + '/TraceWriter.js' +
            ' --analysis ' + JALANGI_HOME + '/src/js/sample_analyses/ChainedAnalyses.js' +
            ' --analysis ' + JALANGI_HOME + '/src/js/runtime/SMemory.js' +
            ' --analysis ' + ANALYSIS_SRC_DIR + '/utils.js' +
            ' --analysis ' + ANALYSIS_SRC_DIR + '/analysis.js' +
            ' --analysis ' + JALANGI_HOME + '/src/js/sample_analyses/dlint/Utils.js ' +
            // ' --analysis ' + ANALYSIS_SRC_DIR + '/node_modules/angular/angular.js' +
            appFileName +
            (commandLineArgs === undefined ? '' : ' ' + commandLineArgs);
        shell.echo('command: ' + command);
        var exitCode = shell.exec(command).code;
        assert.equal(exitCode, 0);

    };

    return {
        checkOutput: checkOutput,
        runJalangi: runJalangi,
        checkGeneratedCode: checkGeneratedCode,
        checkGeneratedGraph: checkGeneratedGraph,
        checkOutput_temp: checkOutput_temp,
        runJalangiBenchmark: runJalangiBenchmark,

        JALANGI_HOME: JALANGI_HOME,
        TOOL_HOME: TOOL_HOME,
        ANALYSIS_SRC_DIR: ANALYSIS_SRC_DIR,

    };
};

module.exports = Common();