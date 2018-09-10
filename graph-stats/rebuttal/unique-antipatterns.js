var path = require('path');
var fs = require('fs');
var os = require('os');
var mkdirp = require('mkdirp');

var graphsPath = path.resolve('../../tests-nodejs/output-actual/graphs/');
// var isDirectory = fs.lstatSync(graphsPath).isDirectory();
var reportsPath = path.resolve('../../tests-nodejs/output-actual/graph-vis/');

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


dirNames.forEach(function (projectName) {
    if (projectName.includes('.DS_Store'))
        return;

    console.log();
    console.log('PROJECT <<< ' + projectName + ' >>>')

    var reportFiles = fs.readdirSync(path.join(reportsPath, projectName));
    // var graphFiles = fs.readdirSync(path.join(graphsPath, projectName));
    // var graphStats = 'project-name: ' + projectName + os.EOL;

    // by LOC's
    var unsettledPromises = {}, missingRejectBefore = {}, missingRejectAfter = {};
    var brokenChainBefore = {}, brokenChainAfter = {}, multipleSettle = {};
    var unreachableReactionBefore = {}, unreachableReactionAfter = {}, unnecessaryPromise = {};
    var unreachableReactionBefore_old = [], unreachableReactionAfter_old = [];
    var numOfUnreachableReactionBefore_old = 0, numOfUnreachableReactionAfter_old = 0;
    var numOfUnnecessaryPromises = 0;

    reportFiles.forEach(function (reportName) {
        // deadPromise, undefinedValue, undefinedValuesRefined, missingReject, deadCode,
        // missingRejectInChain, rejectedWithoutAReaction, doubleSettles, pendingPromises
        if (reportName.includes('_report.json')) {
            var jsonReport = JSON.parse(fs.readFileSync(path.join(reportsPath, projectName, reportName), 'utf8'));
            var graphPath = path.resolve(graphsPath, projectName, reportName.split('_report')[0] + '.json');
            var jsonGraph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
            var nodes = jsonGraph.nodes;
            var edges = jsonGraph.edges;

            if (nodes.length === 0) {
                // console.log('>>> empty graph');
                return;
            }

            var nodesById = {};
            for (var i = 0; i < nodes.length; i ++) {
                nodesById[nodes[i].id] = nodes[i];
            }


            // unsettled promises
            for (i = 0; i < jsonReport.deadPromise.length; i ++) {
                var node = nodesById[jsonReport.deadPromise[i]];
                if (typeof unsettledPromises[node.loc] !== 'undefined' && typeof unsettledPromises[node.loc] === 'number') {
                    unsettledPromises[node.loc] ++;
                }
                else {
                    unsettledPromises[node.loc] = 1;
                }
            }

            // missing reject before
            for (i = 0; i < jsonReport.missingReject.length; i ++) {
                node = nodesById[jsonReport.missingReject[i]];
                if (typeof missingRejectBefore[node.loc] !== 'undefined' && typeof missingRejectBefore[node.loc] === 'number') {
                    missingRejectBefore[node.loc] ++;
                }
                else {
                    missingRejectBefore[node.loc] = 1;
                }
            }

            // missing reject after
            for (i = 0; i < jsonReport.missingRejectInChain.length; i ++) {
                node = nodesById[jsonReport.missingRejectInChain[i]];
                if (typeof missingRejectAfter[node.loc] !== 'undefined' && typeof missingRejectAfter[node.loc] === 'number') {
                    missingRejectAfter[node.loc] ++;
                }
                else {
                    missingRejectAfter[node.loc] = 1;
                }
            }

            // TODO oooooooo old numbers include values and stuff
            // unreachable reaction before
            /*
            for (i = 0; i < jsonReport.deadCode.length; i ++) {
                node = nodesById[jsonReport.deadCode[i]];
                if (typeof unreachableReactionBefore[node.loc] !== 'undefined' && typeof unreachableReactionBefore[node.loc] === 'number') {
                    unreachableReactionBefore[node.loc] ++;
                }
                else {
                    unreachableReactionBefore[node.loc] = 1;
                }
            }
*/

            var unexecutedFunctions = [];
            var unexecutedFunctionsRefined = [];
            var unexecutedFunctionsById = {};
            var unexecutedFunctionsRefinedById = {};

            var edgesBySource = {};
            var edgesByTarget = {};
            edges.forEach(function (e) {
                if (typeof edgesBySource[e.source] === 'undefined') {
                    edgesBySource[e.source] = [];
                }
                edgesBySource[e.source].push(e);
                if (typeof edgesByTarget[e.target] === 'undefined') {
                    edgesByTarget[e.target] = [];
                }
                edgesByTarget[e.target].push(e);
            });

            for (var e in edgesBySource) {
                if (edgesBySource[e].length > 1) {
                    var n = nodesById[e];
                    if (n.type === 'promise') {
                        var onResolveEdgesByTime = {};
                        var onRejectEdgesByTime = {};
                        for (var j = 0; j < edgesBySource[e].length; j ++) {
                            // console.log(edgesBySource[e][j].type);
                            var currEdge = edgesBySource[e][j];
                            if (currEdge.type === 'register') {
                                if (currEdge.label === 'on-resolve') {
                                    onResolveEdgesByTime[currEdge.timeStamp] = currEdge;
                                }
                                else if (currEdge.label === 'on-reject') {
                                    onRejectEdgesByTime[currEdge.timeStamp] = currEdge;
                                }
                            }
                            for (var resolveEdgeTime in onResolveEdgesByTime) {
                                var resolveEdge = onResolveEdgesByTime[resolveEdgeTime];
                                var resolveNode = nodesById[resolveEdge.target];

                                var rejectNode = onRejectEdgesByTime[resolveEdgeTime];
                                if (typeof rejectNode !== 'undefined' && rejectNode.type === 'function') {
                                    if (resolveNode.data.executed === false && rejectNode.data.executed === false) {
                                        unexecutedFunctionsById[resolveNode.id] = resolveNode;
                                        unexecutedFunctionsById[rejectNode.id] = rejectNode;

                                        unexecutedFunctions.push(resolveNode);
                                        unexecutedFunctions.push(rejectNode);

                                        unexecutedFunctionsRefinedById[resolveNode.id] = resolveNode;
                                        unexecutedFunctionsRefinedById[rejectNode.id] = rejectNode;

                                        unexecutedFunctionsRefined.push(resolveNode);
                                        unexecutedFunctionsRefined.push(rejectNode);
                                    }
                                    else if (resolveNode.data.executed === false && rejectNode.data.executed === true) {
                                        unexecutedFunctionsById[resolveNode.id] = resolveNode;
                                        unexecutedFunctions.push(resolveNode);

                                        console.log('xxxxxx 1');
                                    }
                                    else if (resolveNode.data.executed === true && rejectNode.data.executed === false) {
                                        unexecutedFunctionsById[rejectNode.id] = rejectNode;
                                        unexecutedFunctions.push(rejectNode);

                                        console.log('xxxxxx 2');
                                    }
                                }
                                else {
                                    if (resolveNode.data.executed === false) {
                                        unexecutedFunctionsById[resolveNode.id] = resolveNode;
                                        unexecutedFunctionsRefinedById[resolveNode.id] = resolveNode;

                                        unexecutedFunctions.push(resolveNode);
                                        unexecutedFunctionsRefined.push(resolveNode);
                                    }
                                }

                            }
                        }
                    }
                }
            }

            // TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            // unexecutedFunctions and unexecutedFunctionsRefined ==>> to replace old number in the paper
            /*
            console.log('+++++');
            console.log(unexecutedFunctions);
            console.log('xxxxx');
            console.log(unexecutedFunctionsById);
            unreachableReactionBefore_old.concat(unexecutedFunctions);
            console.log('oooooooooooooo ' + unexecutedFunctions.length + ' ooo ' + unreachableReactionBefore_old.length);
            unreachableReactionAfter_old.concat(unexecutedFunctionsRefined);
*/
            numOfUnreachableReactionBefore_old += unexecutedFunctions.length;
            numOfUnreachableReactionAfter_old += unexecutedFunctionsRefined.length;

            // console.log(nodesById);
            // console.log('=======');

            for (var uf in unexecutedFunctionsById) {
                node = unexecutedFunctionsById[uf];
                if (typeof unreachableReactionBefore[node.loc] !== 'undefined' && typeof unreachableReactionBefore[node.loc] === 'number') {
                    unreachableReactionBefore[node.loc] ++;
                }
                else {
                    unreachableReactionBefore[node.loc] = 1;
                }
            }

            for (var ufr in unexecutedFunctionsRefinedById) {
                node = unexecutedFunctionsRefinedById[ufr];
                if (typeof unreachableReactionAfter[node.loc] !== 'undefined' && typeof unreachableReactionAfter[node.loc] === 'number') {
                    unreachableReactionAfter[node.loc] ++;
                }
                else {
                    unreachableReactionAfter[node.loc] = 1;
                }
            }
            // TODO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


            // if (unexecutedFunctions.length > 0)
            //     console.log(unexecutedFunctions.length + ' -- ' + Object.keys(unexecutedFunctionsRefinedById).length);


            // console.log(/*Object.keys(unexecutedFunctionsById).length*/ unexecutedFunctions.length + ' -- ' + Object.keys(unreachableReactionBefore).length);

/*
            var temp = [];
            for (var nn in unreachableReactionBefore) {
                // console.log(unreachableReactionBefore[nn] + ' -- ' + nodesById[unreachableReactionBefore[nn]]);

                if (typeof nodesById[unreachableReactionBefore[nn]] !== 'undefined')
                    if (nodesById[unreachableReactionBefore[nn]].type === 'function') {
                        temp.push(unreachableReactionBefore[nn]);
                    }

            }
*/
/******
            console.log('===========');
            console.log(unexecutedFunctions.length + ' -- ' + temp.length);
            // console.log(unexecutedFunctions.length + ' -- ' + Object.keys(unreachableReactionBefore).length);
            console.log(Object.keys(unexecutedFunctionsById).length + ' -- ' + Object.keys(unreachableReactionBefore).length);
******/

            /*
            for (var m in unreachableReactionBefore) {
                console.log(unreachableReactionBefore[m]);
                console.log(nodesById[unreachableReactionBefore[m]].type);
            }
*/

            // todo unreachable reaction after
            // only have the number now: numOfExclusivelyExecutedReactions
            // total after = dead code - exclusively executed
            // console.log(jsonReport.numOfExclusivelyExecutedReactions);
            // TODO number undefined for many









            // multiple settle
            for (i = 0; i < jsonReport.doubleSettles.length; i ++) {
                node = nodesById[jsonReport.doubleSettles[i]];
                if (typeof multipleSettle[node.loc] !== 'undefined' && typeof multipleSettle[node.loc] === 'number') {
                    multipleSettle[node.loc] ++;
                }
                else {
                    multipleSettle[node.loc] = 1;
                }
            }


            var edgesBySourceIdMap = {};
            var edgesByTargetIdMap = {};
            edges.forEach(function (e) {
                edgesBySourceIdMap[e.source] = e;
                edgesByTargetIdMap[e.target] = e;
            });

            // unnecessary promise
            edges.forEach(function (edge) {
                if (edge.type === 'link') {
                    var linkSource = nodes[edge.source];
                    if (linkSource.type === 'promise') {
                        var promiseIncomingEdge = edgesByTargetIdMap[linkSource.id];
                        if (typeof promiseIncomingEdge !== 'undefined' && promiseIncomingEdge.type === "react") {
                            var reactSource = nodes[promiseIncomingEdge.source];
                            if (reactSource.type === "value") {
                                var valueIncomingEdge = edgesByTargetIdMap[reactSource.id];
                                numOfUnnecessaryPromises ++;

                                if (typeof unnecessaryPromise[linkSource.loc] !== 'undefined' && typeof unnecessaryPromise[linkSource.loc] === 'number') {
                                    unnecessaryPromise[linkSource.loc] ++;
                                }
                                else {
                                    unnecessaryPromise[linkSource.loc] = 1;
                                }
                            }
                        }
                    }
                }
            });

            // broken chain before
            // and broken chain after

            var numOfMissingReturnsInFile = 0;
            var numOfBenignMissingReturnsInFile = 0;
            edges.forEach(function (edge) {
                if (edge.type === 'react' && edge.label === 'resolve') {
                    if (typeof edge.data !== 'undefined' && edge.data.explicit === "no") {
                        numOfMissingReturnsInFile ++;
                        var targetNode = nodes[edge.target];
                        // missingReturns += ('\#' + edge.source + ' [undefined value] >> \#' + edge.target + ' [fulfilled promise ' + targetNode.data.id + ']' + os.EOL);
                        if (typeof brokenChainBefore[targetNode.loc] !== 'undefined' && typeof brokenChainBefore[targetNode.loc] === 'number') {
                            brokenChainBefore[targetNode.loc] ++;
                        }
                        else {
                            brokenChainBefore[targetNode.loc] = 1;
                        }

                        if (typeof edgesBySourceIdMap[edge.target] !== 'undefined') {
                            // numOfBenignMissingReturnsInFile ++;
                            if (typeof brokenChainAfter[targetNode.loc] !== 'undefined' && typeof brokenChainAfter[targetNode.loc] === 'number') {
                                brokenChainAfter[targetNode.loc] ++;
                            }
                            else {
                                brokenChainAfter[targetNode.loc] = 1;
                            }
                        }
                    }
                }
            });

            if (Object.keys(brokenChainBefore).length > 0) {
                // console.log(Object.keys(brokenChainBefore).length + ' -- ' + Object.keys(brokenChainAfter).length)
            }

        }
    });

    console.log({
       'unsettledPromises': Object.keys(unsettledPromises).length,
       'missingRejectBefore': Object.keys(missingRejectBefore).length,
        'missingRejectAfter': Object.keys(missingRejectAfter).length,
        'brokenChainBefore': Object.keys(brokenChainBefore).length,
        'brokenChainAfter': Object.keys(brokenChainAfter).length,
        'multipleSettle': Object.keys(multipleSettle).length,
        'unreachableReactionBefore': Object.keys(unreachableReactionBefore).length,
        'unreachableReactionAfter': Object.keys(unreachableReactionAfter).length,
        'unnecessaryPromise': Object.keys(unnecessaryPromise).length,
        'unnecessaryPromiseTotal__': numOfUnnecessaryPromises,
        'unreachableReactionBefore_old': numOfUnreachableReactionBefore_old, //unreachableReactionBefore_old.length,
        'unreachableReactionAfter_old': numOfUnreachableReactionAfter_old //unreachableReactionAfter_old.length
    });

});

