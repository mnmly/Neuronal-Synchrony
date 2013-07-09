module.exports = Neuron;

function Neuron(){
  this.color = '#000';
  this.duration = 0.15;
  this.delay = 0;
  this.easing = 'Circ.out'
  this.playing = false;
}

Neuron.prototype.setColor = function(color) {
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
