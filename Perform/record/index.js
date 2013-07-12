module.exports = Record;

function Record( app ) {
  this.app = app;
  this._lines = [];
}

Record.prototype.add = function( action ) {
  var string = this.app.frameCount + " " + action;
  this_lines.push( string );
};

Record.prototype.finalize = function() {
  this_endTime = new Date();
};
