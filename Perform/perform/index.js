var Sketch = require( 'sketch' )
  , Palette = require( 'palette' )
  , Router = require( 'router' )
  , Record = require( 'record' )
  , Suspension = require( 'suspension' )
  , Moon = require( 'moon' )
  , Prism = require( 'prism' )
  , Clay = require( 'clay' )
  , Engine = require( 'engine' )
  , Squiggle = require( 'squiggle' )
  , Pinwheel = require( 'pinwheel' )
  , Debug = require( 'debug' )
  , debug = Debug('neuronal:perform')
  

// Debug.enable('*')

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
  
  this.clay = new Clay( this.app, 500 );
  this.clay.setColor( this.palette.getColor( Palette.MIDDLE) );
  
  this.pinwheel = new Pinwheel( this.app, 1000);
  this.pinwheel.setColor( this.palette.getColor( Palette.ACCENT ) );
  
  this.squiggle = new Squiggle( this.app, 500 );
  this.squiggle.setColor( this.palette.getColor( Palette.HIGHLIGHT ) );
}



Perform.prototype.setup = function() {
  debug( 'setting up' );

}
Perform.prototype.keyup = function( e ) {
  var key = String.fromCharCode( e.keyCode )
    , width = this.app.width
    , height = this.app.height;

  debug( 'KEY PRESSED:', key );

  if ( !this.engineReverse.isPlaying() && key == 'e' || key == 'E' ) {

    var amp = this.router.getBand( this.router.depth / 4, false );
    this.engine.setAmount( map( amp, 0, 1, 1, 12 ) );
    if ( this.randomize ) {
      this.engine.setDimensions( random( width / 4, width), map(amp, 0, 1, height / 8, height) );
    }
    this.engine.initialize();
    this.engine.play();
  
  } else if ( !this.engine.isPlaying() && key == 'r' || key == 'R' ) {

    var amp = this.router.getBand( this.router.depth / 4, false );
    this.engineReverse.setAmount( map( amp, 0, 1, 1, 12 ) );
    if ( this.randomize ) {
      this.engine.setDimensions( random( width / 4, width), map( amp, 0, 1, height / 8, height ));
    }
    this.engineReverse.initialize();
    this.engineReverse.play();

  } else if ( key == 'm' || key == 'M' ) {
    
    if ( this.randomize ) {
      this.moon.setAngle( random( TWO_PI ) );
      this.moon.initialize();
    } else {
      this.moon.setAngle( 0 );
      this.moon.initialize();
    }
    this.moon.play();
  
  } else if (key == 'p' || key == 'P') {

    var amp = this.router.getBand( this.router.depth - this.router.depth / 4, false );
    this.prism.setAmount( floor( map( amp, 0, 1, 3, 12) ) );
    this.prism.play();
  
  } else if (key == 'l' || key == 'L') {

    var amp = this.router.getBand( this.router.depth - this.router.depth / 4, false );
    this.prism1.setAmount( floor( map( amp, 0, 1, 3, 12) ) );
    this.prism1.play();
  
  } else if (key == 's' || key == 'S') {

    var amp = this.router.getBand( this.router.depth - this.router.depth / 10, false );
    if ( this.randomize ) {
      this.suspension.setAmount( map( amp, 0, 1, 8, 32 ) );
    }
    this.suspension.setTheta( random( TWO_PI ) );
    this.suspension.initialize();
    this.suspension.play();
  
  } else if (key == 'd' || key == 'D') {

    var amp = this.router.getBand( this.router.depth - this.router.depth / 10, false );
    if ( this.randomize ) {
      this.suspension1.setAmount( map( amp, 0, 1, 8, 32 ) );
    }
    this.suspension1.setTheta( random( TWO_PI ) );
    this.suspension1.initialize();
    this.suspension1.play();
  
  } else if (key == 'a' || key == 'A') {
    var amp = this.router.getBand( this.router.depth - this.router.depth / 10, false);
    if ( this.randomize ) {
      this.suspension2.setAmount( map( amp, 0, 1, 8, 32 ) );
    }
    this.suspension2.setTheta( random( TWO_PI ) );
    this.suspension2.initialize();
    this.suspension2.play();
  
  } else if ( key =='c' || key == 'C' ) {

    this.clay.setAmount( floor( random( 8, 16 ) ) );
    var x, y, pos = random( 8 );
    if ( pos > 7 ) {
      // north
      x = width / 2;
      y = 0;
    } else if ( pos > 6 ) {
      // north-west
      x = 0;
      y = 0;
    } else if ( pos > 5 ) {
      // west
      x = 0;
      y = height / 2;
    } else if (pos > 4) {
      // south-west
      x = 0;
      y = height;
    } else if (pos > 3) {
      // south
      x = width / 2;
      y = height;
    }  else if (pos > 2) {
      // south-east
      x = width;
      y = height;
    } else if (pos > 1) {
      // east
      x = width;
      y = height / 2;
    } else {
      x = width;
      y = 0;
    }
    this.clay.setOrigin( x, y );
    this.clay.setImpact( random( width ), random( height ) );
    this.clay.initialize();
    this.clay.play();
  
  } else if (key == 'o' || key == 'O') {
    var amp = this.router.getBand( this.router.depth / 2, false );
    this.pinwheel.setAmount( map( amp, 0, 1, 4, 10 ) );
    if ( this.randomize ) {
      var startAngle = random( TWO_PI )
        , endAngle = random( startAngle, TWO_PI );
      this.pinwheel.setAngles( startAngle, endAngle );
    } else {
      this.pinwheel.setAngles( 0, TWO_PI );
    }
    this.pinwheel.setDrift( random( TWO_PI ) );
    this.pinwheel.initialize();
    this.pinwheel.play();
  
  } else if (key == 'w' || key == 'W') {
    if ( this.randomize ) {
      this.squiggle.setAngle( this.random( TWO_PI ) );
    }
    this.squiggle.setRevolutions( random( 0.25, 6 ) );
    this.squiggle.setAmplitude( random( this.app.height / 8, this.app.height / 3 ) );
    this.squiggle.setDistance( random( this.app.width / 8, this.app.width / 2 ) );
    this.squiggle.initialize();
    this.squiggle.play();

  } else if ( !isNaN( key ) ) {
    //      palette.choose((int) key);
    this.palette.next();
  }
  else if (key == 'y' || key == 'Y') {
    this.randomize = !this.randomize;
  }
  // this.record.add( key );
};

Perform.prototype.draw = function(){
  
  if ( this.app ){

    this.app.fillStyle = this.bg.toString();
    this.app.fillRect(0, 0, this.app.width, this.app.height);
    
    this.clay.render();  
    this.prism.render();
    this.prism1.render();

    this.engineReverse.render();
    this.moon.render();
    this.pinwheel.render();

    this.engine.render();
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

    this.clay.update();  
    this.prism.update();
    this.prism1.update();

    this.engineReverse.update();
    this.moon.update();
    this.pinwheel.update();

    this.engine.update();
    this.squiggle.update();
    this.suspension.update();
    this.suspension1.update();
    this.suspension2.update();

  }

};

