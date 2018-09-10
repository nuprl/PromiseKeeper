var VisNode = require('./vis/visNode');
var VisEdge = require('./vis/visEdge');
var WarningNode = require('./vis/warningNode');
var __this;

/**
 * This class is responsible for analyzing the promise graph for potential anti-patterns
 * @param promisesGraph
 * @param fulfilled
 * @constructor
 */
function GraphAnalysis(promisesGraph, fulfilled) {
    this.graph = promisesGraph;
    this.visNodes = [];
    this.visEdges = [];
    this.FULFILLED = fulfilled;
    __this = this;
}

GraphAnalysis.prototype.oneReactionIsExecuted = function (node) {
    if (typeof node.edges === 'undefined')
        return false;
    var resolveReaction, rejectReaction;
    for (var i = 0; i < node.edges.length; i ++) {
        if (node.edges[i].type === 'register') {
            if (node.edges[i].label === 'on-resolve') {
                resolveReaction = __this.graph.nodes[node.edges[i].target];
            }
            else if (node.edges[i].label === 'on-reject') {
                rejectReaction = __this.graph.nodes[node.edges[i].target];
            }
        }
    }

    if (typeof resolveReaction !== 'undefined' && typeof rejectReaction !== 'undefined') {
        if ((resolveReaction.data.executed && !rejectReaction.data.exports) ||
            (!resolveReaction.data.executed && rejectReaction.data.exports)) {
            return true;
        }
    }
    return false;
};

/**
 * This function checks if a promise is never fulfilled or rejected (dead or unreachable promise anti-pattern)
 * Returns true for a dead promise, false o.w.
 * @param node
 * @returns {boolean}
 */
GraphAnalysis.prototype.deadPromise = function (node) {
    if (node.type === 'promise') {
        if (typeof node.incomingEdges === 'undefined' || node.incomingEdges.length === 0)
            return true;
    }
    return false;
};

/**
 * This function checks the value of value nodes for the undefined-value anti-pattern
 * @param node
 * @returns {boolean}
 */
GraphAnalysis.prototype.undefinedValue = function (node) {
    if (node.type === 'value') {
        if (typeof node.data !== 'undefined') {
            if (node.data.value === 'Undefined') {
                return true;
            }
        }
    }
    return false;
};

/**
 * This function is used for refining the results of undefined-value anti-pattern.
 * If a value is not used by a reaction of a promise, it does not matter that if it is undefined
 * @param node
 * @returns {boolean}
 */
