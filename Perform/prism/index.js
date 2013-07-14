var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Prism;

function Prism( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.distance = this._app.width;
  this.setDuration( duration );
  
  this._amount = 3;
  this._offset = - PI / 2;

  this._magnitude = 0.0;
  this._m = 50.0;

  this.initialize();
}

inherit( Prism, Neuron );

Prism.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;
  
  this._amount = amount;
  this.initialize();

};

Prism.prototype.setMagnitude = function( magnitude ) {

  if ( this.playing ) return;
  
  this._m = magnitude;
};


Prism.prototype.getAmount = function( ) {
  return this._amount;
};

Prism.prototype.play = function() {
  
  if( this.playing ) return;

  this._animate_in();

};

Prism.prototype._animate_in = function( ) {
  
  var self = this;

  this.playing = true;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }

  for ( var i = 0; i < this._amount; i += 1 ) {
    var pos = this._points[i]
      , ref = this.__points[i]
      , from = { x: pos.x, y: pos.y }
      , to = { x: ref.x, y: ref.y }
      , tween = Tween( from )
              .to( to )
              .duration( this.duration )
              .ease( this.easing )
              .update( update(pos) )
              .on( 'end', function() {
                self._removeTween( this );
              } );

    this._tweens.push( tween );
  }
  
  var lastTween = Tween({ magnitude: this._magnitude })
    .to( { magnitude: this._m } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._magnitude = o.magnitude;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_end();
    })

  this._tweens.push( lastTween );
};


Prism.prototype.animate_end = function() {
  this.reset();
  this.playing = false;

};


Prism.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this.__points = new Array( this._amount );
  this._points = new Array( this._amount );
  this.reset();

};


Prism.prototype.reset = function() {
  
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


Prism.prototype.render = function() {
  
  if ( !this.playing ) return;

  this._app.strokeStyle = this.pigment.toString();
  this._app.lineWidth = 1;

  // noFill
  this._app.fillStyle = 'rgba(0, 0, 0, 0)';
  this._app.beginPath();
  for ( var i = 0; i < this._amount; i += 1 ) {

    var pos = this._points[i];

    if (i === 0) {
      this._app.moveTo( pos.x, pos.y );
    } else {
      this._app.lineTo( pos.x, pos.y );
    }
    
  }
  this._app.closePath();
  this._app.stroke();

  // this._app.lineWidth = 0;
  this._app.fillStyle = this.pigment.toString();
  this._app.beginPath();
  for ( var i = 0; i < this._amount; i += 1 ) {
    var pos = this._points[i];
    this._app.arc( pos.x, pos.y, this._magnitude / 2, 0, TWO_PI, true );
  }
  this._app.closePath();
  this._app.fill();

};
