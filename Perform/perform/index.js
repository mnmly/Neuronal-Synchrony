var Sketch = require('sketch')
  , Router = require('router')
  , Engine = require('engine')

module.exports = Perform;

function setup() {
  console.log( 'setting up' );
}

function Perform(){

  var width = 1280
    , height = 800;

  this.router = new Router(this, 128, false);
  this.engine = new Engine(this.router, width / 2, height / 2, -width * 0.75, height / 2);
  
  // this.engine.setColor();
  this.engine.initialize();

  Sketch.create({
      setup: setup
    , draw: function(){}
  });
}
