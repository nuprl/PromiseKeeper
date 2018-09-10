/**
 sample graph for example 1 from paper
 **/
var fs = require('fs');
var Node = require('./node');
var Edge = require('./edge');

var example1Graph = JSON.parse(fs.readFileSync('example1.json'), 'utf8');

var nodes = example1Graph.graph.nodes;
for (var n in nodes) {
    var node = new Node(nodes[n].id, nodes[n].type, nodes[n].data);
    // if (node.hasOwnProperty('serialize'))
    node.serialize();
}

var edges = example1Graph.graph.edges;
for (var e in edges) {
    var edge = new Edge(edges[e].id, edges[e].type, edges[e].source, edges[e].target, edges[e].timeStamp, edges[e].data);
    edge.serialize();
}