var path = require('path');
var fs = require('fs');
var os = require('os');
var mkdirp = require('mkdirp');

var graphsPath = path.resolve('../tests-nodejs/output-actual/graphs/');
var isDirectory = fs.lstatSync(graphsPath).isDirectory();
var reportsPath = path.resolve('../tests-nodejs/output-actual/graph-vis/');

function getDirectories (source) {
    return fs.readdirSync(source).map(function (name) {
        return path.join(source, name);
    }).filter(function () {
        return isDirectory;
    });
}

function getDirectoryNames (source) {
    return fs.readdirSync(source).map(function (name) {
        return name;
    });
}

var dirNames = getDirectoryNames(graphsPath);
/*
// toplogical stats of the graph. # of nodes, etc
dirNames.forEach(function (projectName) {
    var graphFiles = fs.readdirSync(path.join(graphsPath, projectName));
    var graphStats = 'project-name: ' + projectName + os.EOL;

    var totalFunctionNodes = 0, totalValueNodes = 0;
    var totalPendingPromises = 0, totalFulfilledPromises = 0, totalRejectedPromises = 0;

    graphFiles.forEach(function (graphName) {
        if (graphName.includes('.json') && !graphName.includes('_report') && !graphName.includes('.js.json')) {
            var jsonGraph = JSON.parse(fs.readFileSync(path.join(graphsPath, projectName, graphName), 'utf8'));
            var nodes = jsonGraph.nodes;
            var valueNodes = 0, functionNodes = 0;
            var pendingPromises = 0, fulfilledPromises = 0, rejectedPromises = 0;

            nodes.forEach(function (node) {
                switch (node.type) {
                    case 'function':
                        functionNodes ++;
                        break;
                    case 'value':
                        valueNodes ++;
                        break;
                    case 'promise':
                        switch (node.fulfilled) {
                            case 'resolved':
                                fulfilledPromises ++;
                                break;
                            case 'rejected':
                                rejectedPromises ++;
                                break;
                            case 'pending':
                                pendingPromises ++;
                                break;
                            default:
                                console.log('unknown promise status <' +  node.fulfilled + '> : ' + projectName + '::' + graphName);
                        }
                        break;
                    case 'sync':
                        break;
                    default:
                        console.log('unknown node type <' +  node.type + '> : ' + projectName + '::' + graphName);
                }
            });

            graphStats = graphStats + 'test-name: ' + graphName + os.EOL;
            graphStats = graphStats + 'functions: ' + functionNodes + ', ';
            graphStats = graphStats + 'values: ' + valueNodes + ', ';
            graphStats = graphStats + 'promises: ' + (fulfilledPromises + rejectedPromises + pendingPromises) + ', ';
            graphStats = graphStats + 'fulfilled: ' + fulfilledPromises + ', ';
            graphStats = graphStats + 'rejected: ' + rejectedPromises + ', ';
            graphStats = graphStats + 'pending: ' + pendingPromises + os.EOL;

            totalValueNodes += valueNodes;
            totalFunctionNodes += functionNodes;
            totalPendingPromises += pendingPromises;
            totalFulfilledPromises += fulfilledPromises;
            totalRejectedPromises += rejectedPromises;
        }

    });
    graphStats += os.EOL;
    graphStats += 'Total:' + os.EOL;
    graphStats = graphStats + 'functions: ' + totalFunctionNodes + ', ';
    graphStats = graphStats + 'values: ' + totalValueNodes + ', ';
    graphStats = graphStats + 'promises: ' + (totalFulfilledPromises + totalRejectedPromises + totalPendingPromises) + ', ';
    graphStats = graphStats + 'fulfilled: ' + totalFulfilledPromises + ', ';
    graphStats = graphStats + 'rejected: ' + totalRejectedPromises + ', ';
    graphStats = graphStats + 'pending: ' + totalPendingPromises + os.EOL;

    mkdirp.sync(path.join(__dirname, 'graph-nodes/'));
    fs.writeFileSync(path.join('graph-nodes', projectName + '.txt'), graphStats);
});


// stats on number of anti-patterns
dirNames.forEach(function (projectName) {
    var reportFiles = fs.readdirSync(path.join(reportsPath, projectName));
    var antiPatternStats = 'project-name: ' + projectName + os.EOL;

    var totalDeadPromises = 0, totalUndefinedValues = 0, totalUndefinedValuesRefined = 0;
    var totalMissingRejects = 0, totalMissingRejectsInChain = 0, totalMultipleThens = 0;
    var totalDoubleSettles = 0, totalPendingPromises = 0, totalPendingSyncNodes = 0, totalDeadCode = 0;
    var totalRejectedWithoutAReaction = 0, totalNumOfExclusivelyExecutedReactions = 0;

    reportFiles.forEach(function (reportName) {
        if (reportName.includes('_report.json')) {
            console.log(reportName);
            var jsonReport = JSON.parse(fs.readFileSync(path.join(reportsPath, projectName, reportName), 'utf8'));

            // warning nodes
            totalDeadPromises += jsonReport.numOfDeadPromise;
            totalUndefinedValues += jsonReport.numOfUndefinedValue;
            totalUndefinedValuesRefined += jsonReport.numOfUndefinedValuesRefined;
            totalMissingRejects += jsonReport.numOfMissingReject;
            totalMissingRejectsInChain += jsonReport.numOfmissingRejectInChain;
            totalMultipleThens += jsonReport.numOfMultipleThens;
            totalRejectedWithoutAReaction += jsonReport.numOfRejectedWithoutAReaction;
            totalNumOfExclusivelyExecutedReactions += jsonReport.numOfExclusivelyExecutedReactions;

            // inline warnings
            totalDoubleSettles += jsonReport.numOfDoubleSettles;
            totalPendingPromises += jsonReport.numOfPendingPromises;
            totalPendingSyncNodes += jsonReport.numOfPendingSyncNodes;
            totalDeadCode += jsonReport.numOfDeadCode;

            // console.log(totalDoubleSettles + ', ' + totalPendingPromises + ', ' + totalPendingSyncNodes + ', ' + totalDeadCode);
            // console.log(jsonReport.numOfDoubleSettles);
            // console.log(jsonReport.numOfPendingPromises);
            // console.log(jsonReport.numOfPendingSyncNodes);
            // console.log(jsonReport.numOfDeadCode);
        }

    });
    antiPatternStats += os.EOL;
    antiPatternStats = antiPatternStats + 'numOfDeadPromise: ' + totalDeadPromises + ', ';
    antiPatternStats = antiPatternStats + 'numOfUndefinedValue: ' + totalUndefinedValues + ', ';
    antiPatternStats = antiPatternStats + 'numOfUndefinedValuesRefined: ' + totalUndefinedValuesRefined + ', ';
    antiPatternStats = antiPatternStats + 'numOfMissingReject: ' + totalMissingRejects + ', ';
    antiPatternStats = antiPatternStats + 'numOfmissingRejectInChain: ' + totalMissingRejectsInChain + ', ';
    antiPatternStats = antiPatternStats + 'numOfMultipleThens: ' + totalMultipleThens + ', ';
    antiPatternStats = antiPatternStats + 'numOfRejectedWithoutAReaction: ' + totalRejectedWithoutAReaction + ', ';
    antiPatternStats = antiPatternStats + 'numOfExclusivelyExecutedReactions: ' + totalNumOfExclusivelyExecutedReactions + ', ';

    antiPatternStats = antiPatternStats + 'numOfDoubleSettles: ' + totalDoubleSettles + ', ';
    antiPatternStats = antiPatternStats + 'numOfPendingPromises: ' + totalPendingPromises + ', ';
    antiPatternStats = antiPatternStats + 'numOfPendingSyncNodes: ' + totalPendingSyncNodes + ', ';
    antiPatternStats = antiPatternStats + 'numOfDeadCode: ' + totalDeadCode;

    // console.log(totalDoubleSettles + ', ' + totalPendingPromises + ', ' + totalPendingSyncNodes + ', ' + totalDeadCode);

    mkdirp.sync(path.join(__dirname, 'anti-patterns/'));
    fs.writeFileSync(path.join('anti-patterns', projectName + '.txt'), antiPatternStats);
});
*/

