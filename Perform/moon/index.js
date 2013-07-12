var inherit = require( 'inherit' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Moon;

function Moon( app, duration ){
  
  Neuron.apply( this, arguments );

  this._amount = 40;

  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.r = this._app.height / 3;
  this._startAngle = 0.0;
  this.setDuration( duration );
  this.initialize();
}

inherit( Moon, Neuron );

Moon.prototype.setAngle = function( angle ) {

  this._startAngle = angle;

};


Moon.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this._points = new Array( this._amount );
  this.points = new Array( this._amount );
  this.reset();

};

Moon.prototype.play = function() {

  if ( this.playing ) return;

  this.animate_in();
  
};


Moon.prototype.animate_in = function( ) {
  
  var self = this;

  this.playing = true;
  
  setTimeout(function() {
    self.animate_out();
  }, this.duration );

};


Moon.prototype.animate_out = function() {
  
  var self = this;

  setTimeout(function() {
    self.animate_end();
  }, this.duration );

};


Moon.prototype.animate_end = function() {
    
  this.playing = false;
  this.reset();

};


Moon.prototype.reset = function() {
  
  for ( var i = 0; i < this._amount; i += 1 ) {

    var theta = ( i / this._amount ) * TWO_PI + this._startAngle
      , xpos = this.r * cos( theta ) + this.x
      , ypos = this.r * sin( theta ) + this.y;

    this._points[i] = new Vector(xpos, ypos);

    var ref = ( i <= this._amount / 2 ) ? this._points[i] : this._points[this._amount - i];

    this.points[i] = new Vector( ref.x, ref.y );

  }

};


Moon.prototype.render = function() {
  
  if ( !this.playing ) return;

  // noStroke
  this.app.fillStyle = this.pigment.toString();

  this.app.beginPath();
  
  for ( var i = 0; i < this._amount; i += 1 ) {

    var pos = this._amount[i];

    if (i === 0) {
      this.app.moveTo( pos.x, pos.y );
    } else {
      this.app.moveTo( pos.x, pos.y );
    }
    
  }

  this.app.closePath();

};
