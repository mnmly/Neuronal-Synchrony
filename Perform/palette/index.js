var Color = require( 'color' ).RGBA
  , inherit = require( 'inherit' )
  , statics = require( './statics' )
  , ease = require( 'utils' ).ease

module.exports = Palette;

function Palette(){

  this._amount = 7;

  this.source = this._colors[0];
  this.current = new Array(this._amount);
  this.destination = this._colors[0]

  for (var i = 0; i < this._amount; i++) {
    this.current[i] = new Color(0, 0, 0, 1);
  }
  
  this._easing = 0.125;
  this._state = 0.0;
  this._dest = 1.0;
  this._index = 0;
  this._assigned = false;

}

Palette.Color = PaletteColor;
inherit( PaletteColor, Color );

Palette.prototype.next = function() {
  if ( !this._assigned ) return;
  
  this._index = ( this._index + 1 == this._colors.length ) ? 0 : this._index + 1
  this.destination = this._colors[this._index];
  this.reset()
};

Palette.prototype.getColor = function( type ) {
  return this.current[type];
};

Palette.prototype.reset = function() {
  this._state = 0.0;
  this._assigned = false;
};

/**
 * Updates the tweening of the colors
 */

Palette.prototype.update = function( ) {
  if ( this._state >= 1.0 ) {
    // At a standstill
    this._assign();
  } else {
    this._state = ease( this._state, this._dest, this._easing );
    for ( var i = 0; i < this._amount; i += 1 ) {

      var s = this.source[i]
        , c = this.current[i]
        , d = this.destination[i];

      c.r = parseInt( lerp( s.r, d.r, this._state ) );
      c.g = parseInt( lerp( s.g, d.g, this._state ) );
      c.b = parseInt( lerp( s.b, d.b, this._state ) );
    }
  }
};

Palette.prototype._assign = function( ) {
  
  if ( this.assigned ) return;
  
  this.source = this._colors[this._index];
  this._assigned = true;
};


var absolute_white = Palette.prototype._absolute_white = new Palette.Color(255);
var absolute_black = Palette.prototype._absolute_black = new Palette.Color(0);

Palette.prototype._colors = [
  [
    new Palette.Color(181),
    new Palette.Color(141, 164, 170),
    new Palette.Color(227, 79, 12),
    new Palette.Color(163, 141, 116),
    new Palette.Color(255, 197, 215),
    absolute_white,
    absolute_black
  ],
  [
    new Palette.Color(57, 109, 193),
    new Palette.Color(186, 60, 223),
    new Palette.Color(213, 255, 93),
    new Palette.Color(213, 160, 255),
    new Palette.Color(36, 221, 165),
    new Palette.Color(215, 236, 255),
    absolute_black
  ],
  [
    new Palette.Color(217, 82, 31),
    new Palette.Color(143, 74, 45),
    new Palette.Color(255, 108, 87),
    new Palette.Color(255, 126, 138),
    new Palette.Color(227, 190, 141),
    absolute_white,
    absolute_black
  ],
  [
    new Palette.Color(255, 244, 211),
    new Palette.Color(207, 145, 79),
    new Palette.Color(38, 83, 122),
    new Palette.Color(178, 87, 53),
    new Palette.Color(235, 192, 92),
    new Palette.Color(226, 82, 87),
    absolute_black
  ],
  [
    new Palette.Color(191, 178, 138),
    new Palette.Color(115, 44, 3),
    new Palette.Color(89, 81, 57),
    new Palette.Color(217, 210, 176),
    new Palette.Color(242, 239, 220),
    new Palette.Color(22, 33, 44),
    absolute_white
  ],
  [
    absolute_white,
    new Palette.Color(151, 41, 164),
    new Palette.Color(1, 120, 186),
    new Palette.Color(255, 255, 0),
    new Palette.Color(255, 51, 148),
    absolute_black,
    absolute_black
  ],
  [
    new Palette.Color(39, 6, 54),
    new Palette.Color(69, 26, 87),
    new Palette.Color(252, 25, 246),
    new Palette.Color(52, 255, 253),
    new Palette.Color(133, 102, 193),
    new Palette.Color(253, 228, 252),
    absolute_white
  ]
];


for (var key in statics){
  Palette[key] = statics[key];
}

function PaletteColor( r, g, b, a ) {
  if (1 === arguments.length) {
    Color.apply(this, [r, r, r, 1]);
  } else if ( 3 === arguments.length ){
    Color.apply(this, [r, g, b, 1]);
  } else {
    Color.apply(this, arguments);
  }
}