// measure number of missing function returns resolving promises
var expectedGraphsPath = path.resolve('../tests-nodejs/output-expected/graphs/');
var expectedDirNames = getDirectoryNames(expectedGraphsPath);

expectedDirNames.forEach(function (projectName) {
    var graphFiles = fs.readdirSync(path.join(graphsPath, projectName));
    var numOfMissingReturnsInProject = 0;
    var numOfBenignMissingReturnsInProject = 0;
    var missingReturns = '';

    graphFiles.forEach(function (graphName) {
        if (graphName.includes('.json') && !graphName.includes('_report') && !graphName.includes('.js.json') && !graphName.includes('performance.json')) {
            var jsonGraph = JSON.parse(fs.readFileSync(path.join(graphsPath, projectName, graphName), 'utf8'));
            var nodes = jsonGraph.nodes;
            var edges = jsonGraph.edges;

            var edgesBySourceIdMap = {};
            edges.forEach(function (e) {
                edgesBySourceIdMap[e.source] = e;
            });

            var numOfMissingReturnsInFile = 0;
            var numOfBenignMissingReturnsInFile = 0;
            edges.forEach(function (edge) {
                if (edge.type === 'react' && edge.label === 'resolve') {
                    if (typeof edge.data !== 'undefined' && edge.data.explicit === "no") {
                        numOfMissingReturnsInFile ++;
                        var targetNode = nodes[edge.target];
                        missingReturns += ('\#' + edge.source + ' [undefined value] >> \#' + edge.target + ' [fulfilled promise ' + targetNode.data.id + ']' + os.EOL);

                        if (typeof edgesBySourceIdMap[edge.target] === 'undefined') {
                            numOfBenignMissingReturnsInFile ++;
                        }
                    }
                }
            });
            numOfMissingReturnsInProject += numOfMissingReturnsInFile;
            numOfBenignMissingReturnsInProject += numOfBenignMissingReturnsInFile;
        }
    });

    var projectInfo = 'Project <' + projectName + '> contains <' + numOfMissingReturnsInProject + '> missing returns' + os.EOL;
    if (numOfMissingReturnsInProject > 0) {
        projectInfo += ('<' + (numOfMissingReturnsInProject - numOfBenignMissingReturnsInProject) + '> missing returns after refinement' + os.EOL);
        projectInfo += missingReturns;
        projectInfo += os.EOL;
    }
    console.log('** ' + projectName + ' **');
    console.log(projectInfo);
    console.log('\n\n');
    // mkdirp.sync(path.join(__dirname, 'anti-patterns/'));
    // fs.writeFileSync(path.join('anti-patterns', projectName + '_missingReturns.txt'), projectInfo);
});

