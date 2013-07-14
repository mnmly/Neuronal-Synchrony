var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Moon;

function Moon( app, duration ){
  
  Neuron.apply( this, arguments );

  this._amount = 40;

  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.r = this._app.height / 3;
  this._slave = 0;
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
  
  this.__points = new Array( this._amount );
  this._points = new Array( this._amount );
  this.reset();

};

Moon.prototype.play = function() {

  if ( this.playing ) return;

  this.animate_in();
  
};


Moon.prototype.animate_in = function( ) {
  
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
  
  var lastTween = Tween({ slave: this._slave })
    .to( { slave: 0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._slave = o.slave;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_out();
    })

  this._tweens.push( lastTween );
};


Moon.prototype.animate_out = function() {
  
  var self = this;

  this.playing = true;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }
  
  var l = ceil( this._amount / 2 )
  for ( var i = 0; i < l; i += 1 ) {
    var index = 0 === i ? 0 : this._amount - i
    var pos = this._points[i]
      , ref = this.__points[index]
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
  
  var lastTween = Tween({ slave: this._slave })
    .to( { slave: 0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._slave = o.slave;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_end();
    })

  this._tweens.push( lastTween );
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

    this.__points[i] = new Vector( xpos, ypos );
    if ( i <= this._amount / 2 ) {
      var ref = this.__points[i];
      this._points[i] = new Vector( ref.x, ref.y );
    } else {
      var ref = this.__points[this._amount - i];
      this._points[i] = new Vector( ref.x, ref.y );
    }
  }
};


Moon.prototype.render = function() {
  
  if ( !this.playing ) return;

  // noStroke
  this._app.fillStyle = this.pigment.toString();
  
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
  this._app.fill();
};
