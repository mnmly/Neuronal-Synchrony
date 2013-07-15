var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Squiggle;

function Squiggle( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.distance = this._app.width;
  this.setDuration( duration );
  
  this._state = 0.0;
  this._entering = false;

  this._distance = this._app.width / 2;
  this._amplitude = this._app.height / 4;
  this._angle = 0;
  this._revolutions = 0;
  this._amount = 256;
  this._origin = new Vector( this._app.width / 2, this._app.height / 2 );
  
  this.initialize();
}

inherit( Squiggle, Neuron );

Squiggle.prototype.setRevolutions = function( revolutions ) {

  if ( this.playing ) return;
  this._revolutions = revolutions;

};

Squiggle.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;
  
  this._amount = amount;

};

Squiggle.prototype.setAngle = function( angle ) {

  if ( this.playing ) return;
  
  this._angle = angle;
};

Squiggle.prototype.setAmplitude = function( amplitude ) {

  if ( this.playing ) return;
  
  this._amplitude = amplitude;
};

Squiggle.prototype.setDistance = function( distance ) {

  if ( this.playing ) return;
  
  this._distance = distance;
};


Squiggle.prototype.getAmount = function( ) {
  return this._amount;
};

Squiggle.prototype.play = function() {
  
  if( this.playing ) return;

  this.animate_in();

};

Squiggle.prototype.animate_in = function( ) {
  
  var self = this;

  this.playing = true;
  this._entering = true;
  this._state = 0.0;

  var tween = Tween({ state: this._state })
    .to( { state: 1.0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._state = o.state;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_out();
    })

  this._tweens.push( tween );
};

Squiggle.prototype.animate_out = function() {

  var self = this;
  this._entering = false;
  this._state = 0.0;
  
  var tween = Tween({ state: this._state })
    .to( { state: 1.0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._state = o.state;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_end();
    })

  this._tweens.push( tween );

};

Squiggle.prototype.animate_end = function() {
  
  this.playing = false;
  this.reset();

};


Squiggle.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this._points = new Array( this._amount );
  this.reset();

};


Squiggle.prototype.reset = function() {
  
  if ( this.playing ) return;

  for ( var i = 0; i < this._amount; i += 1 ) {
    this._points[i] = this._getPointOnLine( i / this._amount );
  }
};


Squiggle.prototype.render = function() {
  
  if ( !this.playing ) return;
  
  this._app.lineWidth = this._app.height / 60;
  this._app.strokeStyle = this.pigment.toString();
  this._app.lineCap = 'round';
  this._app.lineJoin = 'round';
  // noFill
  this._app.fillStyle = 'rgba(0, 0, 0, 0)';

  this._app.beginPath();

  if ( this._entering ) {

    for ( var i = 0; i < this._amount; i += 1 ) {

      var pct = i / this._amount;

      if ( pct >= this._state ) continue;

      var p = this._points[i];
      if ( 0 === i ) {
        this._app.moveTo( p.x, p.y );
      } else {
        this._app.lineTo( p.x, p.y );
      }
    }
  } else {
    var l = this._getPointOnLine( 1.0 );
    this._app.moveTo( l.x, l.y );
    for ( var i = this._amount - 1; i >= 0; i-- ) {
      var pct = i / this._amount;
      if ( pct <= this._state ) continue;
      var p = this._points[i];
      this._app.lineTo( p.x, p.y );
    }
    var t = this._getPointOnLine( this._state );
    this._app.lineTo( t.x, t.y );
  }

  //this._app.closePath();
  this._app.stroke();

};

Squiggle.prototype._getPointOnLine = function( pct ) {

  var halfDistance = this._distance / 2
    , theta = pct * this._revolutions * TWO_PI
    , up = this._angle - HALF_PI
    , x = this._origin.x - halfDistance * cos( this._angle )
    , y = this._origin.y - halfDistance * sin( this._angle );

  x += pct * this._distance * cos( this._angle );
  x += cos( up ) * cos( theta ) * this._amplitude;

  y += pct * this._distance * sin( this._angle );
  y += sin( up ) * sin( theta + up ) * this._amplitude;

  return new Vector( x, y );
};
