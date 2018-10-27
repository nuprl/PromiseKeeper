var fs = require('fs');
var path = require('path');
var Node = require('./node');
var Edge = require('./edge');
var graphVis = require('./vis/graphVis');
var PromiseLogger = require('../logger');
var logger = new PromiseLogger('');
var GraphAnalysis = require('./graph-analysis');
var mkdirp = require('mkdirp');

/**
 * Class representing a promise graph.
 * Nodes of the graph can be promises, functions, or values. Edges are directed.
 * @param label - Label used for visualizing the graph.
 * @constructor
 */
function PromisesGraph (label) {
    this.metaData = {};
    this.label = label;
    this.promises = {};
    this.functions = {}; // map of functions by fID
    this.nodes = [];
    this.edges = [];
    this.uniqueNodeId = -1;
    this.uniqueEdgeId = -1;
    this.firstScriptOfExecution = true;

    this.FULFILLED = Object.freeze({
        RESOLVED: 'resolved',
        REJECTED: 'rejected',
        PENDING: 'pending',
        NA: 'n/a'
    });
}

/**
 * Assigns a unique ID to each new node.
 * @returns {number|*}
 */
PromisesGraph.prototype.assignNodeId = function () {
    this.uniqueNodeId ++;
    return this.uniqueNodeId;
};

/**
 * Assigns a unique ID to each new edge.
 * @returns {number|*}
 */
PromisesGraph.prototype.assignEdgeId = function () {
    this.uniqueEdgeId ++;
    return this.uniqueEdgeId;
};

/**
 * Finds the node representing a function based on the function ID.
 * @param objId
 * @returns {boolean}
 */
PromisesGraph.prototype.findFunctionNode = function (objId) {
    var val = false;

    this.nodes.forEach(function(node) {
        if (node.type === "function" && node.data.fID === objId){
            val = node;
        }
    });

    return val;
};

/**
 * Finds the node representing a promise based on the promise ID.
 * @param pId
 * @returns {Array}
 */
PromisesGraph.prototype.findPromiseNode = function (pId) {
    var val = [];

    this.nodes.forEach(function(node) {
        if (node.type === "promise" && node.data.id === pId){
            val = [node.id, node.timeStamp, node.loc];
        }
    });

    return val;
};

/**
 * Finds if the edge is a default edge, and whether it's throw or return
 * @param isThrow
 * @param funcName
 * @returns {string}
 */
PromisesGraph.prototype.findEdgeType = function (isThrow, funcName){
    var edgeType = funcName === "_default" ? (isThrow ? "default throw" :"default return") : (isThrow ? "throw" : "return");
    return edgeType;
};

/**
 * Imports graph into memory in JSON format, from a log file
 * @param jsonGraph
 * @returns {{nodes: Array, edges: Array}}
 */
PromisesGraph.prototype.importGraph = function (jsonGraph) {
    var nodes = [], edges = [];

    var rawNodes = jsonGraph['nodes'];
    var nodeId;
    for (var n in rawNodes) {
        nodeId = rawNodes[n].id;
        nodes[nodeId] = new Node(nodeId, rawNodes[n].type, rawNodes[n].timeStamp, rawNodes[n].loc, rawNodes[n].data, rawNodes[n].fulfilled);
    }

    var rawEdges = jsonGraph['edges'];
    for (var e in rawEdges) {
        var edge = new Edge(rawEdges[e].id, rawEdges[e].type, rawEdges[e].source, rawEdges[e].target, rawEdges[e].timeStamp,
            rawEdges[e].loc, rawEdges[e].label, rawEdges[e].data);
        edges.push(edge);
        nodeId = edge.source;
        var sourceNode = nodes[nodeId];
        sourceNode.addEdge(edge);
        var targetNode = nodes[edge.target];
        targetNode.addIncomingEdge(edge);
    }

    return {
        "nodes": nodes,
        "edges": edges
    };
};

/**
 * Invokes the function responsible for drawing the graph from the vis package
 * @param visGraph
 * @param outputFileName
 * @param outputFileExt
 * @param warningNodes
 */
PromisesGraph.prototype.drawGraph = function (visGraph, outputFileName, outputFileExt, warningNodes) {
    return graphVis.drawGraph(visGraph, outputFileName, outputFileExt, warningNodes);
};

/**
 * Creates the promise nodes of the graph
 * @param promiseId
 * @param logTime
 * @param logLoc
 */
