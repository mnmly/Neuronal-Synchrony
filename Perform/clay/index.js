var inherit = require( 'inherit' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Clay;

function Clay( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.distance = this._app.width;
  this.setDuration( duration / 1000 );
  
  this._amount = 3;
  this._offset = - PI / 2;

  this._magnitude = 0.0;
  this._m = 50.0;

  this.initialize();
}

inherit( Clay, Neuron );

Clay.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;
  
  this._amount = amount;
  this.initialize();

};

Clay.prototype.setMagnitude = function( magnitude ) {

  if ( this.playing ) return;
  
  this._m = magnitude;
};


Clay.prototype.getAmount = function( ) {
  return this._amount;
};

Clay.prototype.play = function() {
  
  if( this.playing ) return;

  this._animate_in();

};

Clay.prototype._animate_in = function( ) {
  
  var self = this;

  this.playing = true;
  
  setTimeout(function() {
    self.animate_end();
  }, this.duration );

};


Clay.prototype.animate_end = function() {
    
  this.reset();
  this.playing = false;

};


Clay.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this.__points = new Array( this._amount );
  this._points = new Array( this._amount );
  this.reset();

};


Clay.prototype.reset = function() {
  
  this._magnitude = 0.0;

  for ( var i = 0; i < this._amount; i += 1 ) {

    var pct = ( i + 1 ) / this._amount
      , theta = pct * TWO_PI + this._offset
      , _x = cos( theta )
      , _y = sin( theta )
    
    this._points[i] = new Vector( this.x, this.y );
    this.__points[i] = new Vector( this.distance * _x + this.x, this.distance * _y + this.y );

  }

};


Clay.prototype.render = function() {
  
  if ( !this.playing ) return;

  this._app.strokeStyle = this.pigment.toString();
  this._app.lineWidth = 1;

  // noFill
  this._app.fillStyle = 'rgba(0, 0, 0, 0)';
  this._app.beginPath();
  
  for ( var i = 0; i < this._amount; i += 1 ) {

    var pos = this._amount[i];

    if (i === 0) {
      this._app.moveTo( pos.x, pos.y );
    } else {
      this._app.moveTo( pos.x, pos.y );
    }
    
  }

  this._app.closePath();
  
  this._app.strokeStyle = 'rgba(0, 0, 0, 0)';
  this._app.fillStyle = this.pigment.toString();
  
  for ( var i = 0; i < this._amount; i += 1 ) {
    var pos = this._points[i];
    this._app.ellipse( pos.x, pos.y, this._magnitude, this._magnitude );
  }

};
