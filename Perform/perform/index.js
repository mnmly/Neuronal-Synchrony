var Sketch = require( 'sketch' )
  , Palette = require( 'palette' )
  , Router = require( 'router' )
  , Record = require( 'record' )
  , Suspension = require( 'suspension' )
  , Moon = require( 'moon' )
  , Prism = require( 'prism' )
 // , Clay = require( 'clay' )
  , Engine = require( 'engine' )

module.exports = Perform;

function Perform(){
  
  var width = 1280
    , height = 800
    , firstFrame = false
    , params = {
        setup: this.setup.bind( this )
      , update: this.update.bind( this )
      , draw: this.draw.bind( this )
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
  
  // this.clay = new Clay( this.app, 500 );
  // this.clay.setColor( this.palette.getColor( this.palette.MIDDLE ) );
  var self = this;
  setTimeout(function() {

    self.engine.play();
    self.suspension.play();
    self.suspension1.play();
    
  }, 1000)
}



Perform.prototype.setup = function() {
  console.log( 'setting up' );

}
Perform.prototype.update = function() {
  if (this.app){
    this.app.frameCount++;
    this.router.update();
    this.palette.update();
  }

};

Perform.prototype.draw = function(){
  
  if ( this.app ){
    this.fillStyle = this.bg.toString();
    this.app.fillRect(0, 0, this.app.width, this.app.height);
    
    // clay.render();  
    //this.prism.render();
    //this.prism1.render();

    //this.engineReverse.render();
    //this.moon.render();
    // this.pinwheel.render();

    this.engine.render();
    // this.squiggle.render();
    this.suspension.render();
    this.suspension1.render();
    this.suspension2.render();
  }
}