PromisesGraph.prototype.createPromiseNode = function (promiseId, logTime, logLoc) {
    var newPromise = new Node(this.assignNodeId(), 'promise', logTime, logLoc, {id: promiseId}, this.FULFILLED.PENDING);
    this.promises[promiseId] = newPromise;
    this.nodes.push(newPromise);
};

/**
 * Creates the resolve edges of the graph
 * @param logEntry
 */
PromisesGraph.prototype.createResolveEdge = function (logEntry) {
    var promiseId = logEntry.pID; // for adding the edge to the promise
    var promise = this.promises[promiseId];
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;

    var multipleSettle = false;
    if (promise.fulfilled !== 'pending') {
        console.log('WARNING: promise already fulfilled');
        multipleSettle = true;
    }
    else {
        promise.fulfilled = this.FULFILLED.RESOLVED;
    }
    promise.data['fulfillCounter'] = logEntry.fulfillCounter;

    if (typeof logEntry.fID !== 'undefined' && typeof this.functions[logEntry.fID] !== 'undefined') {
        this.functions[logEntry.fID].data.executed = true;
    }

    var nodeData = {
        value: logEntry.returnVal,
        id: logEntry.returnValId
    };

    var edgeData = {
        explicit: logEntry.explicit,
        doubleSettle: multipleSettle
    };

    var returnValue;

    if (logEntry.returnVal === 'Promise') {
        returnValue = this.resolveEdgeIsLinking(logEntry, promise, logTime, logLoc, edgeData);
    }
    else {
        returnValue = this.resolveEdgeNotLinking(logEntry, promise, logTime, logLoc, edgeData, nodeData);
    }

    var fun = this.findFunctionNode(logEntry.fID);
    if (fun) {
        var edgeType = this.findEdgeType(logEntry.isThrow, fun.data.name);
        var newEdgeFun = new Edge(this.assignEdgeId(), 'return', fun.id, returnValue, fun.timeStamp, fun.loc, edgeType, {});
        this.edges.push(newEdgeFun);
    }
};

/**
 * handles the case when the resolve edge is linked to a promise
 * @param logEntry
 * @param promise
 * @param logTime
 * @param logLoc
 * @param edgeData
 * @returns returnValue
 */
PromisesGraph.prototype.resolveEdgeIsLinking = function (logEntry, promise, logTime, logLoc, edgeData) {
    var returnValue;
    var linkedProm = this.findPromiseNode(logEntry.returnValId);
    if (linkedProm.length !== 3) {
        var promiseData = {
            id: logEntry.returnValId
        };
        var newValue = new Node(this.assignNodeId(), 'promise', logTime, logLoc, promiseData, promise.fulfilled);
        returnValue = newValue.id;
        var newEdge = new Edge(this.assignEdgeId(), 'link', newValue.id, promise.id, logTime, logLoc, 'link', edgeData);
        this.edges.push(newEdge);
        this.nodes.push(newValue);
    }
    else {
        returnValue = linkedProm[0];
        var newEdge = new Edge(this.assignEdgeId(), 'link', returnValue, promise.id, logTime, logLoc, 'link', edgeData);
        this.edges.push(newEdge);
    }

    return returnValue;
};

/**
 * handles all other cases of resolve edge that's not linking
 * @param logEntry
 * @param promise
 * @param logTime
 * @param logLoc
 * @param edgeData
 * @param nodeData
 * @returns returnValue
 */
PromisesGraph.prototype.resolveEdgeNotLinking = function (logEntry, promise, logTime, logLoc, edgeData, nodeData) {
    var newValue = new Node(this.assignNodeId(), 'value', logTime, logLoc, nodeData, this.FULFILLED.NA);
    var returnValue = newValue.id;
    var newEdge = new Edge(this.assignEdgeId(), 'react', newValue.id, promise.id, logTime, logLoc, 'resolve', edgeData);

    this.edges.push(newEdge);
    this.nodes.push(newValue);

    return returnValue;
};

/**
 * Invokes the function responsible for drawing the graph from the vis package
 * @param logEntry
 */
