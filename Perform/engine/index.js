var Piston = require('piston');

module.exports = Engine;

function Engine(router, x, y, width, height){
  
  this._pistons = [];
  this._amount = 8;
  this._pigment = '#000';
  this._router = router;
  this._app = router._app;

  this._ox = x;
  this._oy = y;

  this.w = width;
  this.h = height;
  this.x = x- (this.w / 2);
  this.y = y - (this.h / 2);

  this.gutter = 0;
  this.duration = 0.15 * 1000;
  this.delay = 0;
  this.initialize();
}

Engine.prototype.isPlaying = function() {

  var result = false;
  for (var i = 0; i < this._amount; i += 1) {
    var piston = this._pistons[i];
    if ( piston.playing ) {
      result = true;
      break;
    }
  }
  return result;
};

Engine.prototype.setColor = function(color) {
  this._pigment = color;
};

Engine.prototype.setAmount = function(amount) {
  this._amount = amount;
};

Engine.prototype.setDelay = function(delay) {
  this.delay = delay;
};

Engine.prototype.setDimensions = function(width, height) {
  this.w = width;
  this.h = height;
  this.x = this._ox - (width / 2);
  this.y = this._oy - (height / 2);
};

Engine.prototype.initialize = function() {
  if (this._amount <= 1) {
    this.gutter = 0;
  } else {
    this.gutter = this.h / (this._amount * 4);
  }

  var offsetH = (this.h / this._amount) - this.gutter;

  for (var i = 0; i < this._amount; i += 1) {
    
    var piston = this._pistons[i] = new Piston(this._app, this.duration)
      , offsetY = (i / this._amount) * this.h + this.y + this.gutter / 2;

    piston.initialize(this.x, offsetY, this.w, offsetH);
    piston.setDelay(this.delay * i);
    piston.setColor(this._pigment);

  }
};

Engine.prototype.play = function() {
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._pistons[i].play();
  }
};

Engine.prototype.render = function() {
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._pistons[i].render();
  }
};

Engine.prototype.update = function() {
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._pistons[i].update();
  }
};
