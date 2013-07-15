var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = PinWheel;

function PinWheel( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.setDuration( duration );
  this._amount = 8;
  this.dur = duration / ( this._amount + 2 );
  this._origin = new Vector( this._app.width / 2, this._app.height / 2 );
  this._distance = this._app.height / 6;
  this._startAngle = 0;
  this._endAngle = TWO_PI;
  this._drift = random( TWO_PI );
  this.initialize();
}

inherit( PinWheel, Neuron );

PinWheel.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;

  this._amount = amount;

};

PinWheel.prototype.setDrift = function( drift ) {

  if ( this.playing ) return;

  this._drift = drift;

};


PinWheel.prototype.setAngles = function( startAngle, endAngle ) {

  this._startAngle = startAngle;
  this._endAngle = endAngle;

};

PinWheel.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this._points = new Array( this._amount );
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._points[i] = new Vector( 0, 0 );
  }
  this.reset();

};


PinWheel.prototype.reset = function() {
  
  if ( this.playing ) return;

  for ( var i = 0; i < this._amount; i += 1 ) {
    var pct = i / this._amount
      , theta = this._startAngle
    this._points[i].x = this._distance * cos( theta ) + this._origin.x;
    this._points[i].y = this._distance * sin( theta ) + this._origin.y;

  }
};

PinWheel.prototype.play = function() {

  if ( this.playing ) return;

  this.animate_in();
  
};


PinWheel.prototype.animate_in = function( ) {
  
  var self = this;

  this.playing = true;
  var delay = 0;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }

  for ( var i = 0; i < this._amount; i += 1 ) {
    var index = i + 1
      , _drift = this._drift / index
      , center = PI * ( index / this._amount );
    delay += this.duration;
    for ( var j = 0; j < this._amount; j += 1 ) {
      var pct = min( j / index, 1.0 )
        , theta = pct * this._endAngle + this._startAngle + center + this._drift
        , p = this._points[j]
        , x = this._distance * cos( theta ) + this._origin.x
        , y = this._distance * sin( theta ) + this._origin.y
        , from = { x: p.x, y: p.y }
        , to = { x: x, y: y }
        , tween = Tween( from )
                .delay( delay )
                .to( to )
                .duration( this.duration )
                .ease( this.easing )
                .update( update(p) )
                .on( 'end', function() {
                  console.log( 'end' );
                  self._removeTween( this );
                } );

    this._tweens.push( tween );
    // if ( j >= index ) {
    //   x = this._origin.x;
    //   y = this._origin.y;
    // } else {
    //  x = this._distance * cos( theta ) + this._origin.x
    //  y = this._distance * sin( theta ) + this._origin.y;
    // }

    }
  }
  
  var lastTween = Tween({ slave: this._slave })
    .to( { slave: 0 } )
    .duration( this.duration )
    .delay( delay )
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


PinWheel.prototype.animate_out = function() {
  
  var self = this;

  this.playing = true;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }
  
  for ( var i = 0; i < this._amount; i += 1 ) {
    var p = this._points[i]
      , from = { x: p.x, y: p.y }
      , to = { x: this._origin.x, y: this._origin.y }
      , tween = Tween( from )
              .to( to )
              .duration( this.duration )
              .ease( this.easing )
              .update( update( p ) )
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


PinWheel.prototype.animate_end = function() {
    
  this.playing = false;
  this.reset();

};




PinWheel.prototype.render = function() {
  
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
