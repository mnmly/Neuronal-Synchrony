var inherit = require('inherit')
  , Neuron = require('neuron');

module.exports = Piston;

function Piston() {
}

inherit(Piston, Neuron);

Piston.prototype.initialize = function(x, y, w, h) {

  if (this.playing) return;
  
  var size = this.getStageSize();

  if (4 === arguments.length) {

    this._w = w;
    this._h = h;
    this._x = x;
    this._y = y;

  } else {

    this._w = size.width / 2;
    this._h = size.height / 6;
    this._x = (size.width - this._w) / 2;
    this._y = (size.height - this._h) /2;

  }
  
  this.w = 0;
  this.h = this._h;
  this.x = this._x;
  this.y = this._y;
  
};