console.log('\n==========================================================\n');

// stats on total number of anti-patterns (including redundant ones)
dirNames.forEach(function (projectName) {
    if (projectName.includes('.DS_Store'))
        return;

    console.log('\n\n');

    var reportFiles = fs.readdirSync(path.join(reportsPath, projectName));
    // var antiPatternStats = 'project-name: ' + projectName + os.EOL;

    var totalDeadPromises = 0, totalUndefinedValues = 0, totalUndefinedValuesRefined = 0;
    var totalMissingRejects = 0, totalMissingRejectsInChain = 0, totalMultipleThens = 0;
    var totalDoubleSettles = 0, totalPendingPromises = 0, totalPendingSyncNodes = 0, totalDeadCode = 0;
    var totalRejectedWithoutAReaction = 0, totalNumOfExclusivelyExecutedReactions = 0;

    var unsettledPromises = [], missingRejectBefore = [], missingRejectAfter = [];
    var brokenChainBefore = [], brokenChainAfter = [], multipleSettle = [];
    var unreachableReactionBefore = [], unreachableReactionAfter = [], unnecessaryPromise = [];


    reportFiles.forEach(function (reportName) {
        if (reportName.includes('_report.json')) {
            // console.log(reportName);
            var jsonReport = JSON.parse(fs.readFileSync(path.join(reportsPath, projectName, reportName), 'utf8'));

            // warning nodes
            totalDeadPromises += jsonReport.numOfDeadPromise;
            totalUndefinedValues += jsonReport.numOfUndefinedValue;
            totalUndefinedValuesRefined += jsonReport.numOfUndefinedValuesRefined;
            totalMissingRejects += jsonReport.numOfMissingReject;
            totalMissingRejectsInChain += jsonReport.numOfmissingRejectInChain;
            totalMultipleThens += jsonReport.numOfMultipleThens;
            totalRejectedWithoutAReaction += jsonReport.numOfRejectedWithoutAReaction;
            // totalNumOfExclusivelyExecutedReactions += jsonReport.numOfExclusivelyExecutedReactions;

            // inline warnings
            totalDoubleSettles += jsonReport.numOfDoubleSettles;
            totalPendingPromises += jsonReport.numOfPendingPromises;
            totalPendingSyncNodes += jsonReport.numOfPendingSyncNodes;
            totalDeadCode += jsonReport.numOfDeadCode;
        }

    });

    console.log('*** ' + projectName + ' ***');
    console.log({
        'numOfDeadPromise': totalDeadPromises,
        'totalUndefinedValues': totalUndefinedValues,
        'totalUndefinedValuesRefined': totalUndefinedValuesRefined,
        'totalMissingRejects': totalMissingRejects,
        'totalMissingRejectsInChain': totalMissingRejectsInChain,
        'totalRejectedWithoutAReaction': totalRejectedWithoutAReaction,
        'totalDoubleSettles': totalDoubleSettles,
        'totalPendingPromises': totalPendingPromises,
        'totalDeadCode': totalDeadCode
    });
    console.log();
    /*
    antiPatternStats += os.EOL;
    antiPatternStats = antiPatternStats + 'numOfDeadPromise: ' + totalDeadPromises + ', ';
    antiPatternStats = antiPatternStats + 'numOfUndefinedValue: ' + totalUndefinedValues + ', ';
    antiPatternStats = antiPatternStats + 'numOfUndefinedValuesRefined: ' + totalUndefinedValuesRefined + ', ';
    antiPatternStats = antiPatternStats + 'numOfMissingReject: ' + totalMissingRejects + ', ';
    antiPatternStats = antiPatternStats + 'numOfmissingRejectInChain: ' + totalMissingRejectsInChain + ', ';
    antiPatternStats = antiPatternStats + 'numOfMultipleThens: ' + totalMultipleThens + ', ';
    antiPatternStats = antiPatternStats + 'numOfRejectedWithoutAReaction: ' + totalRejectedWithoutAReaction + ', ';
    antiPatternStats = antiPatternStats + 'TODO numOfExclusivelyExecutedReactions: ' + totalNumOfExclusivelyExecutedReactions + ', ';

    antiPatternStats = antiPatternStats + 'numOfDoubleSettles: ' + totalDoubleSettles + ', ';
    antiPatternStats = antiPatternStats + 'numOfPendingPromises: ' + totalPendingPromises + ', ';
    antiPatternStats = antiPatternStats + 'numOfPendingSyncNodes: ' + totalPendingSyncNodes + ', ';
    antiPatternStats = antiPatternStats + 'numOfDeadCode: ' + totalDeadCode;

    console.log(antiPatternStats);
    */
});


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
// var expectedDirNames = getDirectoryNames(expectedGraphsPath);
/*
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
    mkdirp.sync(path.join(__dirname, 'anti-patterns/'));
    fs.writeFileSync(path.join('anti-patterns', projectName + '_missingReturns.txt'), projectInfo);
});
*/
/*
// expectedDirNames.forEach(function (projectName) {
var serialPortPath = '/Users/saba/Documents/northeastern/research/promises/Promises/tests-nodejs/output-expected/graph-vis/node-serialport';
var graphFiles = fs.readdirSync(serialPortPath);
var projectName = 'node-serialport';
var allDeadPromises = [];
var sumOfDeadPromises = 0;
var numOfTests = 0;
graphFiles.forEach(function (graphName) {
    // console.log('>>>' + graphName);

    if (graphName.includes('_report.json')) {
        var jsonReport = JSON.parse(fs.readFileSync(path.join(serialPortPath, graphName), 'utf8'));
        // console.log(jsonReport.numOfDeadPromise);
        // console.log(jsonReport.deadPromise);
        allDeadPromises.push(jsonReport.deadPromise);
        // console.log('________________________________________________________');
        sumOfDeadPromises += jsonReport.numOfDeadPromise;
        numOfTests ++;
    }
});

console.log('AVERAGE NUM OF DEAD PROMISES: ' + sumOfDeadPromises/numOfTests);

var deadPromisesById = {};
for (var i = 0; i < allDeadPromises.length; i ++) {
    for (var j = 0; j < allDeadPromises[i].length; j ++) {
        deadPromisesById[allDeadPromises[i][j]] = 1;
    }
}
console.log('====================================================');
console.log(deadPromisesById);
console.log(Object.keys(deadPromisesById).length);
*/