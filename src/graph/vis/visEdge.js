function VisEdge (id) {
    this.id = id;
    this.label = '';
    this.color = '';
    // other fields?
    this.COLOR = Object.freeze({
        BLACK: 'black',
        GREY: 'grey',
        GREEN: '#2ECC71', //'green',
        ORANGE: '#E67E22',
        TURQUOISE: '#1ABC9C', //'turquoise'
        DARKGREY: "#2E4053",
        MEDGREY: "#85929E",
        RED: 'red'
    });
    this.STYLE = Object.freeze({
        SOLID: 'solid',
        DASHED: 'dashed'
    });
    this.source = -1;
    this.target = -1;
    this.style = '';
    this.fontColor = this.COLOR.MEDGREY;
}

VisEdge.prototype.setLabel = function (label) {
    this.label = label;
};

VisEdge.prototype.setColor = function (color) {
    this.color = color;
};

VisEdge.prototype.setNodes = function (source, target) {
    this.source = source;
    this.target = target;
};

VisEdge.prototype.addStyle = function (style) {
    this.style = this.style + ',' + style;
};

VisEdge.prototype.setFontColor = function (color) {
    this.fontColor = color;
};

module.exports = VisEdge;