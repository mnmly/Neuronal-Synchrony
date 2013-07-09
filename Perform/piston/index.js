var inherit = require('inherit')
  , Color = require('color')
  , Neuron = require('neuron');

module.exports = Piston;

function Piston(duration){
  Neuron.apply(this, arguments);
  this.duration = duration;
  this.initialize();
}

inherit(Piston, Neuron);

Piston.prototype.initialize = function(x, y, w, h) {

  if (this.playing) return;

  if (4 === arguments.length) {
    this._w = w;
    this._h = h;
    this._x = x;
    this._y = y;
  } else {
    this._w = this.getCanvasWidth() / 2;
    this._h = this.getCanvasHeight() / 6;
    this._x = (this.getCanvasWidth() - this._w) / 2;
    this._y = (this.getCanvasHeight() - this._h) /2;
  }

  this.w = 0;
  this.h = this._h;
  this.x = this._x;
  this.y = this._y;
};

Piston.prototype.render = function(ctx) {
  if (!this.playing) return;

  // ctx.noStroke();
  ctx.fillStyle = this.pigment.toString();
  ctx.fillRect(this.x, this.y, this.w, this.h);

};

Piston.prototype.play = function() {
  if (this.playing) return;
  this._animate_in();
};

Piston.prototype._animate_in = function() {
  this.playing = true;
  this._reset();
  // Ani.to(this, this.duration, this.delay, "w", this._w, this.easing, "onEnd:animate_out");
  var self = this;
  setTimeout(function(){
    self._animate_out();
  }, this.duration)
};

Piston.prototype._animate_out = function() {
  var self = this;
  setTimeout(function(){
    self._animate_end();
  }, this.duration)
};

Piston.prototype._animate_end = function() {
  this._reset();
  this.playing = false;
};

Piston.prototype._reset = function() {
  this.w = 0;
  this.x = this._x;
};
