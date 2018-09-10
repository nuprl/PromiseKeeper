function VisNode (id/*, color, style, label, shape*/) {
    this.id = id;
    this.color = '';
    this.style = '';
    /*
    this.label = label;
    this.shape = shape;
    */
    // other fields, e.g. notes, link to code ?
    this.COLOR = Object.freeze({
        GREY: 'grey',
        RED: 'red',
        WHITE: 'white',
        GREEN: '#2ECC71', //'green',
        PURPLE: 'purple',
        ORANGE: '#E67E22', //'orange',
        TURQUOISE: '#1ABC9C', //'turquoise'
        DARKGREY: "#2E4053",
        LIGHTGREY: "#D6DBDF",  //"#CCD1D1", //"#F4F6F6", //"#F8F9F9"
        MEDGREY: "#707B7C",  //'#85929E',
        LIGHTRED: '#FADBD8'
    });
    this.STYLE = Object.freeze({
        FILLED: 'filled'
    });
    this.SHAPE = Object.freeze({
        CIRCLE: 'circle',
        BOX: 'box',
        EGG: 'egg',
        ELLIPSE: 'ellipse',
        INVTRIANGLE: 'invtriangle'
    });
    this.label = '';
    this.note = '';
    this.fontColor = this.COLOR.BLACK;
}

VisNode.prototype.setLabel = function (label) {
    this.label = label;
};

VisNode.prototype.setColor = function (color) {
    this.color = color;
};

VisNode.prototype.setFillColor = function (color) {
    this.fillColor = color;
};

VisNode.prototype.setStyle = function (style) {
    this.style = style;
};

VisNode.prototype.setShape = function (shape) {
    this.shape = shape;
};

VisNode.prototype.setNote = function (note) {
    this.note = note;
};

VisNode.prototype.setFontColor = function (color) {
    this.fontColor = color;
};

module.exports = VisNode;
