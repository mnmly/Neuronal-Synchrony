var Sketch = require( 'sketch' )
  , Palette = require( 'palette' )
  , Router = require( 'router' )
  , Record = require( 'record' )
  , Suspension = require( 'suspension' )
  , Moon = require( 'moon' )
  , Prism = require( 'prism' )
 // , Clay = require( 'clay' )
  , Engine = require( 'engine' )
  , Squiggle = require( 'squiggle' )
  , Debug = require( 'debug' )
  , debug = Debug('neuronal:perform')
  

Debug.enable('*')

module.exports = Perform;

function Perform(){
  
  var width = 1280
    , height = 800
    , firstFrame = false
    , setup = this.setup.bind( this )
    , update = this.update.bind( this )
    , draw = this.draw.bind( this )
    , keyup = this.keyup.bind( this )
    , params = {
        setup: setup
      , update: update
      , draw: draw
      , keyup: keyup
      , width: width
      , height: height
    };

  this.app = Sketch.create( params );
  this.app.frameCount = 0;
     
  // this.record = new Record();
  
  this.router = new Router( this.app, 128, false );

  this.palette = new Palette();
  
  this.bg = this.palette.getColor( Palette.BACKGROUND );
  
  this.suspension = new Suspension( this.app, 500 );
  this.suspension.setColor( this.palette.getColor( Palette.WHITE ) );
  
  this.suspension1 = new Suspension( this.app, 1000 );
  this.suspension1.setColor( this.palette.getColor( Palette.WHITE ) );

  this.suspension2 = new Suspension( this.app, 750 );
  this.suspension2.setColor( this.palette.getColor( Palette.WHITE ) );

  this.engine = new Engine( this.router, width / 2, height / 2, width * 0.75, height / 2 );
  this.engine.setColor( this.palette.getColor( Palette.WHITE ) );
  this.engine.initialize();
  
  this.engineReverse = new Engine( this.router, width / 2, height / 2, -width * 0.75, height / 2 );
  this.engineReverse.setColor( this.palette.getColor( Palette.WHITE ) );
  this.engineReverse.initialize();
  
  this.moon = new Moon( this.app, 250 );
  this.moon.setColor( this.palette.getColor( Palette.FOREGROUND ) );

  this.prism = new Prism( this.app, 500 );
  this.prism.setColor( this.palette.getColor( Palette.BLACK ) );
  
  this.prism1 = new Prism( this.app, 500 );
  this.prism1.setColor( this.palette.getColor( Palette.BLACK ) );
  
  this.squiggle = new Squiggle( this.app, 500 );
  this.prism1.setColor( this.palette.getColor( Palette.HIGHLIGHT ) );
}



Perform.prototype.setup = function() {
  debug( 'setting up' );

}
Perform.prototype.keyup = function( e ) {
  var key = String.fromCharCode( e.keyCode );

  if ( !this.engineReverse.isPlaying() && key == 'e' || key == 'E' ) {

    var amp = this.router.getBand( this.router.depth / 4, false );
    this.engine.setAmount( map( amp, 0, 1, 1, 12 ) );
    if ( this.randomize ) {
      this.engine.setDimensions(random(this.app.width / 4, this.app.width), map(amp, 0, 1, this.app.height / 8, this.app.height));
    }
    this.engine.initialize();
    this.engine.play();
  
  } else if (!this.engine.isPlaying() && key == 'r' || key == 'R') {
    var amp = this.router.getBand( this.router.depth / 4, false );
    this.engineReverse.setAmount( map( amp, 0, 1, 1, 12 ) );
    if ( this.randomize ) {
      this.engine.setDimensions(random(this.app.width / 4, this.app.width), map(amp, 0, 1, this.app.height / 8, this.app.height));
    }
    this.engineReverse.initialize();
    this.engineReverse.play();

  } else if (key == 'm' || key == 'M') {
    
    if ( this.randomize ) {
      this.moon.setAngle( random( TWO_PI ) );
      this.moon.initialize();
    } else {
      this.moon.setAngle( 0 );
      this.moon.initialize();
    }
    this.moon.play();
  
  } else if (key == 's' || key == 'S') {

    var amp = this.router.getBand(this.router.depth - this.router.depth / 10, false);
    if ( this.randomize ) {
      this.suspension.setAmount(map(amp, 0, 1, 8, 32));
    }
    this.suspension.setTheta(random(TWO_PI));
    this.suspension.initialize();
    this.suspension.play();
  
  } else if (key == 'l' || key == 'L') {

    var amp = this.router.getBand( this.router.depth - this.router.depth / 4, false );
    this.prism1.setAmount( floor( map( amp, 0, 1, 3, 12) ) );
    this.prism1.play();
  
  } else if (key == 'p' || key == 'P') {

    var amp = this.router.getBand( this.router.depth - this.router.depth / 4, false );
    this.prism.setAmount( floor( map( amp, 0, 1, 3, 12) ) );
    this.prism.play();

  } else if (key == 'w' || key == 'W') {
    if ( this.randomize ) {
      this.squiggle.setAngle( this.random( TWO_PI ) );
    }
    this.squiggle.setRevolutions( random( 0.25, 6 ) );
    this.squiggle.setAmplitude( random( this.app.height / 8, this.app.height / 3 ) );
    this.squiggle.setDistance( random( this.app.width / 8, this.app.width / 2 ) );
    this.squiggle.initialize();
    this.squiggle.play();
  } 

};

Perform.prototype.draw = function(){
  
  if ( this.app ){
    this.app.fillStyle = this.bg.toString();
    this.app.fillRect(0, 0, this.app.width, this.app.height);
    
    // clay.render();  

    //this.engineReverse.render();
    // this.pinwheel.render();

    this.engine.render();
    this.engineReverse.render();
    this.moon.render();
    this.prism.render();
    this.prism1.render();
    this.squiggle.render();
    this.suspension.render();
    this.suspension1.render();
    this.suspension2.render();
  }
}

Perform.prototype.update = function() {
  if (this.app){

    this.app.frameCount++;
    this.router.update();
    this.palette.update();
    this.engine.update();
    this.engineReverse.update();

    this.prism.update();
    this.prism1.update();
    this.moon.update();
    this.squiggle.update();
    this.suspension.update();
    this.suspension1.update();
    this.suspension2.update();
  }

};

