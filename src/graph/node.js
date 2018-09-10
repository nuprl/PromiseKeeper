var Graph = require('./graph');

function Node (id, type, timeStamp, loc, data, fulfilled) {
    this.id = id;
    this.type = type;
    this.loc = loc;
    this.timeStamp = timeStamp;
    // this.data = [];
    this.data = data;
    this.edges = [];
    this.incomingEdges = [];
    this.fulfilled = fulfilled;
    this.visited = false; // todo
}

Node.prototype.addData = function (key, value) {
    var newEntity = '"' + key + '": "' + value + '"';
    this.data.push(newEntity);
};

Node.prototype.addEdge = function (edge) {
    this.edges.push(edge);
};

Node.prototype.addIncomingEdge = function (edge) {
    this.incomingEdges.push(edge);
};

Node.prototype.serialize = function () {
    var serializedNode = JSON.stringify(this, null, 2);
    return serializedNode;
};

Node.prototype.trim = function () {
    var trimmedNode = {};
    trimmedNode.id = this.id;
    trimmedNode.type = this.type;
    trimmedNode.loc = this.loc;
    trimmedNode.timeStamp = this.timeStamp;
    trimmedNode.data = this.data;
    trimmedNode.fulfilled = this.fulfilled;
    return trimmedNode;
};

Node.prototype.setFulfilled = function (fulfilled) {
    this.fulfilled = fulfilled;
};


module.exports = Node;