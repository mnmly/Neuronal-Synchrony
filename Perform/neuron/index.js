var Color = require('color');

module.exports = Neuron;

function Neuron( app ){
  this._app = app;
  this.pigment = Color.RGBA(0, 0, 0, 1);
  this.duration = 0.15;
  this.delay = 0;
  this.easing = 'Circ.out'
  this.playing = false;
}

Neuron.prototype.setColor = function(color ) {
  this.pigment = color;
};

Neuron.prototype.setDuration = function(duration) {
  this.duration = duration;
};

Neuron.prototype.setDelay = function(delay) {
  this.delay = delay;
};

Neuron.prototype.setEasing = function(easing) {
  this.easing = easing;
};

Neuron.prototype.getColor = function() {
  return this.pigment;
};

Neuron.prototype.getDuration = function() {
  return this.duration;
};

Neuron.prototype.getDelay = function() {
  return this.getDelay;
};

Neuron.prototype.getEasing = function() {
  return this.easing;
};

Neuron.prototype.getStageSize = function() {
  return {
      width: 1000
    , height: 1000
  }
};