/*
expectedDirNames.forEach(function (projectName) {
    var graphFiles = fs.readdirSync(path.join(graphsPath, projectName));

    var projectUnnecessaryPromises = 0;
    graphFiles.forEach(function (graphName) {
        if (graphName.includes('.json') && !graphName.includes('_report') && !graphName.includes('.js.json') && !graphName.includes('performance.json')) {
            var jsonGraph = JSON.parse(fs.readFileSync(path.join(graphsPath, projectName, graphName), 'utf8'));
            var nodes = jsonGraph.nodes;
            var edges = jsonGraph.edges;

            var edgesBySourceIdMap = {};
            var edgesByTargetIdMap = {};
            edges.forEach(function (e) {
                edgesBySourceIdMap[e.source] = e;
                edgesByTargetIdMap[e.target] = e;
            });

            var numOfUnnecessaryPromises = 0;
            edges.forEach(function (edge) {
                if (edge.type === 'link') {
                    var linkSource = nodes[edge.source];
                    if (linkSource.type === 'promise') {
                        var promiseIncomingEdge = edgesByTargetIdMap[linkSource.id];
                        if (typeof promiseIncomingEdge !== 'undefined' && promiseIncomingEdge.type === "react") {
                            var reactSource = nodes[promiseIncomingEdge.source];
                            if (reactSource.type === "value") {
                                var valueIncomingEdge = edgesByTargetIdMap[reactSource.id];
                                // console.log('==========');
                                // console.log(valueIncomingEdge);
                                numOfUnnecessaryPromises ++;
                            }
                        }
                    }
                }
            });
            projectUnnecessaryPromises += numOfUnnecessaryPromises;
        }
    });
    console.log(projectName + ' -- ' + projectUnnecessaryPromises);
});
*/
