var graphviz = require('graphviz');
var fs = require('fs');
var path = require('path');
var common = require('../../../test/common');
var mkdirp = require('mkdirp');
var vizjs = require('viz.js');
var svg2png = require('svg2png');

var exports = module.exports = {};

exports.drawGraph = function (pGraph, outputFileName, outputFileExt, warningNodes) {
    var vGraph = graphviz.digraph("Promises");
    // vGraph.set("rankdir", "LR");
    // vGraph.set("fontname", "Arial");
    var allvNodes = {};

    for (var i = 0; i < pGraph.visNodes.length; i ++) {
        var node = pGraph.visNodes[i];
        var vNode = vGraph.addNode(node.id, {
            "color": node.color,
            "style": node.style,
            "label": node.label,
            "shape": node.shape,
            "fillcolor": node.fillColor,
            "fontname": "helvetica",
            "fontcolor": node.fontColor
        });
        allvNodes[vNode.id] = vNode;
    }

    for (var j = 0; j < pGraph.visEdges.length; j ++) {
        var edge = pGraph.visEdges[j];
        var vEdge = vGraph.addEdge(allvNodes[edge.source], allvNodes[edge.target]);
        vEdge.set("color", edge.color);
        vEdge.set("label", edge.label);
        vEdge.set("style", edge.style);
        vEdge.set("fontname", "helvetica");
        vEdge.set("fontcolor", edge.fontColor);
    }

    // show warnings as additional nodes

    for (var k = 0; k < warningNodes.length; k ++) {
        // create visNode for each warning node
        if (warningNodes[k].type === 'missing-reject') {
            var pNode = allvNodes[warningNodes[k].targetNode];
            pNode.set("fillcolor", "#FADBD8");
            pNode.set("label", "_default missing\nreject reaction");
            pNode.set("fontcolor", "red");
        } else {
            var wNode = vGraph.addNode(pGraph.visNodes.length + warningNodes[k].id, {
                "color": "red",
                "fillcolor": "#FADBD8",
                "shape": "note",
                "style": "dashed",
                "label": warningNodes[k].message,
                "fontname": "helvetica",
                "fontcolor": "red"
            });
            allvNodes[wNode.id] = wNode;

            // update main node's background color
            var targetVNode = allvNodes[warningNodes[k].targetNode];
            targetVNode.set("fillcolor", "#FADBD8"); // "#FDEDEC"


            // create an undirected edge between target node and warning node
            var wEdge = vGraph.addEdge(allvNodes[warningNodes[k].targetNode], wNode);
            wEdge.set("color", "red");
            wEdge.set("dir", "none");
            wEdge.set("style", "dashed");
        }
    }

    var dotLogDir = path.join(common.TOOL_HOME, 'tests-unit/output-actual/graph-dot');
    if (!fs.existsSync(dotLogDir)) {
        try {
            fs.mkdirSync(dotLogDir);
        } catch (err) {
            console.log(err);
        }
    }
    // var dotLogFile = dotLogDir + path.sep + path.basename(outputFileName) + '.dot';
    // fs.writeFileSync(dotLogFile, vGraph.to_dot());

    if (typeof outputFileName !== 'undefined' && outputFileName.indexOf('tests-nodejs') > -1) {  // node js test
        var svgGraph = vizjs(vGraph.to_dot());
        var pngBuffer = svg2png.sync(svgGraph);
        mkdirp.sync(path.dirname(outputFileName));
        fs.writeFileSync(outputFileName + '.png', pngBuffer);

        return svgGraph;
        // node graphviz was not able to handle larger graphs, so we moved on to using two other packages instead (for benchmark apps)
        // vGraph.output(outputFileExt, outputFileName + "." + outputFileExt);
    }
    else { // unit tests
        var visLogDir = path.join(common.TOOL_HOME, 'tests-unit/output-actual/graph-vis');
        mkdirp.sync(visLogDir);
        vGraph.output(outputFileExt, path.join(visLogDir, path.sep, path.basename(outputFileName) + "." + outputFileExt));
    }
};
