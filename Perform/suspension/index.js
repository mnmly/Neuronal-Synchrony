var inherit = require( 'inherit' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Suspension;

function Suspension( app, duration ) {

  Neuron.apply( this, arguments );

  this.duration = duration / 1000;
  this._origin = new Vector( this._app.width / 2, this._app.height / 2 );
  this._theta = random( TWO_PI );
  this._deviation = HALF_PI;
  this._distance = this._app.width / 2;
  this._radius = 25;
  this._slave = 0;
  this._amount = 16;
  
  this._verts = new Array(this._amount);

  this.initialize();
}

inherit( Suspension, Neuron );


Suspension.prototype.getX = function( ) {
  return this._origin.x;
};

Suspension.prototype.getY = function() {
  return this._origin.y;
};

Suspension.prototype.getTheta = function( ) {
  return this._theta;
};

Suspension.prototype.getDeviation = function( ) {
  return this._deviation;
};

Suspension.prototype.getDistance = function( ) {
  return this._distance;
};


Suspension.prototype.getAmount = function() {
  return this._amount;
};

Suspension.prototype.getRadius = function() {
  return this._radius;
};


Suspension.prototype.setDistance = function( distance ) {
  
  if ( this.playing ) return;

  this._distance = distance;

};


Suspension.prototype.setTheta = function( theta ) {
  
  if ( this.playing ) return;

  this._theta = theta;
  
};


Suspension.prototype.setDeviation = function( deviation ) {
  
  if ( this.playing ) return;

  this._deviation = deviation / 2;

};


Suspension.prototype.setOrigin = function( x, y ) {

  if ( this.playing ) return;

  this._origin.x = x;
  this._origin.y = y;
    
};

Suspension.prototype.setRadius = function( radius ) {
  
  if ( this.playing ) return;

  this._radius = radius;

};


Suspension.prototype.initialize = function( ) {

  if (this.playing) return;
  
  for ( var i = 0; i < this._verts.length; i += 1 ) {

    var vert = this._verts[i] = new Suspension.Vertex( this._origin.x, this._origin.y )
      , t = this._theta + random( -this._deviation, this._deviation )
      , a = random( this._distance )
      , d = random( this.duration )
      , r = random( this._radius / 2, this._radius )
      , x = a * cos( t ) + this._origin.x
      , y = a * sin( t ) + this._origin.y;
    vert.destination.x = x;
    vert.destination.y = y;
    vert.radius = r;

  }

};

Suspension.prototype.play = function() {
  
  if ( this.playing ) return;


  this.animate_in();
};


Suspension.prototype.animate_in = function() {
  
  var self = this;

  this.playing = true;
  
  setTimeout(function() {
    self.animate_end();
  }, this.duration );

};


Suspension.prototype.animate_end = function() {
  console.log( 'animate end' );
  playing = false;

  for ( var i = 0; i < this._amount; i += 1 ) {
    this._verts[i].x = this._origin.x;
    this._verts[i].y = this._origin.y;
  }
};


Suspension.prototype.render = function() {
  if ( !this.playing ) return;
  
  var context = this._app;
  // ctx.noStroke();
  this._app.fillStyle = this.pigment.toString();
  this._app.beginPath();
  for ( var i = 0; i < this._amount; i += 1 ) {
    var v = this._verts[i];
    // ellipse( v.x, v.y, v.radius, v.radius );
    this._app.arc( v.x, v.y, v.radius, 0, TWO_PI, true);
  }
  this._app.closePath();
  this._app.fill();
};

// Vertex
Suspension.Vertex = Vertex;

function Vertex( x, y ){
  Vector.apply(this, arguments);
  this.destination = new Vector(0, 0);
  this.radius = 0.0;
}

inherit(Vertex, Vector);