PromisesGraph.prototype.createRejectEdge = function (logEntry) {
    var promiseId = logEntry.pID;
    var promise = this.promises[promiseId];
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;

    var multipleSettle = false;
    if (promise.fulfilled !== 'pending') {
        console.log('WARNING: promise already fulfilled');
        multipleSettle = true;
    }
    else {
        promise.fulfilled = this.FULFILLED.REJECTED;
    }
    promise.data['fulfillCounter'] = logEntry.fulfillCounter;

    if (typeof logEntry.fID !== 'undefined' && typeof this.functions[logEntry.fID] !== 'undefined') {
        this.functions[logEntry.fID].data.executed = true;
    }

    var nodeData = {
        value: logEntry.returnVal,
        id: logEntry.returnValId
    };

    var edgeData = {
        explicit: logEntry.explicit,
        doubleSettle: multipleSettle
    };

    var returnValue;
    if (logEntry.returnVal === 'Promise') {
        returnValue = this.rejectEdgeIsLinking(logEntry, promise, logTime, logLoc, edgeData);
    }
    else {
        returnValue = this.rejectEdgeNotLinking(logEntry, promise, logTime, logLoc, edgeData, nodeData);
    }

    var fun = this.findFunctionNode(logEntry.fID);
    if (fun) {
        var edgeType = this.findEdgeType(logEntry.isThrow, fun.data.name);
        var newEdgeFun = new Edge(this.assignEdgeId(), 'return', fun.id, returnValue, fun.timeStamp, fun.loc, edgeType, {});
        this.edges.push(newEdgeFun);
    }
};

/**
 * Handles the case when the reject edge is linking to another promise
 * @param logEntry
 * @param promise
 * @param logTime
 * @param logLoc
 * @param edgeData
 * @returns returnValue
 */
PromisesGraph.prototype.rejectEdgeIsLinking = function (logEntry, promise, logTime, logLoc, edgeData) {
    var returnValue;

    var linkedProm = this.findPromiseNode(logEntry.returnValId);
    if (linkedProm.length !== 3) {
        var promiseData = {
            id: logEntry.returnValId
        };

        var newValue = new Node(this.assignNodeId(), 'promise', logTime, logLoc, promiseData, promise.fulfilled);
        returnValue = newValue.id;
        var newEdge = new Edge(this.assignEdgeId(), 'link', newValue.id, promise.id, logTime, logLoc, 'link', edgeData);
        this.edges.push(newEdge);
        this.nodes.push(newValue);
    }
    else {
        returnValue = linkedProm[0];
        var newEdge = new Edge(this.assignEdgeId(), 'link', returnValue, promise.id, logTime, logLoc, 'link', edgeData);
        this.edges.push(newEdge);
    }

    return returnValue;
};

/**
 * handles the case when the reject edge is not linking to another promise
 * @param logEntry
 * @param promise
 * @param logTime
 * @param logLoc
 * @param edgeData
 * @param nodeData
 * @returns returnValue
 */
PromisesGraph.prototype.rejectEdgeNotLinking = function (logEntry, promise, logTime, logLoc, edgeData, nodeData) {

    var newValue = new Node(this.assignNodeId(), 'value', logTime, logLoc, nodeData, this.FULFILLED.NA);
    var returnValue = newValue.id;

    var newEdge = new Edge(this.assignEdgeId(), 'react', newValue.id, promise.id, logTime, logLoc, 'reject', edgeData);

    this.edges.push(newEdge);
    this.nodes.push(newValue);

    return returnValue;
};

/**
 * This function represents registering a fulfill reaction for a promise.
 * It first retrieves the promise, then creates a function node representing the fulfill reaction, and finally creates an edge from the promise to the function.
 * @param logEntry
 */
PromisesGraph.prototype.createResolveReaction = function (logEntry) {
    var findByFID = function (fID) {
        return this.nodes.find(function (node) {
            return node.type == "function" && node.data.fID == fID;
        });
    }.bind(this);
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;
    // get the promise node
    var promise = this.promises[logEntry.pID];

    // Find function by fId if existe
    var newFunction = findByFID(logEntry.fID);

    if (!newFunction) {
        // create new function node
        var funcData = {
            name: logEntry.functionName,
            fID: logEntry.fID,
            executed: false,
            numOfArgs: logEntry.numOfArgs
        };
        newFunction = new Node(this.assignNodeId(), 'function', logTime, logLoc, funcData, this.FULFILLED.NA);
        this.functions[logEntry.fID] = newFunction;
        this.nodes.push(newFunction);
    }

    // create edge from promise to function
    var newEdge = new Edge(this.assignEdgeId(), 'register', promise.id, newFunction.id, logTime, logLoc,
        'on-resolve', {});
    this.edges.push(newEdge);
};

