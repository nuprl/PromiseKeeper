function WarningNode (id, type, message, mainNode) {
    this.id = id;
    this.type = type;
    this.message = message;
    this.targetNode = mainNode;
}

WarningNode.prototype.setType = function (type) {
    this.type = type;
};

WarningNode.prototype.setMessage = function (message) {
    this.message = message;
};

module.exports = WarningNode;