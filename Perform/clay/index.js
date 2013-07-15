var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Clay;

function Clay( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.setDuration( duration );
  
  this.origin = new Vector( this._app.width / 2, this._app.height );
  this.impact = new Vector( random( this._app.width ), random( this._app.height ) )
  this.distance = this._app.height;
  this.rotation = HALF_PI;
  this.smoothness = true;
  this._amount = floor( random( 8, 16 ) );
  this.initialize();

}

inherit( Clay, Neuron );

Clay.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;
  this._amount = amount;

};

Clay.prototype.setOrigin = function( x, y ) {

  if ( this.playing ) return;
    
  this.origin.x = x;
  this.origin.y = y;
};

Clay.prototype.setSmoothing = function( smoothness ) {

  if ( this.playing ) return;

  this.smoothness = smoothness;

};

Clay.prototype.setImpact = function( x, y ) {
  
  if( this.plaing ) return;
  
  this.impact.x = x;
  this.impact.y = y;

};

Clay.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this._verts = new Array( this._amount );
  this._dests = new Array( this._amount );
  this.reset();
  this.setupDestinations();

};

Clay.prototype.setupDestinations = function( ) {
  
  if ( this.playing ) return;

  for ( var i = 0; i < this._amount; i += 1 ) {

    var v = this._verts[i]
      , ptheta = i / this._amount * TWO_PI + this.rotation
      , theta = v.angleBetween( this.impact )
      , d = v.distance( this.impact )
      , a = 5 * this.distance / sqrt( d )
      , x = a * cos( theta ) + v.x
      , y = a * sin( theta ) + v.y
    this._dests[i] = new Vector( x, y );
  }
};


Clay.prototype.reset = function() {
  
  if( this.playing ) return;

  for ( var i = 0; i < this._amount; i += 1 ) {

    var pct = ( i + 1 ) / this._amount
      , theta = pct * TWO_PI + this.rotation
      , x = this.distance * cos( theta ) + this.origin.x
      , y = this.distance * sin( theta ) + this.origin.y
    this._verts[i] = new Vector( x, y );

  }

};

Clay.prototype.play = function() {
  
  if( this.playing ) return;

  this.animate_in();

};

Clay.prototype.animate_in = function( ) {
  
  var self = this;

  this.playing = true;
  
  var update = function( v ){
    return function( o ){
      v.x = o.x;
      v.y = o.y;
    }
  };
  for ( var i = 0; i < this._amount; i += 1 ) {
    var v = this._verts[i]
      , d = this._dests[i]
      , from = { x: v.x, y: v.y }
      , to = { x: d.x, y: d.y }
      , tween = Tween( from )
            .to( to )
            .ease( this.easing )
            .duration( this.duration )
            .update( update( v ) )
            .on( 'end', function(){
              self._removeTween( this );
            } )
    this._tweens.push( tween );
  }

  var lastTween = Tween( { slave: this._slave })
                    .to( { slave: 0 } )
                    .ease( this.easing )
                    .duration( this.duration )
                    .update( function( o ) { self._slave = o.slave } )
                    .on( 'end', function(){
                      self._removeTween( this );
                      self.animate_out();
                    })
    
  this._tweens.push( lastTween );
  
};



Clay.prototype.animate_out = function() {
    
  this.reset();
  this.playing = false;

};

Clay.prototype.render = function() {
  
  if ( !this.playing ) return;

  this._app.lineWidth = 0;
  this._app.fillStyle = this.pigment.toString();

  this._app.beginPath();
  
  if ( this.smoothness ) {
    // Barrowed from Processing.js `curveVertex`
    var last = this._verts.length - 1;
    this._app.moveTo( this._verts[last].x, this._verts[last].y )
    var b = new Array(4)
      , s = 1;
    for ( var i = 1; ( i + 2 ) < this._amount; i += 1 ) {
      var v = this._verts[i];
      b[0] = [v.x, v.y];
      b[1] = [v.x + ( s * this._verts[i + 1].x - s * this._verts[i - 1].x ) / 6,
              v.y + ( s * this._verts[i + 1].y - s * this._verts[i - 1].y ) / 6];
      b[2] = [this._verts[i + 1].x + ( s * this._verts[i].x - s * this._verts[i + 2].x ) / 6,
              this._verts[i + 1].y + ( s * this._verts[i].y - s * this._verts[i + 2].y ) / 6];
      b[3] = [ this._verts[i + 1].x, this._verts[i + 1].y];
      this._app.bezierCurveTo( b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1] );
    }

  } else {
    for ( var i = 0; i < this._amount; i += 1 ) {
      var v = verts[i];
      this._app.lineTo( v.x, v.y );
    }
  }
  
  this._app.closePath();
  this._app.fill();
};

Clay.prototype.getAmount = function( ) {
  return this._amount;
};