/**
 * This function represents registering a reject reaction for a promise.
 * It first retrieves the promise, then creates a function node representing the reject reaction, and finally creates an edge from the promise to the function.
 * @param logEntry
 */
PromisesGraph.prototype.createRejectReaction = function (logEntry) {
    var findByFID = function (fID) {
        return this.nodes.find(function (node) {
            return node.type == "function" && node.data.fID == fID;
        });
    }.bind(this);
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;
    var promise = this.promises[logEntry.pID];

    // Find function by fId if existe
    var newFunction = findByFID(logEntry.fID);

    if (!newFunction) {
        // create new function node
        var funcData = {
            name: logEntry.functionName,
            fID: logEntry.fID,
            executed: false,
            numOfArgs: logEntry.numOfArgs
        };
        newFunction = new Node(this.assignNodeId(), 'function', logTime, logLoc, funcData, this.FULFILLED.NA);
        this.functions[logEntry.fID] = newFunction;
        this.nodes.push(newFunction);
    }
    var newEdge = new Edge(this.assignEdgeId(), 'register', promise.id, newFunction.id, logTime, logLoc,
        'on-reject', {});
    this.edges.push(newEdge);
};

/**
 * This function handles the Promise.all() operation.
 * It creates a "sync" node representing the nature of all().
 * It then detects all inputs to all(), including promise objects, and creates and/or links arguments to the all() sync node.
 * Finally, it creates a new promise as a result of executing all(), and links it to the sync node.
 * @param logEntry
 */
PromisesGraph.prototype.handlePromiseAll = function (logEntry) {
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;

    var data = {
        id: logEntry.pID
    };
    var newPromise = new Node(this.assignNodeId(), 'promise', logTime, logLoc, data, this.FULFILLED.PENDING);
    this.promises[logEntry.pID] = newPromise;
    this.nodes.push(newPromise);

    // keep all arg nodes in a list (weather they exist from before [promise] or are newly created here [literals]
    var argsList = [];
    var allArgs = logEntry['args'];

    var argIndex;
    for (argIndex = 0; argIndex < allArgs.length; argIndex ++) {
        var pArg = allArgs[argIndex];
        var argValue, newValueArg;

        if (pArg.type === 'promise') {
            var argPid = pArg.pID;
            var argPromise = this.promises[argPid];

            argsList.push(argPromise);
        }
        else if (pArg.type === 'number' || pArg.type === 'string') {
            argValue = pArg.value;

            newValueArg = new Node(this.assignNodeId(), 'value', logTime, logLoc, {'value': argValue}, this.FULFILLED.NA);
            this.nodes.push(newValueArg);
            argsList.push(newValueArg);
        }
        else if (pArg.type === 'object') {
            argValue = pArg.value;

            newValueArg = new Node(this.assignNodeId(), 'value', logTime, logLoc, {'value': argValue}, this.FULFILLED.NA);
            this.nodes.push(newValueArg);
            argsList.push(newValueArg);
        }
        else {
            console.log('WARNING: "all" argument type undefined');
        }
    }

    // create an intermediate node (synch bar) with all incoming args pointing to it, which itself links to the 'all' resulting promise
    var syncNode = new Node(this.assignNodeId(), 'sync', logTime, logLoc, {'type': 'all'}, this.FULFILLED.PENDING);
    this.nodes.push(syncNode);

    var newEdge;
    for (argIndex = 0; argIndex < argsList.length; argIndex ++) {
        newEdge = new Edge(this.assignEdgeId(), 'sync', argsList[argIndex].id, syncNode.id, logTime, logLoc, 'all', '');
        this.edges.push(newEdge);
    }
    // the label of this edge depends on how input promises to 'all' are fulfilled
    newEdge = new Edge(this.assignEdgeId(), 'react-all', syncNode.id, newPromise.id, logTime, logLoc, '???', '');
    this.edges.push(newEdge);
};

/**
 * This function handles the Promise.race() operation.
 * It creates a "sync" node representing the nature of race().
 * It then detects all inputs to race(), including promise objects, and creates and/or links arguments to the race() sync node.
 * Finally, it creates a new promise as a result of executing race(), and links it to the sync node.
 * @param logEntry
 */
