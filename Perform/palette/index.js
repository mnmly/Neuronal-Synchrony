var Color = require('color')
  , statics = require('./statics');

module.exports = Palette;

function Palette(){

  this._amount = 7;
  this.current = new Array(this._amount);

  for (var i = 0; i < this._amount; i++) {
    this.current[i] = new Color.RGBA(0, 0, 0, 1);
  }
}

for (var key in statics) Palette[key] = statics[key];

Palette.prototype.getColor = function(type) {
  
};


