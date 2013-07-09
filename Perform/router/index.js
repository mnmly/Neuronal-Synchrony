module.exports = Router;

function Router(app, depth, debug){

  this.debug = debug || false;
  this.depth = depth || 128;
  
  this._app = app;
  this._damp = 0.0125;
  this._raw_frequencies = [];
  this._smooth_frequencies = [];
  this._max_amplitude = 0.0;
  this.initialize();
}

Router.prototype.initialize = function() {
  
};

Router.prototype.getBand = function(index, smooth_) {
  return 1.0;
};

Router.prototype.getDepth = function() {
  return this.depth;
};

Router.prototype.getDamp = function() {
  return this._damp;
};

Router.prototype.setDebug = function(debug) {
  this.debug = debug;
};

Router.prototype.setDepth = function(depth) {
  this.depth = depth;
  this.initialize();
};

Router.prototype.setDamp = function(damp) {
  this._damp = damp;
};

Router.prototype.isHat = function() {
  return true;
};

Router.prototype.isKick = function() {
  return true;
};

Router.prototype.isOnset = function() {
  return true;
};

Router.prototype.isRange = function(low, high, threshold) {
  return true;
};

Router.prototype.isSnare = function() {
  return false;
};

Router.prototype.setSensitivity = function(sensitivity) {
  //
};


Router.prototype.update = function() {
  
};

Router.prototype.render = function() {
};

Router.prototype.stop = function() {
};

Router.prototype._ease = function(current, target, increment) {
  var difference = target - current;
  if (Math.abs(difference) <= increment) {
    current = target;
  } else {
    current += difference * increment;
  }
  return current;
};