PromisesGraph.prototype.handlePromiseRace = function (logEntry) {
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;

    var data = {
        id: logEntry.pID
    };
    var fulfilled = this.FULFILLED.NA;

    // keep all arg nodes in a list (weather they exist from before [promise] or are newly created here [literals]
    var argsList = [];
    var raceArgs = logEntry['args'];

    for (var argIndex = 0; argIndex < raceArgs.length; argIndex ++) {
        var pArg = raceArgs[argIndex];

        if (pArg.type === 'promise') {
            var argPid = pArg.pID;
            var argPromise = this.promises[argPid];
            fulfilled = this.FULFILLED.RESOLVED;
            argsList.push(argPromise);
        }
        else if (pArg.type === 'object') {
            // TODO update when we support objects. diffs w/ literals?
            var argValue = pArg.value;
            var newValueArg = new Node(this.assignNodeId(), 'value', logTime, logLoc, {'value': argValue}, this.FULFILLED.NA);
            this.nodes.push(newValueArg);
            argsList.push(newValueArg);
        }
        else {
            argValue = pArg.value;
            fulfilled = this.FULFILLED.RESOLVED;
            newValueArg = new Node(this.assignNodeId(), 'value', logTime, logLoc, {'value': argValue}, this.FULFILLED.RESOLVED);
            this.nodes.push(newValueArg);
            argsList.push(newValueArg);
        }
    }

    if (fulfilled === "n/a") fulfilled = this.FULFILLED.REJECTED;
    var newPromise = new Node(this.assignNodeId(), 'promise', logTime, logLoc, data, fulfilled);
    this.promises[logEntry.pID] = newPromise;
    this.nodes.push(newPromise);

    var syncNode = new Node(this.assignNodeId(), 'sync', logTime, logLoc, {'type': 'race'}, this.FULFILLED.PENDING);
    this.nodes.push(syncNode);

    for (argIndex = 0; argIndex < argsList.length; argIndex ++) {
        var newEdge = new Edge(this.assignEdgeId(), 'sync', argsList[argIndex].id, syncNode.id, logTime, logLoc, 'race', '');
        this.edges.push(newEdge);
    }

    var fulfill = (newPromise.fulfilled === "resolved") ? "resolve" : "reject";

    newEdge = new Edge(this.assignEdgeId(), 'react-race', syncNode.id, newPromise.id, logTime, logLoc, fulfill, '');
    this.edges.push(newEdge);
};

/**
 * This function logs creation of a link edge between two promises
 * @param logEntry
 */
PromisesGraph.prototype.createLink = function (logEntry) {
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;
    var source = this.promises[logEntry.opID];
    var target = this.promises[logEntry.pID];
    var newEdge = new Edge(this.assignEdgeId(), 'link', source.id, target.id, logTime, logLoc, 'link', {});
    this.edges.push(newEdge);
};

/**
 * This function creates a promise node by creating a proxy for another promise, which binds more functionality to the original promise
 * It then creates an edge between the original promise and the promise created by the proxy
 * @param logEntry
 */
PromisesGraph.prototype.promisifyByProxy = function (logEntry) {
    var logTime = logEntry.timeStamp, logLoc = logEntry.loc;
    var data = {
        id: logEntry.pID,
        origPID: logEntry.origPID
    };
    var newPromise = new Node(this.assignNodeId(), 'promise', logTime, logLoc, data, this.FULFILLED.PENDING);
    this.promises[logEntry.pID] = newPromise;
    this.nodes.push(newPromise);

    var source = this.promises[logEntry.origPID];
    var newEdge = new Edge(this.assignEdgeId(), 'proxy', source.id, newPromise.id, logTime, logLoc, 'proxy', data);
    this.edges.push(newEdge);
};

/**
 * This function captures some session information when a new script file is entered
 * @param logEntry
 */
PromisesGraph.prototype.enterScript = function (logEntry) {
    if (this.firstScriptOfExecution) {
        this.metaData['startTime'] = logEntry.timeStamp;
        this.metaData['startLoc'] = logEntry.loc;
        this.metaData['originalFile'] = logEntry.originalFile;
        this.metaData['instrumentedFile'] = logEntry.instrumentedFile;
        this.firstScriptOfExecution = false;
    }
};

/**
 * This function reads the log file and generates a promise graph based on the sequence of operations in the file.
 * @param logFile - The execution log file generated by src/log/promiseLogger.js
 * @returns {{label: string, nodes: *, edges: *}}
 */