GraphAnalysis.prototype.usedForReaction = function (node) {
    if (typeof node.edges !== 'undefined') {
        for (var i = 0; i < node.edges.length; i++) {
            var edge = node.edges[i]; //.target;
            if (edge.type === 'react') {
                var nextNode = this.graph.nodes[edge.target];
                if (typeof nextNode !== 'undefined' && nextNode.type === 'promise') {
                    for (var j = 0; j < nextNode.edges.length; j ++) {
                        var reactionEdge = nextNode.edges[j];
                        if (reactionEdge.type === 'register' && reactionEdge.label === 'on-resolve') {
                            var reactionFunction = this.graph.nodes[reactionEdge.target];
                            if (typeof reactionFunction.data !== 'undefined' && reactionFunction.data.numOfArgs > 0) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
};

/**
 * This function checks if a promise has registered a reject reaction, to analyze the missing reject reaction anti-pattern
 * @param node
 * @returns {number}
 */
GraphAnalysis.prototype.missingExceptionalReject = function (node) {
    if (node.type === 'promise') {
        if (typeof node.edges !== 'undefined') {
            for (var i = 0; i < node.edges.length; i ++) {
                if (node.edges[i].label === 'on-reject') {
                    var targetNode = this.graph.nodes[node.edges[i].target];
                    if (targetNode.type === 'function') {
                        if (targetNode.data.name === '_default') {
                            return targetNode.id;
                        }
                    }
                }
            }
        }
    }
    return -1;
};

/**
 * This function is used to refine the results of the missing reject reaction anti-pattern.
 * If a promise has not registered a reject reaction, but another promise down the promise chain has (potential exceptions are captured by another reject reaction), then the original anti-pattern detection is a false positive
 * @param node
 * @returns {boolean}
 */
GraphAnalysis.prototype.missingChainReject = function (node) {
    // reset visited flags of all nodes
    for (var k = 0; k < this.graph.nodes.length; k ++) {
        this.graph.nodes[k].visited = false;
    }

    // dfs traversal of the graph
    if (node.type === 'promise') {
        var nodes = [];
        nodes.push(node);
        while (nodes.length > 0) {
            var currNode = nodes.pop();
            if (typeof currNode.visited !== 'undefined' || !currNode.visited) {
                currNode.visited = true;
                if (typeof currNode.edges !== 'undefined') {
                    for (var i = 0; i < currNode.edges.length; i++) {
                        var child = this.graph.nodes[currNode.edges[i].target];
                        if (child.type === 'promise') {
                            if (typeof child.edges !== 'undefined' && child.edges.length > 0) {
                                for (var j = 0; j < child.edges.length; j ++) {
                                    if (typeof child.edges[j].label !== 'undefined' && child.edges[j].label.includes('on-reject')) {
                                        var reactionNode = this.graph.nodes[child.edges[j].target];
                                        if (reactionNode.type === 'function') { // TODO ???
                                            if (!(reactionNode.data.name).includes('_default')) {
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!child.visited)
                            nodes.push(child);
                    }
                }
            }
        }
    }
    return true;
};

/**
 * This function checks if a promise has registered multiple thens, which is typically not recommended
 * @param node
 * @returns {boolean}
 */
GraphAnalysis.prototype.hasMultipleThens = function (node) {
    if (typeof node.edges !== 'undefined') {
        var numOfRegisteredResolves = 0;
        for (var i = 0; i < node.edges.length; i ++) {
            if (node.edges[i].label.includes('on-resolve'))
                numOfRegisteredResolves ++;
        }
        if (numOfRegisteredResolves > 1)
            return true;
    }
    return false;
};

/**
 * This function analyzes an 'all' sync node in the graph to determine its status depending on its input arguments
 * @param node
 * @param nodeCounter
 */
GraphAnalysis.prototype.analyzeAllNode = function (node, nodeCounter) {
    if (node.incomingEdges.length === 0) {
        // all() is synchronously resolved
        node.setFulfilled(this.FULFILLED.RESOLVED);
    }
    else {
        var noPromiseRejected = true;
        var noPromisePending = true;
        for (var i = 0; i < node.incomingEdges.length; i ++) {
            var inputEdge = node.incomingEdges[i];
            var incomingNode = this.graph.nodes[inputEdge.source];
            if (incomingNode.type === 'promise') {
                if (incomingNode.fulfilled === this.FULFILLED.REJECTED) {
                    noPromiseRejected = false;
                }
                else if (incomingNode.fulfilled === this.FULFILLED.PENDING) {
                    noPromisePending = false;
                }
            }
        }
        if (noPromiseRejected && noPromisePending) {
            node.fulfilled = this.FULFILLED.RESOLVED;
        }
        else if (!noPromiseRejected) {
            node.fulfilled = this.FULFILLED.REJECTED;
        }
        else if (!noPromisePending) {
            node.fulfilled = this.FULFILLED.PENDING;
        }
        this.graph.nodes[nodeCounter].fulfilled = node.fulfilled;

        // if there is an outgoing edge to a promise, update that promise's status based on this node's resolution/rejection
        if (typeof node.edges !== 'undefined') {
            var outgoingEdge = node.edges[0];

            if (typeof outgoingEdge !== 'undefined') {
                var resultingPromise = this.graph.nodes[node.edges[0].target];
                if (typeof resultingPromise !== 'undefined' && resultingPromise.type === 'promise') {
                    node.edges[0].label = node.fulfilled;
                    this.graph.nodes[resultingPromise.id].fulfilled = node.fulfilled;
                }
            }
        }
    }
};

/**
 * This function analyzes a 'race' sync node in the graph to determine its status depending on its input arguments
 * @param node
 * @param nodeCounter
 */
GraphAnalysis.prototype.analyzeRaceNode = function (node, nodeCounter) {
    if (node.incomingEdges.length === 0) {
        // race() is forever pending
        node.setFulfilled(this.FULFILLED.PENDING);
    }
    else {
        var firstFulfilled = -1;
        var fulfillEdge;
        for (var i = 0; i < node.incomingEdges.length; i ++) {
            var inputEdge = node.incomingEdges[i];
            var incomingNode = this.graph.nodes[inputEdge.source];
            if (firstFulfilled < 0 || incomingNode.data.fulfillCounter < firstFulfilled) {
                firstFulfilled = incomingNode.data.fulfillCounter;
                fulfillEdge = inputEdge;
                node.setFulfilled(incomingNode.fulfilled);
            }
        }
        this.graph.nodes[nodeCounter].fulfilled = node.fulfilled;

        // if there is an outgoing edge to a promise, update that promise's status based on this node's resolution/rejection
        if (typeof node.edges !== 'undefined') {
            var outgoingEdge = node.edges[0];

            if (typeof outgoingEdge !== 'undefined') {
                var resultingPromise = this.graph.nodes[node.edges[0].target];
                if (typeof resultingPromise !== 'undefined' && resultingPromise.type === 'promise') {
                    node.edges[0].label = node.fulfilled;
                    this.graph.nodes[resultingPromise.id].fulfilled = node.fulfilled;
                }
            }
        }
    }
};

/**
 * This function pre-process promise graphs nodes and edges
 * It first determines the status of sync nodes at the end of execution, based on the status of their input arguments
 * It then sets labels of edges
 */
GraphAnalysis.prototype.analyzeExecution = function () {
    for (var nodeCounter = 0; nodeCounter < this.graph.nodes.length; nodeCounter ++) {
        var node = this.graph.nodes[nodeCounter];

        switch (node.type) {
            case 'value':
            case 'promise':
            case 'function':
                break;
            case 'sync':
                if (node.data.type === 'all') {
                    this.analyzeAllNode(node, nodeCounter);
                }
                else if (node.data.type === 'race') {
                    this.analyzeRaceNode(node, nodeCounter);
                }
                break;
            default:
                console.log('Error: unexpected type of node.');
        }
    }

    this.graph.edges.forEach(function (edge) {
        edge.label = __this.setEdgeLabel(edge);
    });
};

/**
 * This function determines the label of an edge in the promise graph
 * @param edge
 * @returns {*}
 */
GraphAnalysis.prototype.setEdgeLabel = function (edge) {
    var label = edge.label;
    if (edge.type === 'react-all' || edge.type === "react-race") {
        var syncNode = __this.graph.nodes[edge.source];
        label = syncNode.fulfilled;
    }
    else if (edge.type === 'sync') {
        var inputNode = __this.graph.nodes[edge.source];
        if (inputNode.type === 'value')
            label = '[value]';
        else if (inputNode.type === 'promise')
            label = '[' + inputNode.fulfilled + ']';
    }
    return label;
};

/**
 * This function is used for analyzing different promise anti-patterns for all nodes and edges of promise graph
 * It creates a set of warning nodes representing the anti-patterns and their respective nodes
 * @returns {Array}
 */
GraphAnalysis.prototype.analyzeBugPatterns = function () {
    // detect bug patterns
    var warningNodes = [];
    var warningNodeCounter = 0;
    var allMissingRejectNodeIds = [];
    // var numOfExclusivelyExecutedReactions = 0;

    for (var nodeIndex = 0; nodeIndex < this.graph.nodes.length; nodeIndex ++) {
        var node = this.graph.nodes[nodeIndex];
        if (node.type === 'promise') {
            var promiseAnalysisResults = this.analyzePromiseAntiPatterns(node, warningNodes, warningNodeCounter, allMissingRejectNodeIds);
            warningNodes = promiseAnalysisResults.warningNodes;
            warningNodeCounter = promiseAnalysisResults.warningNodeCounter;
            allMissingRejectNodeIds = promiseAnalysisResults.allMissingRejectNodeIds;
        }
        else if (node.type === 'value') {
            var valueAnalysisResults = this.analyzeValueAntiPatterns(node, warningNodes, warningNodeCounter);
            warningNodes = valueAnalysisResults.warningNodes;
            warningNodeCounter = valueAnalysisResults.warningNodeCounter;
        }
    }

    // improve the missingExceptionalReject warnings by checking down the chain
    warningNodes = this.analyzeMissingRejectsInChain(warningNodes, warningNodeCounter, allMissingRejectNodeIds);
    return warningNodes;
};

/**
 * This function detects anti-patterns specific to promise nodes in the graph
 */
GraphAnalysis.prototype.analyzePromiseAntiPatterns = function (node, warningNodes, warningNodeCounter, allMissingRejectNodeIds) {
    if (this.deadPromise(node)) {
        var warningNode = new WarningNode(warningNodeCounter, 'dead-promise', 'dead promise', node.id);
        warningNodeCounter ++;
        warningNodes.push(warningNode);
    }
    var defaultRejectId = this.missingExceptionalReject(node);
    if (defaultRejectId > -1) {
        warningNode = new WarningNode(warningNodeCounter, 'missing-reject', 'missing exceptional\nreject reaction', defaultRejectId); //node.id);
        warningNodeCounter ++;
        warningNodes.push(warningNode);
        allMissingRejectNodeIds.push(node.id);
    }
    if (this.hasMultipleThens(node)) {
        warningNode = new WarningNode(warningNodeCounter, 'multiple-then', 'more than one\nthen() registered', node.id);
        warningNodeCounter ++;
        warningNodes.push(warningNode);
    }

    return {
        warningNodeCounter: warningNodeCounter,
        allMissingRejectNodeIds: allMissingRejectNodeIds,
        warningNodes: warningNodes
    }
};

/**
 * This function detects anti-patterns specific to value nodes in the graph
 */
GraphAnalysis.prototype.analyzeValueAntiPatterns = function (node, warningNodes, warningNodeCounter) {
    if (this.undefinedValue(node)) {
        var warningNode;
        if (this.usedForReaction(node)) {
            warningNode = new WarningNode(warningNodeCounter, 'undefined-value-refined', 'undefined value\nsettles promise', node.id);
        }
        else {
            warningNode = new WarningNode(warningNodeCounter, 'undefined-value', 'undefined value', node.id);
        }
        warningNodeCounter ++;
        warningNodes.push(warningNode);
    }
    return {
        warningNodeCounter: warningNodeCounter,
        warningNodes: warningNodes
    }
};

/**
 * This function revisits missing reject warnings and detects the ones that miss rejects in chains and are actually rejected within execution
 * @param warningNodes
 * @param warningNodeCounter
 * @param allMissingRejectNodeIds
 */
GraphAnalysis.prototype.analyzeMissingRejectsInChain = function (warningNodes, warningNodeCounter, allMissingRejectNodeIds) {
    var endMissingRejectNodes = [];
    for (var missingRejectIndex = 0; missingRejectIndex < allMissingRejectNodeIds.length; missingRejectIndex ++) {
        var node = this.graph.nodes[allMissingRejectNodeIds[missingRejectIndex]];
        if (this.missingChainReject(node)) {
            // var warningNode = new WarningNode(warningNodeCounter, 'undefined-value', 'undefined value', node.id);
            var warningNode = new WarningNode(warningNodeCounter, 'missing-reject-in-chain', 'promise rejection\nis not handled', node.id);
            warningNodeCounter ++;
            endMissingRejectNodes.push(warningNode);
            warningNodes.push(warningNode);

            if (node.fulfilled === 'rejected') {
                warningNode = new WarningNode(warningNodeCounter, 'missing-reject-rejected', 'promise rejected\nno reject reaction', node.id);
                warningNodeCounter ++;
                endMissingRejectNodes.push(warningNode);
                warningNodes.push(warningNode);
            }
        }
    }
    warningNodes.concat(endMissingRejectNodes);
    return warningNodes;
};

/**
 * This function creates the visual representation of the promise graph
 * It determines the style of nodes and edges based on their contents and relations
 * It also creates additional "note" nodes for anti-patterns where necessary
 * @returns {{visGraph: {visNodes: Array, visEdges}, inlineWarnings: {}}}
 */
GraphAnalysis.prototype.createVisGraph = function () {
    var allVisNodes = [];

    var inlineWarnings = {};
    inlineWarnings.deadCode = [];
    inlineWarnings.pendingPromises = [];
    inlineWarnings.pendingSyncNodes = [];
    inlineWarnings.pendingEdges = [];
    inlineWarnings.doubleSettles = [];

    for (var nodeCounter = 0; nodeCounter < this.graph.nodes.length; nodeCounter ++) {
        var node = this.graph.nodes[nodeCounter];
        var visNode = new VisNode(node.id);
        var color = visNode.COLOR.GREY;
        var fillColor = visNode.COLOR.WHITE;
        visNode.setStyle(visNode.STYLE.FILLED);
        var label = node.id + ': ' + node.type + ' (';
        var shape = visNode.SHAPE.ELLIPSE;
        var fontColor = visNode.COLOR.BLACK;

        switch (node.type) {
            case 'function':
                label += node.data.name;
                shape = visNode.SHAPE.BOX;
                if (node.data.executed)
                    color = visNode.COLOR.DARKGREY;
                else {
                    fillColor = visNode.COLOR.LIGHTGREY;
                    fontColor = visNode.COLOR.MEDGREY;
                    // add warning for dead code
                    inlineWarnings.deadCode.push(node);
                }
                break;
            case 'promise':
                label += node.data.id;
                if (node.fulfilled === 'resolved') {
                    color = visNode.COLOR.GREEN;
                }
                else if (node.fulfilled === 'rejected') {
                    color = visNode.COLOR.ORANGE;
                }
                else if (node.fulfilled === 'pending') {
                    fillColor = visNode.COLOR.LIGHTGREY;
                    fontColor = visNode.COLOR.MEDGREY;
                    // add warning for pending promise (never settled)
                    inlineWarnings.pendingPromises.push(node);
                }

                break;
            case 'value':
                if (typeof node.data.name === 'undefined' || node.data.nametoLowerCase() === 'undefined') {
                    // label += 'value';
                }
                else {
                    label = label + '=' + node.data.name;
                }
                label += node.data.value;
                shape = visNode.SHAPE.EGG;
                color = visNode.COLOR.DARKGREY;

                break;
            case 'sync':
                shape = visNode.SHAPE.INVTRIANGLE;
                if (node.fulfilled === 'resolved') {
                    color = visNode.COLOR.GREEN;
                }
                else if (node.fulfilled === 'rejected') {
                    color = visNode.COLOR.ORANGE;
                }
                else if (node.fulfilled === 'pending') {
                    fillColor = visNode.COLOR.LIGHTGREY;
                    fontColor = visNode.COLOR.MEDGREY;
                    // add warning for dead code (sync node never settled)
                    inlineWarnings.pendingSyncNodes.push(node);
                }

                if (node.data.type === 'all') {
                    label = '(all';
                }
                else if (node.data.type === 'race') {
                    label = '(race';
                }
                break;
            default:
                console.log('Error: unexpected type of node.');
        }
        label += ')';

        visNode.setLabel(label);
        visNode.setShape(shape);
        visNode.setColor(color);
        visNode.setFillColor(fillColor);
        visNode.setFontColor(fontColor);

        allVisNodes.push(visNode);
    }

    var allVisEdges = this.createVisualEdges(inlineWarnings);

    return {
        visGraph: {
            visNodes: allVisNodes,
            visEdges: allVisEdges
        },
        inlineWarnings: inlineWarnings
    };
};

/**
 * This function creates edges of the visual representation of the promise graph
 * It determines the style of edges
 * It also creates warning notes for "multiple settle" anti-pattern, which is inferred from edge data
 * @param inlineWarnings
 * @returns {Array}
 */
GraphAnalysis.prototype.createVisualEdges = function (inlineWarnings) {
    var allVisEdges = [];
    this.graph.edges.forEach(function (edge) {
        var visEdge = new VisEdge(edge.id);
        var color = visEdge.COLOR.GREY;
        var style = visEdge.STYLE.SOLID;
        var fontColor = visEdge.COLOR.MEDGREY;

        var label = edge.label;
        if (typeof label === 'undefined')
            label = edge.type;

        edge.label = label;
        visEdge.setLabel(label.toString());
        visEdge.setNodes(edge.source, edge.target);

        switch (visEdge.label) {
            case 'resolve':
                var targetNode = __this.graph.nodes[edge.target];
                if (typeof targetNode !== 'undefined' && targetNode.type === 'promise') {
                    if (targetNode.fulfilled === 'resolved') {
                        color = visEdge.COLOR.GREEN;
                        fontColor = visEdge.COLOR.BLACK;
                    }
                }

                break;
            case 'reject':
                var targetNode = __this.graph.nodes[edge.target];
                if (typeof targetNode !== 'undefined' && targetNode.type === 'promise') {
                    if (targetNode.fulfilled === 'rejected') {
                        color = visEdge.COLOR.ORANGE;
                        fontColor = visEdge.COLOR.BLACK;
                    }
                }

                break;
            case 'on-resolve':
                var targetNode = __this.graph.nodes[edge.target];
                if (typeof targetNode !== 'undefined' && targetNode.type === 'function') {
                    if (targetNode.data.executed) {
                        color = visEdge.COLOR.GREEN;
                        fontColor = visEdge.COLOR.BLACK;
                    }
                }

                break;
            case 'on-reject':
                var targetNode = __this.graph.nodes[edge.target];
                if (typeof targetNode !== 'undefined' && targetNode.type === 'function') {
                    if (targetNode.data.executed) {
                        color = visEdge.COLOR.ORANGE;
                        fontColor = visEdge.COLOR.BLACK;
                    }
                }

                break;
            case '[resolved]':
                color = visEdge.COLOR.GREEN;
                fontColor = visEdge.COLOR.BLACK;

                break;
            case '[rejected]':
                color = visEdge.COLOR.ORANGE;
                fontColor = visEdge.COLOR.BLACK;

                break;
            case '[pending]':
                style = visEdge.STYLE.DASHED;
                fontColor = visEdge.COLOR.BLACK;

                break;
            case '[value]':
                color = visEdge.COLOR.GREEN;
                fontColor = visEdge.COLOR.BLACK;

                break;
            case 'resolved':
                color = visEdge.COLOR.GREEN;
                fontColor = visEdge.COLOR.BLACK;

                break;
            case 'rejected':
                color = visEdge.COLOR.ORANGE;
                fontColor = visEdge.COLOR.BLACK;

                break;
            case 'pending':
                style = visEdge.STYLE.DASHED;
                fontColor = visEdge.COLOR.MEDGREY;

                // add warning for pending edge never settled
                inlineWarnings.pendingEdges.push(edge);

                break;
            case 'default return':
            case 'default throw':
            case 'return':
            case 'link':
            case 'throw':
            case 'proxy':
                color = visEdge.COLOR.BLACK;
                fontColor = visEdge.COLOR.BLACK;
                break;
            default:
                console.log('WARNING: graph-analysis::createVisGraph() unknown type of edge');
        }

        if (typeof edge.data !== 'undefined') {
            if (edge.data.doubleSettle === true) {
                color = visEdge.COLOR.RED;
                visEdge.setLabel(visEdge.label + ' (redundant)');
                style = visEdge.STYLE.DASHED;
                fontColor = visEdge.COLOR.RED;

                // add warning for double settle
                inlineWarnings.doubleSettles.push(edge);
            }
        }
        else {
            console.log('WARNING: GraphAnalysis::createVisGraph >> no edge data');
        }

        visEdge.setColor(color);
        visEdge.addStyle(style);
        visEdge.setFontColor(fontColor);
        allVisEdges.push(visEdge);
    });

    return allVisEdges;
};

/**
 * This function analyzed the promise graph for anti-patterns
 * @returns {{visGraph: (visGraph|{visNodes, visEdges}), jsonGraph: *, warnings, inlineWarnings: {}}}
 */
GraphAnalysis.prototype.analyzeGraph = function () {
    // 1. analyze execution patterns (if everything is resolve, rejected and/or executed
    this.analyzeExecution();
    // 2. analyze for bug patterns
    var warningNodes = this.analyzeBugPatterns();
    // 3. create the visualized graph
    var visGraphAndWarnings = this.createVisGraph();

    return {
        visGraph: visGraphAndWarnings.visGraph,
        jsonGraph: this.graph,
        warnings: warningNodes,
        inlineWarnings: visGraphAndWarnings.inlineWarnings
    };
};

module.exports = GraphAnalysis;