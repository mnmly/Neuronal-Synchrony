var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Neuron = require( 'neuron' );

module.exports = Piston;

function Piston( app, duration ){

  Neuron.apply(this, arguments);
  this.duration = duration;
  this.initialize();

}

inherit( Piston, Neuron );

Piston.prototype.initialize = function(x, y, w, h) {

  if (this.playing) return;
  
  var size = this.getStageSize();

  if (4 === arguments.length) {

    this._w = w;
    this._h = h;
    this._x = x;
    this._y = y;

  } else {

    this._w = size.width / 2;
    this._h = size.height / 6;
    this._x = (size.width - this._w) / 2;
    this._y = (size.height - this._h) /2;

  }
  
  this.w = 0;
  this.h = this._h;
  this.x = this._x;
  this.y = this._y;
};

Piston.prototype.render = function() {

  if (!this.playing) return;

  // ctx.noStroke();
  this._app.fillStyle = this.pigment.toString();
  this._app.fillRect(this.x, this.y, this.w, this.h);

};

Piston.prototype.play = function() {
  if (this.playing) return;
  console.log( 'playing' );
  this._animate_in();
};

Piston.prototype._animate_in = function() {
  this.playing = true;
  this._reset();
  console.log( this.duration );
  var self = this;
  var from = { w: this.w }
    , to = { w: this._w }
    , tween = Tween( from )
      .to( to )
      .ease( this.easing )
      .duration( this.duration )
      .update( function( o ){
        self.w = o.w;
      } )
      .on( 'end', function(){
        self._animate_out();
        var index = self._tweens.indexOf( this );
        self._tweens.splice( index, 1 );
      } );
  this._tweens.push( tween );
};

Piston.prototype._animate_out = function() {
  var self = this;

  var from = { x: this.x, w: this.w }
    , to = { x: this._w + this._x, w: 0 }
    , tween = Tween( from )
      .to( to )
      .ease( this.easing )
      .duration( this.duration )
      .update( function( o ){
        self.x = o.x;
        self.w = o.w;
      } )
      .on( 'end', function(){
        self._animate_end();
        var index = self._tweens.indexOf( this );
        self._tweens.splice( index, 1 );
      } )
  this._tweens.push( tween );
};

Piston.prototype._animate_end = function() {
  this._reset();
  this.playing = false;
};

Piston.prototype._reset = function() {
  this.w = 0;
  this.x = this._x;
};