PromisesGraph.prototype.createGraph = function (logFile) {
    for (var i = 0; i < logFile.length; i ++) {
        var logEntry = logFile[i];
        var logTime = logEntry.timeStamp;
        var logLoc = logEntry.loc;
        switch (logEntry.op) {
            case logger.operations().ENTER_SCRIPT:

                break;
            case logger.operations().EXIT_SCRIPT:

                break;
            case logger.operations().PROMISIFY_BEGIN:
                this.createPromiseNode(logEntry.id, logTime, logLoc);

                break;
            case logger.operations().PROMISIFY_END:
                this.promises[logEntry.id].data['associatedOID'] = logEntry.associatedOID;

                break;
            case logger.operations().RESOLVE:
                this.createResolveEdge(logEntry);

                break;
            case logger.operations().REJECT:
                this.createRejectEdge(logEntry);

                break;
            case logger.operations().RESOLVE_FUNC_BEGIN:
                this.createPromiseNode(logEntry.pID, logTime, logLoc);

                break;
            case logger.operations().RESOLVE_FUNC_END:
                this.promises[logEntry.pID].data['associatedOID'] = logEntry.associatedOID;

                break;
            case logger.operations().REJECT_FUNC_BEGIN:
                this.createPromiseNode(logEntry.pID, logTime, logLoc);

                break;
            case logger.operations().REJECT_FUNC_END:
                this.promises[logEntry.pID].data['associatedOID'] = logEntry.associatedOID;

                break;
            case logger.operations().THEN:

                break;
            case logger.operations().THEN_PROMISIFY:
                this.createPromiseNode(logEntry.pID, logTime, logLoc);

                break;
            case logger.operations().REGISTER_RESOLVE:
                this.createResolveReaction(logEntry);

                break;
            case logger.operations().REGISTER_REJECT:
                this.createRejectReaction(logEntry);

                break;
            case logger.operations().CATCH:

                break;
            case logger.operations().CATCH_PROMISIFY:
                this.createPromiseNode(logEntry.pID, logTime, logLoc);

                break;
            case logger.operations().ALL:
                this.handlePromiseAll(logEntry);

                break;
            case logger.operations().RACE:
                this.handlePromiseRace(logEntry);

                break;
            case logger.operations().LINK:
                this.createLink(logEntry);

                break;
            case logger.operations().END_EXECUTION:
                this.metaData['endTime'] = logTime;
                this.metaData['endLoc'] = logLoc;

                break;
            case logger.operations().PROXY_PROMISIFY:
                this.promisifyByProxy(logEntry);

                break;
            default:
                console.log('PromiseLogger: WARNING unknown operation');
                break;
        }
    }

    return {
        label: 'test',
        nodes: this.nodes,
        edges: this.edges
    };
};

/**
 * This function imports json logs created by the logger
 * It then uses the imported logs to infer and create the promises graph, draw the graph, and analyze the graph for potential anti-patterns
 * @param fileName
 * @param logDir
 * @param graphDir
 * @param graphVisDir
 */
PromisesGraph.prototype.importLog = function (fileName, logDir, graphDir, graphVisDir) {
    var logFile = JSON.parse(fs.readFileSync(logDir + path.sep + fileName + '.json', 'utf8'));
    // create graph from logFile
    var jsonGraph = this.createGraph(logFile);
    var importedGraph = this.importGraph(jsonGraph);

    var graphAnalysis = new GraphAnalysis(importedGraph, this.FULFILLED);
    var bothGraphs = graphAnalysis.analyzeGraph();
    var visGraph = bothGraphs.visGraph;
    var updatedJsonGraph = bothGraphs.jsonGraph;
    updatedJsonGraph.metaData = this.metaData;
    var warningNodes = bothGraphs.warnings;
    var inlineWarnings = bothGraphs.inlineWarnings;

    this.writeGraphToFile(updatedJsonGraph, path.join(graphDir, path.sep, fileName + '.json'));
    var svgGraph = this.drawGraph(visGraph, path.join(graphVisDir, path.sep, fileName), 'png', warningNodes);
    if (typeof svgGraph !== 'undefined') {
        this.generateReport(path.join(graphVisDir, path.sep, fileName + '_report.json'), warningNodes, inlineWarnings);
    }
};

/**
 * This function persists the promises graph to the file system in json format
 * @param jsonGraph
 * @param filePath
 */
