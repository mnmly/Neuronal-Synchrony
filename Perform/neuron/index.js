var Color = require('color');

module.exports = Neuron;

function Neuron( app ){
  this._app = app;
  this._tweens = [];
  this.pigment = Color.RGBA(0, 0, 0, 1);
  this.duration = 0.15;
  this.delay = 0;
  this.easing = 'out-circ';
  this.playing = false;
  this._removeTween = this._removeTween.bind( this );
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

Neuron.prototype.update = function() {

  this._tweens.forEach( function( tween ){
    tween.update();
  } );


};

Neuron.prototype._removeTween = function( tween ) {
  var index = this._tweens.indexOf( tween );
  this._tweens.splice( index, 1 );
};
