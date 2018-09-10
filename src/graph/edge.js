function Edge (id, type, source, target, timeStamp, loc, label, data) {
    this.id = id;
    this.type = type;
    this.source = source;
    this.target = target;
    this.timeStamp = timeStamp;
    this.loc = loc;
    this.label = label;
    // this.data = [];
    this.data = data;
}

Edge.prototype.addData = function (key, value) {
    var newEntity = '"' + key + '": "' + value + '"';
    this.data.push(newEntity);
};

Edge.prototype.serialize = function () {
    var serializedEdge = JSON.stringify(this, null, 2);
    console.log(serializedEdge);
    return serializedEdge;
};

module.exports = Edge;