PromisesGraph.prototype.writeGraphToFile = function (jsonGraph, filePath) {
    var trimmedNodes = [];
    jsonGraph.nodes.forEach(function (node) {
        trimmedNodes.push(node.trim());
    });
    var trimmedGraph = {
        nodes: trimmedNodes,
        edges: jsonGraph.edges
    };
    mkdirp.sync(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(trimmedGraph, null, 2));
};

/**
 * This function generates a report of characteristics and anti-patterns of promises graph
 * @param filePath
 * @param warningNodes
 * @param inlineWarnings
 */
PromisesGraph.prototype.generateReport = function (filePath, warningNodes, inlineWarnings) {
    var warnings = {};
    warnings.deadPromise = [], warnings.undefinedValue = [], warnings.undefinedValuesRefined = [], warnings.missingReject = [], warnings.missingRejectInChain = [], warnings.multipleThens = [], warnings.rejectedWithoutAReaction = [];   // todo deadPromiseIds
    var i;
    for (i = 0; i < warningNodes.length; i ++) {
        switch (warningNodes[i].type) {
            case 'dead-promise':
                warnings.deadPromise.push(warningNodes[i].targetNode);
                break;
            case 'undefined-value':
                warnings.undefinedValue.push(warningNodes[i].targetNode);
                break;
            case 'undefined-value-refined':
                warnings.undefinedValuesRefined.push(warningNodes[i].targetNode);
                break;
            case 'missing-reject':
                warnings.missingReject.push(warningNodes[i].targetNode);
                break;
            case 'missing-reject-in-chain':
                warnings.missingRejectInChain.push(warningNodes[i].targetNode);
                break;
            case 'multiple-then':
                warnings.multipleThens.push(warningNodes[i].targetNode);
                break;
            case 'missing-reject-rejected':
                warnings.rejectedWithoutAReaction.push(warningNodes[i].targetNode);
                break;
            case 'numOfExclusivelyExecutedReactions':
                warnings.numOfExclusivelyExecutedReactions = warningNodes[i].message;
                break;
            default:
                console.log('>>>> other type of warning: ' + warningNodes[i].type);
        }
    }

    warnings = this.countWarnings(warnings, inlineWarnings);
    fs.writeFileSync(filePath, JSON.stringify(warnings, null, 2));
};

/**
g * This function counts the number of detected warnings and collects their IDs, based on warning type
 * @param warnings
 * @param inlineWarnings
 * @returns {*}
 */
PromisesGraph.prototype.countWarnings = function (warnings, inlineWarnings) {
    warnings.numOfDeadPromise = warnings.deadPromise.length;
    warnings.numOfUndefinedValue = warnings.undefinedValue.length;
    warnings.numOfUndefinedValuesRefined = warnings.undefinedValuesRefined.length; // undefined value used to settle a promise
    warnings.numOfMissingReject = warnings.missingReject.length;
    warnings.numOfmissingRejectInChain = warnings.missingRejectInChain.length;
    warnings.numOfMultipleThens = warnings.multipleThens.length;
    warnings.numOfRejectedWithoutAReaction = warnings.rejectedWithoutAReaction.length;

    warnings.doubleSettles = [];
    for (var i = 0; i < inlineWarnings.doubleSettles.length; i ++) {
        warnings.doubleSettles.push(inlineWarnings.doubleSettles[i].id);
    }
    warnings.numOfDoubleSettles = warnings.doubleSettles.length;

    warnings.pendingPromises = [];
    for (i = 0; i < inlineWarnings.pendingPromises.length; i ++) {
        warnings.pendingPromises.push(inlineWarnings.pendingPromises[i].id);
    }
    warnings.numOfPendingPromises = warnings.pendingPromises.length;

    warnings.pendingSyncNodes = [];
    for (i = 0; i < inlineWarnings.pendingSyncNodes.length; i ++) {
        warnings.pendingSyncNodes.push(inlineWarnings.pendingSyncNodes[i].id);
    }
    warnings.numOfPendingSyncNodes = warnings.pendingSyncNodes.length;

    warnings.deadCode = [];
    for (i = 0; i < inlineWarnings.deadCode.length; i ++) {
        warnings.deadCode.push(inlineWarnings.deadCode[i].id);
    }
    warnings.numOfDeadCode = warnings.deadCode.length;

    return warnings;
};

module.exports = PromisesGraph;
