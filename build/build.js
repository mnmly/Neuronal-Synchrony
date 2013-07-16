
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-vector/index.js", function(exports, require, module){

/**
 * Expose `Vector`.
 */

module.exports = Vector;

/**
 * Initialize a new `Vector` with x / y.
 *
 * @param {Number} x
 * @param {Number} y
 * @api public
 */

function Vector(x, y) {
  if (!(this instanceof Vector)) return new Vector(x, y);
  this.x = x;
  this.y = y;
}

/**
 * Return a negated vector.
 *
 * @return {Vector}
 * @api public
 */

Vector.prototype.negate = function(){
  return new Vector(-this.x, -this.y);
};

/**
 * Add x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.add = function(v){
  return new Vector(this.x + v.x, this.y + v.y);
};

/**
 * Sub x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.sub = function(v){
  return new Vector(this.x - v.x, this.y - v.y);
};

/**
 * Multiply x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.mul = function(v){
  return new Vector(this.x * v.x, this.y * v.y);
};

/**
 * Divide x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.div = function(v){
  return new Vector(this.x / v.x, this.y / v.y);
};

/**
 * Check if these vectors are the same.
 *
 * @param {Vector} p
 * @return {Boolean}
 * @api public
 */

Vector.prototype.equals = function(v){
  return this.x == v.x && this.y == v.y;
};

/**
 * Return a clone of this vector.
 *
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.clone = function(){
  return new Vector(this.x, this.y);
};

/**
 * Return angle in radians.
 *
 * @return {Number}
 * @api public
 */

Vector.prototype.angle = function(){
  return Math.atan2(this.x, this.y);
};

/**
 * Return angle in degrees.
 *
 * @return {Number}
 * @api public
 */

Vector.prototype.degrees = function(){
  return this.angle() * 180 / Math.PI;
};

/**
 * Return the distance between vectors.
 *
 * @param {Vector} v
 * @return {Number}
 * @api public
 */

Vector.prototype.distance = function(v){
  var x = this.x - v.x;
  var y = this.y - v.y;
  return Math.sqrt(x * x + y * y);
};

/**
 * Return the linear interpolation between vectors given a step point.
 *
 * @param {Vector} v
 * @param {Number} a
 * @return {Vector}
 * @api public
 */

Vector.prototype.interpolated = function(v, a){
  return new Vector(this.x * (1 - a) + v.x * a, this.y * (1 - a) + v.y * a);
};

/**
 * Return the middle position between vectors.
 *
 * @param {Vector} v
 * @return {Vector}
 * @api public
 */

Vector.prototype.middle = function(v){
  return this.interpolated(v, .5);
};

/**
 * Return "(x, y)" string representation.
 *
 * @return {String}
 * @api public
 */

Vector.prototype.toString = function(){
  return '(' + this.x + ', ' + this.y + ')';
};




});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-ease/index.js", function(exports, require, module){

exports.linear = function(n){
  return n;
};

exports.inQuad = function(n){
  return n * n;
};

exports.outQuad = function(n){
  return n * (2 - n);
};

exports.inOutQuad = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n;
  return - 0.5 * (--n * (n - 2) - 1);
};

exports.inCube = function(n){
  return n * n * n;
};

exports.outCube = function(n){
  return --n * n * n + 1;
};

exports.inOutCube = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n * n;
  return 0.5 * ((n -= 2 ) * n * n + 2);
};

exports.inQuart = function(n){
  return n * n * n * n;
};

exports.outQuart = function(n){
  return 1 - (--n * n * n * n);
};

exports.inOutQuart = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n * n * n;
  return -0.5 * ((n -= 2) * n * n * n - 2);
};

exports.inQuint = function(n){
  return n * n * n * n * n;
}

exports.outQuint = function(n){
  return --n * n * n * n * n + 1;
}

exports.inOutQuint = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n * n * n * n;
  return 0.5 * ((n -= 2) * n * n * n * n + 2);
};

exports.inSine = function(n){
  return 1 - Math.cos(n * Math.PI / 2 );
};

exports.outSine = function(n){
  return Math.sin(n * Math.PI / 2);
};

exports.inOutSine = function(n){
  return .5 * (1 - Math.cos(Math.PI * n));
};

exports.inExpo = function(n){
  return 0 == n ? 0 : Math.pow(1024, n - 1);
};

exports.outExpo = function(n){
  return 1 == n ? n : 1 - Math.pow(2, -10 * n);
};

exports.inOutExpo = function(n){
  if (0 == n) return 0;
  if (1 == n) return 1;
  if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
  return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
};

exports.inCirc = function(n){
  return 1 - Math.sqrt(1 - n * n);
};

exports.outCirc = function(n){
  return Math.sqrt(1 - (--n * n));
};

exports.inOutCirc = function(n){
  n *= 2
  if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
  return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
};

exports.inBack = function(n){
  var s = 1.70158;
  return n * n * (( s + 1 ) * n - s);
};

exports.outBack = function(n){
  var s = 1.70158;
  return --n * n * ((s + 1) * n + s) + 1;
};

exports.inOutBack = function(n){
  var s = 1.70158 * 1.525;
  if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );
  return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );
};

exports.inBounce = function(n){
  return 1 - exports.outBounce(1 - n);
};

exports.outBounce = function(n){
  if ( n < ( 1 / 2.75 ) ) {
    return 7.5625 * n * n;
  } else if ( n < ( 2 / 2.75 ) ) {
    return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
  } else if ( n < ( 2.5 / 2.75 ) ) {
    return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
  } else {
    return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
  }
};

exports.inOutBounce = function(n){
  if (n < .5) return exports.inBounce(n * 2) * .5;
  return exports.outBounce(n * 2 - 1) * .5 + .5;
};

// aliases

exports['in-quad'] = exports.inQuad;
exports['out-quad'] = exports.outQuad;
exports['in-out-quad'] = exports.inOutQuad;
exports['in-cube'] = exports.inCube;
exports['out-cube'] = exports.outCube;
exports['in-out-cube'] = exports.inOutCube;
exports['in-quart'] = exports.inQuart;
exports['out-quart'] = exports.outQuart;
exports['in-out-quart'] = exports.inOutQuart;
exports['in-quint'] = exports.inQuint;
exports['out-quint'] = exports.outQuint;
exports['in-out-quint'] = exports.inOutQuint;
exports['in-sine'] = exports.inSine;
exports['out-sine'] = exports.outSine;
exports['in-out-sine'] = exports.inOutSine;
exports['in-expo'] = exports.inExpo;
exports['out-expo'] = exports.outExpo;
exports['in-out-expo'] = exports.inOutExpo;
exports['in-circ'] = exports.inCirc;
exports['out-circ'] = exports.outCirc;
exports['in-out-circ'] = exports.inOutCirc;
exports['in-back'] = exports.inBack;
exports['out-back'] = exports.outBack;
exports['in-out-back'] = exports.inOutBack;
exports['in-bounce'] = exports.inBounce;
exports['out-bounce'] = exports.outBounce;
exports['in-out-bounce'] = exports.inOutBounce;

});
require.register("component-tween/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('emitter')
  , ease = require('ease');

/**
 * Expose `Tween`.
 */

module.exports = Tween;

/**
 * Initialize a new `Tween` with `obj`.
 *
 * @param {Object|Array} obj
 * @api public
 */

function Tween(obj) {
  if (!(this instanceof Tween)) return new Tween(obj);
  this._from = obj;
  this.ease('linear');
  this.duration(500);
}

/**
 * Mixin emitter.
 */

Emitter(Tween.prototype);

/**
 * Reset the tween.
 *
 * @api public
 */

Tween.prototype.reset = function(){
  this.isArray = Array.isArray(this._from);
  this._curr = clone(this._from);
  this._done = false;
  this._start = Date.now();
  return this;
};

/**
 * Tween to `obj` and reset internal state.
 *
 *    tween.to({ x: 50, y: 100 })
 *
 * @param {Object|Array} obj
 * @return {Tween} self
 * @api public
 */

Tween.prototype.to = function(obj){
  this.reset();
  this._to = obj;
  return this;
};

/**
 * Set duration to `ms` [500].
 *
 * @param {Number} ms
 * @return {Tween} self
 * @api public
 */

Tween.prototype.duration = function(ms){
  this._duration = ms;
  return this;
};

/**
 * Set easing function to `fn`.
 *
 *    tween.ease('in-out-sine')
 *
 * @param {String|Function} fn
 * @return {Tween}
 * @api public
 */

Tween.prototype.ease = function(fn){
  fn = 'function' == typeof fn ? fn : ease[fn];
  if (!fn) throw new TypeError('invalid easing function');
  this._ease = fn;
  return this;
};

/**
 * Stop the tween and immediately emit "stop" and "end".
 *
 * @return {Tween}
 * @api public
 */

Tween.prototype.stop = function(){
  this.stopped = true;
  this._done = true;
  this.emit('stop');
  this.emit('end');
  return this;
};

/**
 * Perform a step.
 *
 * @return {Tween} self
 * @api private
 */

Tween.prototype.step = function(){
  if (this._done) return;

  // duration
  var duration = this._duration;
  var now = Date.now();
  var delta = now - this._start;
  var done = delta >= duration;

  // complete
  if (done) {
    this._from = this._to;
    this._update(this._to);
    this._done = true;
    this.emit('end');
    return this;
  }

  // tween
  var from = this._from;
  var to = this._to;
  var curr = this._curr;
  var fn = this._ease;
  var p = (now - this._start) / duration;
  var n = fn(p);

  // array
  if (this.isArray) {
    for (var i = 0; i < from.length; ++i) {
      curr[i] = from[i] + (to[i] - from[i]) * n;
    }

    this._update(curr);
    return this;
  }

  // objech
  for (var k in from) {
    curr[k] = from[k] + (to[k] - from[k]) * n;
  }

  this._update(curr);
  return this;
};

/**
 * Set update function to `fn` or
 * when no argument is given this performs
 * a "step".
 *
 * @param {Function} fn
 * @return {Tween} self
 * @api public
 */

Tween.prototype.update = function(fn){
  if (0 == arguments.length) return this.step();
  this._update = fn;
  return this;
};

/**
 * Clone `obj`.
 *
 * @api private
 */

function clone(obj) {
  if (Array.isArray(obj)) return obj.slice();
  var ret = {};
  for (var key in obj) ret[key] = obj[key];
  return ret;
}

});
require.register("visionmedia-debug/index.js", function(exports, require, module){
if ('undefined' == typeof window) {
  module.exports = require('./lib/debug');
} else {
  module.exports = require('./debug');
}

});
require.register("visionmedia-debug/debug.js", function(exports, require, module){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

if (window.localStorage) debug.enable(localStorage.debug);

});
require.register("component-autoscale-canvas/index.js", function(exports, require, module){

/**
 * Retina-enable the given `canvas`.
 *
 * @param {Canvas} canvas
 * @return {Canvas}
 * @api public
 */

module.exports = function(canvas){
  var ctx = canvas.getContext('2d');
  var ratio = window.devicePixelRatio || 1;
  if (1 != ratio) {
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= ratio;
    canvas.height *= ratio;
    ctx.scale(ratio, ratio);
  }
  return canvas;
};
});
require.register("mnmly-sketch.js/js/sketch.js", function(exports, require, module){

/* Copyright (C) 2013 Justin Windle, http://soulwire.co.uk */

var Sketch = (function() {

    "use strict";

    /*
    ----------------------------------------------------------------------

        Config

    ----------------------------------------------------------------------
    */

    var MATH_PROPS = 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split( ' ' );
    var HAS_SKETCH = '__hasSketch';
    var M = Math;

    var CANVAS = 'canvas';
    var WEBGL = 'webgl';
    var DOM = 'dom';

    var doc = document;
    var win = window;

    var instances = [];

    var defaults = {

        fullscreen: true,
        autostart: true,
        autoclear: true,
        autopause: true,
        container: doc.body,
        interval: 1,
        globals: true,
        retina: false,
        type: CANVAS
    };

    var keyMap = {

         8: 'BACKSPACE',
         9: 'TAB',
        13: 'ENTER',
        16: 'SHIFT',
        27: 'ESCAPE',
        32: 'SPACE',
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN'
    };

    /*
    ----------------------------------------------------------------------

        Utilities

    ----------------------------------------------------------------------
    */

    function isArray( object ) {

        return Object.prototype.toString.call( object ) == '[object Array]';
    }

    function isFunction( object ) {

        return typeof object == 'function';
    }

    function isNumber( object ) {

        return typeof object == 'number';
    }

    function isString( object ) {

        return typeof object == 'string';
    }

    function keyName( code ) {

        return keyMap[ code ] || String.fromCharCode( code );
    }

    function extend( target, source, overwrite ) {

        for ( var key in source )

            if ( overwrite || !target.hasOwnProperty( key ) )

                target[ key ] = source[ key ];

        return target;
    }

    function proxy( method, context ) {

        return function() {

            method.apply( context, arguments );
        };
    }

    function clone( target ) {

        var object = {};

        for ( var key in target ) {

            if ( isFunction( target[ key ] ) )

                object[ key ] = proxy( target[ key ], target );

            else

                object[ key ] = target[ key ];
        }

        return object;
    }

    /*
    ----------------------------------------------------------------------

        Constructor

    ----------------------------------------------------------------------
    */

    function constructor( context ) {

        var request, handler, target, parent, bounds, index, suffix, clock, node, copy, type, key, val, min, max;

        var counter = 0;
        var touches = [];
        var setup = false;
        var ratio = win.devicePixelRatio;
        var isDiv = context.type == DOM;
        var is2D = context.type == CANVAS;

        var mouse = {
            x:  0.0, y:  0.0,
            ox: 0.0, oy: 0.0,
            dx: 0.0, dy: 0.0
        };

        var eventMap = [

            context.element,

                pointer, 'mousedown', 'touchstart',
                pointer, 'mousemove', 'touchmove',
                pointer, 'mouseup', 'touchend',
                pointer, 'click',

            doc,

                keypress, 'keydown', 'keyup',

            win,

                active, 'focus', 'blur',
                resize, 'resize'
        ];

        var keys = {}; for ( key in keyMap ) keys[ keyMap[ key ] ] = false;

        function trigger( method ) {

            if ( isFunction( method ) )

                method.apply( context, [].splice.call( arguments, 1 ) );
        }

        function bind( on ) {

            for ( index = 0; index < eventMap.length; index++ ) {

                node = eventMap[ index ];

                if ( isString( node ) )

                    target[ ( on ? 'add' : 'remove' ) + 'EventListener' ].call( target, node, handler, false );

                else if ( isFunction( node ) )

                    handler = node;

                else target = node;
            }
        }

        function update() {

            cAF( request );
            request = rAF( update );

            if ( !setup ) {

                trigger( context.setup );
                setup = isFunction( context.setup );
                trigger( context.resize );
            }

            if ( context.running && !counter ) {

                context.dt = ( clock = +new Date() ) - context.now;
                context.millis += context.dt;
                context.now = clock;

                trigger( context.update );

                if ( context.autoclear && is2D )

                    context.clear();

                trigger( context.draw );
            }

            counter = ++counter % context.interval;
        }

        function resize() {

            target = isDiv ? context.style : context.canvas;
            suffix = isDiv ? 'px' : '';

            if ( context.fullscreen ) {

                context.height = win.innerHeight;
                context.width = win.innerWidth;
            }

            target.height = context.height + suffix;
            target.width = context.width + suffix;

            if ( context.retina && is2D && ratio ) {

                target.height = context.height * ratio;
                target.width = context.width * ratio;

                target.style.height = context.height + 'px';
                target.style.width = context.width + 'px';

                context.scale( ratio, ratio );
            }

            if ( setup ) trigger( context.resize );
        }

        function align( touch, target ) {

            bounds = target.getBoundingClientRect();

            touch.x = touch.pageX - bounds.left - win.scrollX;
            touch.y = touch.pageY - bounds.top - win.scrollY;

            return touch;
        }

        function augment( touch, target ) {

            align( touch, context.element );

            target = target || {};

            target.ox = target.x || touch.x;
            target.oy = target.y || touch.y;

            target.x = touch.x;
            target.y = touch.y;

            target.dx = target.x - target.ox;
            target.dy = target.y - target.oy;

            return target;
        }

        function process( event ) {

            event.preventDefault();

            copy = clone( event );
            copy.originalEvent = event;

            if ( copy.touches ) {

                touches.length = copy.touches.length;

                for ( index = 0; index < copy.touches.length; index++ )

                    touches[ index ] = augment( copy.touches[ index ], touches[ index ] );

            } else {

                touches.length = 0;
                touches[0] = augment( copy, mouse );
            }

            extend( mouse, touches[0], true );

            return copy;
        }

        function pointer( event ) {

            event = process( event );

            min = ( max = eventMap.indexOf( type = event.type ) ) - 1;

            context.dragging =

                /down|start/.test( type ) ? true :

                /up|end/.test( type ) ? false :

                context.dragging;

            while( min )

                isString( eventMap[ min ] ) ?

                    trigger( context[ eventMap[ min-- ] ], event ) :

                isString( eventMap[ max ] ) ?

                    trigger( context[ eventMap[ max++ ] ], event ) :

                min = 0;
        }

        function keypress( event ) {

            key = event.keyCode;
            val = event.type == 'keyup';
            keys[ key ] = keys[ keyName( key ) ] = !val;

            trigger( context[ event.type ], event );
        }

        function active( event ) {

            if ( context.autopause )

                ( event.type == 'blur' ? stop : start )();

            trigger( context[ event.type ], event );
        }

        // Public API

        function start() {

            context.now = +new Date();
            context.running = true;
        }

        function stop() {

            context.running = false;
        }

        function toggle() {

            ( context.running ? stop : start )();
        }

        function clear() {

            if ( is2D )

                context.clearRect( 0, 0, context.width, context.height );
        }

        function destroy() {

            parent = context.element.parentNode;
            index = instances.indexOf( context );

            if ( parent ) parent.removeChild( context.element );
            if ( ~index ) instances.splice( index, 1 );

            bind( false );
            stop();
        }

        extend( context, {

            touches: touches,
            mouse: mouse,
            keys: keys,

            dragging: false,
            running: false,
            millis: 0,
            now: NaN,
            dt: NaN,

            destroy: destroy,
            toggle: toggle,
            clear: clear,
            start: start,
            stop: stop
        });

        instances.push( context );

        return ( context.autostart && start(), bind( true ), resize(), update(), context );
    }

    /*
    ----------------------------------------------------------------------

        Global API

    ----------------------------------------------------------------------
    */

    var element, context, Sketch = {

        CANVAS: CANVAS,
        WEB_GL: WEBGL,
        WEBGL: WEBGL,
        DOM: DOM,

        instances: instances,

        install: function( context ) {

            if ( !context[ HAS_SKETCH ] ) {

                for ( var i = 0; i < MATH_PROPS.length; i++ )

                    context[ MATH_PROPS[i] ] = M[ MATH_PROPS[i] ];

                extend( context, {

                    TWO_PI: M.PI * 2,
                    HALF_PI: M.PI / 2,
                    QUATER_PI: M.PI / 4,

                    random: function( min, max ) {

                        if ( isArray( min ) )

                            return min[ ~~( M.random() * min.length ) ];

                        if ( !isNumber( max ) )

                            max = min || 1, min = 0;

                        return min + M.random() * ( max - min );
                    },

                    lerp: function( min, max, amount ) {

                        return min + amount * ( max - min );
                    },

                    map: function( num, minA, maxA, minB, maxB ) {

                        return ( num - minA ) / ( maxA - minA ) * ( maxB - minB ) + minB;
                    }
                });

                context[ HAS_SKETCH ] = true;
            }
        },

        create: function( options ) {

            options = extend( options || {}, defaults );

            if ( options.globals ) Sketch.install( self );

            element = options.element = options.element || doc.createElement( options.type === DOM ? 'div' : 'canvas' );

            context = options.context = options.context || (function() {

                switch( options.type ) {

                    case CANVAS:

                        return element.getContext( '2d', options );

                    case WEBGL:

                        return element.getContext( 'webgl', options ) || element.getContext( 'experimental-webgl', options );

                    case DOM:

                        return element.canvas = element;
                }

            })();

            options.container.appendChild( element );

            return Sketch.augment( context, options );
        },

        augment: function( context, options ) {

            options = extend( options || {}, defaults );

            options.element = context.canvas || context;
            options.element.className += ' sketch';

            extend( context, options, true );

            return constructor( context );
        }
    };

    /*
    ----------------------------------------------------------------------

        Shims

    ----------------------------------------------------------------------
    */

    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
    var scope = self;
    var then = 0;

    var a = 'AnimationFrame';
    var b = 'request' + a;
    var c = 'cancel' + a;

    var rAF = scope[ b ];
    var cAF = scope[ c ];

    for ( var i = 0; i < vendors.length && !rAF; i++ ) {

        rAF = scope[ vendors[ i ] + 'Request' + a ];
        cAF = scope[ vendors[ i ] + 'Cancel' + b ];
    }

    scope[ b ] = rAF = rAF || function( callback ) {

        var now = +new Date();
        var dt = M.max( 0, 16 - ( now - then ) );
        var id = setTimeout( function() {
            callback( now + dt );
        }, dt );

        then = now + dt;
        return id;
    };

    scope[ c ] = cAF = cAF || function( id ) {
        clearTimeout( id );
    };

    /*
    ----------------------------------------------------------------------

        Output

    ----------------------------------------------------------------------
    */

    return Sketch;

})();

module.exports = Sketch;


});
require.register("record/index.js", function(exports, require, module){
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

});
require.register("component-inherit/index.js", function(exports, require, module){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
});
require.register("component-color/index.js", function(exports, require, module){

exports.RGBA = require('./RGBA');
exports.HSLA = require('./HSLA');
exports.rgba = exports.RGBA;
exports.hsla = exports.HSLA;
});
require.register("component-color/RGBA.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var HSLA = require('./HSLA');

/**
 * Expose `HSLA`.
 */

exports = module.exports = RGBA;

/**
 * Initialize a new `RGBA` with the given r,g,b,a component values.
 *
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 * @api public
 */

function RGBA(r,g,b,a){
  if (!(this instanceof RGBA)) return new RGBA(r,g,b,a);
  this.r = clamp(r);
  this.g = clamp(g);
  this.b = clamp(b);
  this.a = clampAlpha(a);
  this.rgba = this;
}

/**
 * Convert to RGBA (return self).
 *
 * @return {RGBA}
 * @api public
 */

RGBA.prototype.toRGBA = function(){
  return this;
};

/**
 * Convert to HSLA.
 *
 * @return {HSLA}
 * @api public
 */

RGBA.prototype.toHSLA = function(){
  return HSLA.fromRGBA(this);
};

/**
 * Return #nnnnnn, #nnn, or rgba(n,n,n,n) string representation of the color.
 *
 * @return {String}
 * @api public
 */

RGBA.prototype.toString = function(){
  if (1 == this.a) {
    var r = pad(this.r);
    var g = pad(this.g);
    var b = pad(this.b);

    // Compress
    if (r[0] == r[1] && g[0] == g[1] && b[0] == b[1]) {
      return '#' + r[0] + g[0] + b[0];
    } else {
      return '#' + r + g + b;
    }
  } else {
    return 'rgba('
      + this.r + ','
      + this.g + ','
      + this.b + ','
      + (+this.a.toFixed(3)) + ')';
  }
};

/**
 * Return a `RGBA` from the given `hsla`.
 *
 * @param {HSLA} hsla
 * @return {RGBA}
 * @api public
 */

exports.fromHSLA = function(hsla){
  var h = hsla.h / 360
    , s = hsla.s / 100
    , l = hsla.l / 100
    , a = hsla.a;

  var m2 = l <= .5 ? l * (s + 1) : l + s - l * s
    , m1 = l * 2 - m2;

  var r = hue(h + 1/3) * 0xff
    , g = hue(h) * 0xff
    , b = hue(h - 1/3) * 0xff;

  function hue(h) {
    if (h < 0) ++h;
    if (h > 1) --h;
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
    return m1;
  }
  
  return new RGBA(r,g,b,a);
};

/**
 * Clamp `n` >= 0 and <= 255.
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function clamp(n) {
  return Math.max(0, Math.min(n.toFixed(0), 255));
}

/**
 * Clamp alpha `n` >= 0 and <= 1.
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function clampAlpha(n) {
  return Math.max(0, Math.min(n, 1));
}

/**
 * Pad `n` hex representation.
 *
 * @param {Number} n
 * @return {String}
 * @api public
 */

function pad(n) {
  return n < 16
    ? '0' + n.toString(16)
    : n.toString(16);
}
});
require.register("component-color/HSLA.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var RGBA = require('./RGBA');

/**
 * Expose `HSLA`.
 */

exports = module.exports = HSLA;

/**
 * Initialize a new `HSLA` with the given h,s,l,a component values.
 *
 * @param {Number} h
 * @param {Number} s
 * @param {Number} l
 * @param {Number} a
 * @api public
 */

function HSLA(h,s,l,a){
  if (!(this instanceof HSLA)) return new HSLA(h,s,l,a);
  this.h = clampDegrees(h);
  this.s = clampPercentage(s);
  this.l = clampPercentage(l);
  this.a = clampAlpha(a);
  this.hsla = this;
}

/**
 * Convert to HSLA (return self).
 *
 * @return {HSLA}
 * @api public
 */

HSLA.prototype.toHSLA = function(){
  return this;
};

/**
 * Convert to RGBA.
 *
 * @return {RGBA}
 * @api public
 */

HSLA.prototype.toRGBA = function(){
  return RGBA.fromHSLA(this);
};

/**
 * Return hsla(n,n,n,n).
 *
 * @return {String}
 * @api public
 */

HSLA.prototype.toString = function(){
  return 'hsla('
    + this.h + ','
    + this.s.toFixed(0) + ','
    + this.l.toFixed(0) + ','
    + this.a + ')';
};

/**
 * Return `HSLA` representation of the given `color`.
 *
 * @param {RGBA} color
 * @return {HSLA}
 * @api public
 */

exports.fromRGBA = function(rgba){
  var r = rgba.r / 255
    , g = rgba.g / 255
    , b = rgba.b / 255
    , a = rgba.a;

  var min = Math.min(r,g,b)
    , max = Math.max(r,g,b)
    , l = (max + min) / 2
    , d = max - min
    , h, s;

  switch (max) {
    case min: h = 0; break;
    case r: h = 60 * (g-b) / d; break;
    case g: h = 60 * (b-r) / d + 120; break;
    case b: h = 60 * (r-g) / d + 240; break;
  }

  if (max == min) {
    s = 0;
  } else if (l < .5) {
    s = d / (2 * l);
  } else {
    s = d / (2 - 2 * l);
  }

  h %= 360;
  s *= 100;
  l *= 100;

  return new HSLA(h,s,l,a);
};

/**
 * Adjust lightness by `percent`.
 *
 * @param {Number} percent
 * @return {HSLA}
 * @api public
 */

HSLA.prototype.adjustLightness = function(percent){
  this.l = clampPercentage(this.l + this.l * (percent / 100));
  return this;
};

/**
 * Adjust hue by `deg`.
 *
 * @param {Number} deg
 * @return {HSLA}
 * @api public
 */

HSLA.prototype.adjustHue = function(deg){
  this.h = clampDegrees(this.h + deg);
  return this;
};

/**
 * Clamp degree `n` >= 0 and <= 360.
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function clampDegrees(n) {
  n = n % 360;
  return n >= 0 ? n : 360 + n;
}

/**
 * Clamp percentage `n` >= 0 and <= 100.
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function clampPercentage(n) {
  return Math.max(0, Math.min(n, 100));
}

/**
 * Clamp alpha `n` >= 0 and <= 1.
 *
 * @param {Number} n
 * @return {Number}
 * @api private
 */

function clampAlpha(n) {
  return Math.max(0, Math.min(n, 1));
}

});
require.register("neuron/index.js", function(exports, require, module){
var Color = require('color');

module.exports = Neuron;

function Neuron( app ){
  this._app = app;
  this._tweens = [];
  this.pigment = Color.RGBA(0, 0, 0, 1);
  this.duration = 0.15;
  this.delay = 0;
  this.easing = 'out-circ';
  this.playing = false;
  this._removeTween = this._removeTween.bind( this );
}

Neuron.prototype.setColor = function(color ) {
  this.pigment = color;
};

Neuron.prototype.setDuration = function(duration) {
  this.duration = duration;
};

Neuron.prototype.setDelay = function(delay) {
  this.delay = delay;
};

Neuron.prototype.setEasing = function(easing) {
  this.easing = easing;
};

Neuron.prototype.getColor = function() {
  return this.pigment;
};

Neuron.prototype.getDuration = function() {
  return this.duration;
};

Neuron.prototype.getDelay = function() {
  return this.getDelay;
};

Neuron.prototype.getEasing = function() {
  return this.easing;
};

Neuron.prototype.getStageSize = function() {
  return {
      width: 1000
    , height: 1000
  }
};

Neuron.prototype.update = function() {

  this._tweens.forEach( function( tween ){
    tween.update();
  } );


};

Neuron.prototype._removeTween = function( tween ) {
  var index = this._tweens.indexOf( tween );
  this._tweens.splice( index, 1 );
};

});
require.register("moon/index.js", function(exports, require, module){
var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Moon;

function Moon( app, duration ){
  
  Neuron.apply( this, arguments );

  this._amount = 40;

  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.r = this._app.height / 3;
  this._slave = 0;
  this._startAngle = 0.0;
  this.setDuration( duration );
  this.initialize();
}

inherit( Moon, Neuron );

Moon.prototype.setAngle = function( angle ) {

  this._startAngle = angle;

};


Moon.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this.__points = new Array( this._amount );
  this._points = new Array( this._amount );
  this.reset();

};

Moon.prototype.play = function() {

  if ( this.playing ) return;

  this.animate_in();
  
};


Moon.prototype.animate_in = function( ) {
  
  var self = this;

  this.playing = true;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }

  for ( var i = 0; i < this._amount; i += 1 ) {
    var pos = this._points[i]
      , ref = this.__points[i]
      , from = { x: pos.x, y: pos.y }
      , to = { x: ref.x, y: ref.y }
      , tween = Tween( from )
              .to( to )
              .duration( this.duration )
              .ease( this.easing )
              .update( update(pos) )
              .on( 'end', function() {
                self._removeTween( this );
              } );

    this._tweens.push( tween );
  }
  
  var lastTween = Tween({ slave: this._slave })
    .to( { slave: 0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._slave = o.slave;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_out();
    })

  this._tweens.push( lastTween );
};


Moon.prototype.animate_out = function() {
  
  var self = this;

  this.playing = true;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }
  
  var l = ceil( this._amount / 2 )
  for ( var i = 0; i < l; i += 1 ) {
    var index = 0 === i ? 0 : this._amount - i
    var pos = this._points[i]
      , ref = this.__points[index]
      , from = { x: pos.x, y: pos.y }
      , to = { x: ref.x, y: ref.y }
      , tween = Tween( from )
              .to( to )
              .duration( this.duration )
              .ease( this.easing )
              .update( update(pos) )
              .on( 'end', function() {
                self._removeTween( this );
              } );

    this._tweens.push( tween );
  }
  
  var lastTween = Tween({ slave: this._slave })
    .to( { slave: 0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._slave = o.slave;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_end();
    })

  this._tweens.push( lastTween );
};


Moon.prototype.animate_end = function() {
    
  this.playing = false;
  this.reset();

};


Moon.prototype.reset = function() {
  
  for ( var i = 0; i < this._amount; i += 1 ) {

    var theta = ( i / this._amount ) * TWO_PI + this._startAngle
      , xpos = this.r * cos( theta ) + this.x
      , ypos = this.r * sin( theta ) + this.y;

    this.__points[i] = new Vector( xpos, ypos );
    if ( i <= this._amount / 2 ) {
      var ref = this.__points[i];
      this._points[i] = new Vector( ref.x, ref.y );
    } else {
      var ref = this.__points[this._amount - i];
      this._points[i] = new Vector( ref.x, ref.y );
    }
  }
};


Moon.prototype.render = function() {
  
  if ( !this.playing ) return;

  // noStroke
  this._app.fillStyle = this.pigment.toString();
  
  this._app.beginPath();
  
  for ( var i = 0; i < this._amount; i += 1 ) {

    var pos = this._points[i];

    if (i === 0) {
      this._app.moveTo( pos.x, pos.y );
    } else {
      this._app.lineTo( pos.x, pos.y );
    }
    
  }

  this._app.closePath();
  this._app.fill();
};

});
require.register("prism/index.js", function(exports, require, module){
var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Prism;

function Prism( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.distance = this._app.width;
  this.setDuration( duration );
  
  this._amount = 3;
  this._offset = - PI / 2;

  this._magnitude = 0.0;
  this._m = 50.0;

  this.initialize();
}

inherit( Prism, Neuron );

Prism.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;
  
  this._amount = amount;
  this.initialize();

};

Prism.prototype.setMagnitude = function( magnitude ) {

  if ( this.playing ) return;
  
  this._m = magnitude;
};


Prism.prototype.getAmount = function( ) {
  return this._amount;
};

Prism.prototype.play = function() {
  
  if( this.playing ) return;

  this._animate_in();

};

Prism.prototype._animate_in = function( ) {
  
  var self = this;

  this.playing = true;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }

  for ( var i = 0; i < this._amount; i += 1 ) {
    var pos = this._points[i]
      , ref = this.__points[i]
      , from = { x: pos.x, y: pos.y }
      , to = { x: ref.x, y: ref.y }
      , tween = Tween( from )
              .to( to )
              .duration( this.duration )
              .ease( this.easing )
              .update( update(pos) )
              .on( 'end', function() {
                self._removeTween( this );
              } );

    this._tweens.push( tween );
  }
  
  var lastTween = Tween({ magnitude: this._magnitude })
    .to( { magnitude: this._m } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._magnitude = o.magnitude;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_end();
    })

  this._tweens.push( lastTween );
};


Prism.prototype.animate_end = function() {
  this.reset();
  this.playing = false;

};


Prism.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this.__points = new Array( this._amount );
  this._points = new Array( this._amount );
  this.reset();

};


Prism.prototype.reset = function() {
  
  this._magnitude = 0.0;

  for ( var i = 0; i < this._amount; i += 1 ) {

    var pct = ( i + 1 ) / this._amount
      , theta = pct * TWO_PI + this._offset
      , _x = cos( theta )
      , _y = sin( theta )
    
    this._points[i] = new Vector( this.x, this.y );
    this.__points[i] = new Vector( this.distance * _x + this.x, this.distance * _y + this.y );

  }

};


Prism.prototype.render = function() {
  
  if ( !this.playing ) return;

  this._app.strokeStyle = this.pigment.toString();
  this._app.lineWidth = 1;

  // noFill
  this._app.fillStyle = 'rgba(0, 0, 0, 0)';
  this._app.beginPath();
  for ( var i = 0; i < this._amount; i += 1 ) {

    var pos = this._points[i];

    if (i === 0) {
      this._app.moveTo( pos.x, pos.y );
    } else {
      this._app.lineTo( pos.x, pos.y );
    }
    
  }
  this._app.closePath();
  this._app.stroke();

  // this._app.lineWidth = 0;
  this._app.fillStyle = this.pigment.toString();
  this._app.beginPath();
  for ( var i = 0; i < this._amount; i += 1 ) {
    var pos = this._points[i];
    this._app.moveTo( pos.x, pos.y );
    this._app.arc( pos.x, pos.y, this._magnitude / 2, 0, TWO_PI, true );
  }
  this._app.closePath();
  this._app.fill();

};

});
require.register("mnmly-vector/index.js", function(exports, require, module){

/**
 * Expose `Vector`.
 */

module.exports = Vector;

/**
 * Initialize a new `Vector` with x / y.
 *
 * @param {Number} x
 * @param {Number} y
 * @api public
 */

function Vector(x, y) {
  if (!(this instanceof Vector)) return new Vector(x, y);
  this.x = x;
  this.y = y;
}

/**
 * Return a negated vector.
 *
 * @return {Vector}
 * @api public
 */

Vector.prototype.negate = function(){
  return new Vector(-this.x, -this.y);
};

/**
 * Add x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.add = function(v){
  return new Vector(this.x + v.x, this.y + v.y);
};

/**
 * Sub x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.sub = function(v){
  return new Vector(this.x - v.x, this.y - v.y);
};

/**
 * Multiply x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.mul = function(v){
  return new Vector(this.x * v.x, this.y * v.y);
};

/**
 * Divide x / y.
 *
 * @param {Vector} p
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.div = function(v){
  return new Vector(this.x / v.x, this.y / v.y);
};

/**
 * Check if these vectors are the same.
 *
 * @param {Vector} p
 * @return {Boolean}
 * @api public
 */

Vector.prototype.equals = function(v){
  return this.x == v.x && this.y == v.y;
};

/**
 * Return a clone of this vector.
 *
 * @return {Vector} new vector
 * @api public
 */

Vector.prototype.clone = function(){
  return new Vector(this.x, this.y);
};

/**
 * Return angle in radians.
 *
 * @return {Number}
 * @api public
 */

Vector.prototype.angle = function(){
  return Math.atan2(this.x, this.y);
};

/**
 * Return angle in degrees.
 *
 * @return {Number}
 * @api public
 */

Vector.prototype.degrees = function(){
  return this.angle() * 180 / Math.PI;
};

/**
 * Return the distance between vectors.
 *
 * @param {Vector} v
 * @return {Number}
 * @api public
 */

Vector.prototype.distance = function(v){
  var x = this.x - v.x;
  var y = this.y - v.y;
  return Math.sqrt(x * x + y * y);
};

/**
 * Return the magnitude of this vector.
 *
 * @return {Number}
 * @api public
 */

Vector.prototype.magnitude = function(){
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Return the linear interpolation between vectors given a step point.
 *
 * @param {Vector} v
 * @param {Number} a
 * @return {Vector}
 * @api public
 */

Vector.prototype.interpolated = function(v, a){
  return new Vector(this.x * (1 - a) + v.x * a, this.y * (1 - a) + v.y * a);
};

/**
 * Return the middle position between vectors.
 *
 * @param {Vector} v
 * @return {Vector}
 * @api public
 */

Vector.prototype.middle = function(v){
  return this.interpolated(v, .5);
};

/**
 * Return the dot product between vectors.
 *
 * @param {Vector} v
 * @return {Number}
 * @api public
 */

Vector.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y;
};

/**
 * Return the angle between vectors in radians.
 *
 * @param {Vector} v
 * @return {Number}
 * @api public
 */

Vector.prototype.angleBetween = function(v){
  var dot = this.dot(v);
  var magA = this.magnitude();
  var magB = v.magnitude();
  return Math.acos(dot / (magA * magB))
};

/**
 * Return "(x, y)" string representation.
 *
 * @return {String}
 * @api public
 */

Vector.prototype.toString = function(){
  return '(' + this.x + ', ' + this.y + ')';
};




});
require.register("clay/index.js", function(exports, require, module){
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



});
require.register("suspension/index.js", function(exports, require, module){
var inherit = require( 'inherit' )
  , debug = require( 'debug' )( 'neuronal:suspension' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Suspension;

function Suspension( app, duration ) {

  Neuron.apply( this, arguments );
  this.duration = duration;
  this._origin = new Vector( this._app.width / 2, this._app.height / 2 );
  this._theta = random( TWO_PI );
  this._deviation = HALF_PI;
  this._distance = this._app.width / 2;
  this._radius = 25;
  this._slave = 0;
  this._amount = 16;
  this._tweens = [];
  
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

Suspension.prototype.setAmount = function( amount ) {
  if ( this.playing ) return;
  this._amount = amount;

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
  
  for ( var i = 0; i < this._amount; i += 1 ) {

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

  var update = function( v ){
    return function( o ){
      v.x = o.x;
      v.y = o.y;
    }
  }
  for ( var i = 0; i < this._amount; i += 1 ) {
    var v = this._verts[i]
      , from = { x: v.x, y: v.y }
      , to = { x: v.destination.x, y: v.destination.y }
      , tween = Tween( from )
          .ease( this.easing )
          .duration( this.duration )
          .to( to )
          .update( update( v ) )
          .on( 'end', function(){
            self._removeTween( this );
          });
    this._tweens.push( tween );
  }

  var lastTween = Tween( { slave: 0 } )
    .ease( this.easing )
    .duration( this.duration )
    .to( { slave: 0 } )
    .update( function( o ) { self._slave = o.slave; } )
    .on( 'end', function(){
      var index = self._tweens.indexOf( this );
      self._tweens.splice( index, 1 );
      self.animate_end();
    } );
    this._tweens.push( lastTween );

};


Suspension.prototype.animate_end = function() {
  
  this.playing = false;
  debug( 'animate_end' );
  
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
    this._app.moveTo(v.x, v.y);
    this._app.arc( v.x, v.y, v.radius / 2, 0, TWO_PI, true);
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


});
require.register("mnmly-tween/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('emitter')
  , ease = require('ease');

/**
 * Expose `Tween`.
 */

module.exports = Tween;

/**
 * Initialize a new `Tween` with `obj`.
 *
 * @param {Object|Array} obj
 * @api public
 */

function Tween(obj) {
  if (!(this instanceof Tween)) return new Tween(obj);
  this._from = obj;
  this.ease('linear');
  this.duration(500);
  this.delay(0);
}

/**
 * Mixin emitter.
 */

Emitter(Tween.prototype);

/**
 * Reset the tween.
 *
 * @api public
 */

Tween.prototype.reset = function(){
  this.isArray = Array.isArray(this._from);
  this._curr = clone(this._from);
  this._done = false;
  this._start = Date.now();
  return this;
};

/**
 * Tween to `obj` and reset internal state.
 *
 *    tween.to({ x: 50, y: 100 })
 *
 * @param {Object|Array} obj
 * @return {Tween} self
 * @api public
 */

Tween.prototype.to = function(obj){
  this.reset();
  this._to = obj;
  return this;
};

/**
 * Set duration to `ms` [500].
 *
 * @param {Number} ms
 * @return {Tween} self
 * @api public
 */

Tween.prototype.duration = function(ms){
  this._duration = ms;
  return this;
};

/**
 * Set delay to `ms` [0].
 *
 * @param {Number} ms
 * @return {Tween} self
 * @api public
 */

Tween.prototype.delay = function(ms){
  this._delay = ms;
  return this;
};

/**
 * Set easing function to `fn`.
 *
 *    tween.ease('in-out-sine')
 *
 * @param {String|Function} fn
 * @return {Tween}
 * @api public
 */

Tween.prototype.ease = function(fn){
  fn = 'function' == typeof fn ? fn : ease[fn];
  if (!fn) throw new TypeError('invalid easing function');
  this._ease = fn;
  return this;
};

/**
 * Stop the tween and immediately emit "stop" and "end".
 *
 * @return {Tween}
 * @api public
 */

Tween.prototype.stop = function(){
  this.stopped = true;
  this._done = true;
  this.emit('stop');
  this.emit('end');
  return this;
};

/**
 * Perform a step.
 *
 * @return {Tween} self
 * @api private
 */

Tween.prototype.step = function(){
  if (this._done) return;

  // duration
  var duration = this._duration;
  var now = Date.now();
  var delta = now - this._start;
  var done = delta >= duration + this._delay;
  var waiting = delta < this._delay;
  
  if (waiting) return;

  // complete
  if (done) {
    this._from = this._to;
    this._update(this._to);
    this._done = true;
    this.emit('end');
    return this;
  }

  // tween
  var from = this._from;
  var to = this._to;
  var curr = this._curr;
  var fn = this._ease;
  var p = (now - this._start - this._delay) / duration;
  var n = fn(p);

  // array
  if (this.isArray) {
    for (var i = 0; i < from.length; ++i) {
      curr[i] = from[i] + (to[i] - from[i]) * n;
    }

    this._update(curr);
    return this;
  }

  // objech
  for (var k in from) {
    curr[k] = from[k] + (to[k] - from[k]) * n;
  }

  this._update(curr);
  return this;
};

/**
 * Set update function to `fn` or
 * when no argument is given this performs
 * a "step".
 *
 * @param {Function} fn
 * @return {Tween} self
 * @api public
 */

Tween.prototype.update = function(fn){
  if (0 == arguments.length) return this.step();
  this._update = fn;
  return this;
};

/**
 * Clone `obj`.
 *
 * @api private
 */

function clone(obj) {
  if (Array.isArray(obj)) return obj.slice();
  var ret = {};
  for (var key in obj) ret[key] = obj[key];
  return ret;
}

});
require.register("pinwheel/index.js", function(exports, require, module){
var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = PinWheel;

function PinWheel( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.setDuration( duration );
  this._amount = 8;
  this.dur = duration / ( this._amount + 2 );
  this._origin = new Vector( this._app.width / 2, this._app.height / 2 );
  this._distance = this._app.height / 6;
  this._startAngle = 0;
  this._endAngle = TWO_PI;
  this._drift = random( TWO_PI );
  this.initialize();
}

inherit( PinWheel, Neuron );

PinWheel.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;

  this._amount = amount;

};

PinWheel.prototype.setDrift = function( drift ) {

  if ( this.playing ) return;

  this._drift = drift;

};


PinWheel.prototype.setAngles = function( startAngle, endAngle ) {

  this._startAngle = startAngle;
  this._endAngle = endAngle;

};

PinWheel.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this._points = new Array( this._amount );
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._points[i] = new Vector( 0, 0 );
  }
  this.reset();

};


PinWheel.prototype.reset = function() {
  
  if ( this.playing ) return;

  for ( var i = 0; i < this._amount; i += 1 ) {
    var pct = i / this._amount
      , theta = this._startAngle
    this._points[i].x = this._distance * cos( theta ) + this._origin.x;
    this._points[i].y = this._distance * sin( theta ) + this._origin.y;

  }
};

PinWheel.prototype.play = function() {

  if ( this.playing ) return;

  this.animate_in();
  
};


PinWheel.prototype.animate_in = function( ) {
  
  var self = this;

  this.playing = true;
  var delay = 0;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }
  var sequences = [];
  for ( var i = 0; i < this._amount; i += 1 ) {

    var index = i + 1
      , _drift = this._drift / index
      , center = PI * ( index / this._amount );
    delay += this.dur;
    sequences[i] = [];
    for ( var j = 0; j < this._amount; j += 1 ) {
      var pct = min( j / index, 1.0 )
        , theta = pct * this._endAngle + this._startAngle + center + this._drift
        , p = this._points[j]
        , x = this._distance * cos( theta ) + this._origin.x
        , y = this._distance * sin( theta ) + this._origin.y
        , from = 0 === i ? { x: p.x, y: p.y } : { x: sequences[i - 1][j].x, y: sequences[i - 1][j].y }
        , to = { x: x, y: y }
        , tween = Tween( from )
                .delay( delay )
                .to( to )
                .duration( this.dur )
                .ease( this.easing )
                .update( update(p) )
                .on( 'end', function() {
                  self._removeTween( this );
                } );

    sequences[i].push({ x: x, y: y });
    this._tweens.push( tween );
    // if ( j >= index ) {
    //   x = this._origin.x;
    //   y = this._origin.y;
    // } else {
    //  x = this._distance * cos( theta ) + this._origin.x
    //  y = this._distance * sin( theta ) + this._origin.y;
    // }

    }
  }
  
  var lastTween = Tween({ slave: this._slave })
    .to( { slave: 0 } )
    .duration( this.dur )
    .delay( delay )
    .ease( this.easing )
    .update( function(o) {
      self._slave = o.slave;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_out();
    })

  this._tweens.push( lastTween );
};


PinWheel.prototype.animate_out = function() {
  
  var self = this;

  this.playing = true;

  var update = function( pos ) {
    return function(o){
      pos.x = o.x;
      pos.y = o.y;
    }
  }
  
  for ( var i = 0; i < this._amount; i += 1 ) {
    var p = this._points[i]
      , from = { x: p.x, y: p.y }
      , to = { x: this._origin.x, y: this._origin.y }
      , tween = Tween( from )
              .to( to )
              .duration( this.dur )
              .ease( this.easing )
              .update( update( p ) )
              .on( 'end', function() {
                self._removeTween( this );
              } );

    this._tweens.push( tween );
  }
  
  var lastTween = Tween({ slave: this._slave })
    .to( { slave: 0 } )
    .duration( this.dur )
    .ease( this.easing )
    .update( function(o) {
      self._slave = o.slave;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_end();
    })

  this._tweens.push( lastTween );
};


PinWheel.prototype.animate_end = function() {
    
  this.playing = false;
  this.reset();

};




PinWheel.prototype.render = function() {
  
  if ( !this.playing ) return;

  // noStroke
  this._app.fillStyle = this.pigment.toString();
  
  this._app.beginPath();
  
  for ( var i = 0; i < this._amount; i += 1 ) {

    var pos = this._points[i];

    if (i === 0) {
      this._app.moveTo( pos.x, pos.y );
    } else {
      this._app.lineTo( pos.x, pos.y );
    }
    
  }

  this._app.closePath();
  this._app.fill();
};

PinWheel.prototype._createTween = function() {
  return _tween;
};

});
require.register("squiggle/index.js", function(exports, require, module){
var inherit = require( 'inherit' )
  , Tween = require( 'tween' )
  , Vector = require( 'vector' )
  , Neuron = require( 'neuron' );

module.exports = Squiggle;

function Squiggle( app, duration ){
  
  Neuron.apply( this, arguments );
  
  this.x = this._app.width / 2;
  this.y = this._app.height / 2;
  this.distance = this._app.width;
  this.setDuration( duration );
  
  this._state = 0.0;
  this._entering = false;

  this._distance = this._app.width / 2;
  this._amplitude = this._app.height / 4;
  this._angle = 0;
  this._revolutions = 0;
  this._amount = 256;
  this._origin = new Vector( this._app.width / 2, this._app.height / 2 );
  
  this.initialize();
}

inherit( Squiggle, Neuron );

Squiggle.prototype.setRevolutions = function( revolutions ) {

  if ( this.playing ) return;
  this._revolutions = revolutions;

};

Squiggle.prototype.setAmount = function( amount ) {

  if ( this.playing ) return;
  
  this._amount = amount;

};

Squiggle.prototype.setAngle = function( angle ) {

  if ( this.playing ) return;
  
  this._angle = angle;
};

Squiggle.prototype.setAmplitude = function( amplitude ) {

  if ( this.playing ) return;
  
  this._amplitude = amplitude;
};

Squiggle.prototype.setDistance = function( distance ) {

  if ( this.playing ) return;
  
  this._distance = distance;
};


Squiggle.prototype.getAmount = function( ) {
  return this._amount;
};

Squiggle.prototype.play = function() {
  
  if( this.playing ) return;

  this.animate_in();

};

Squiggle.prototype.animate_in = function( ) {
  
  var self = this;

  this.playing = true;
  this._entering = true;
  this._state = 0.0;

  var tween = Tween({ state: this._state })
    .to( { state: 1.0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._state = o.state;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_out();
    })

  this._tweens.push( tween );
};

Squiggle.prototype.animate_out = function() {

  var self = this;
  this._entering = false;
  this._state = 0.0;
  
  var tween = Tween({ state: this._state })
    .to( { state: 1.0 } )
    .duration( this.duration )
    .ease( this.easing )
    .update( function(o) {
      self._state = o.state;
    } )
    .on( 'end', function(){
      self._removeTween( this );
      self.animate_end();
    })

  this._tweens.push( tween );

};

Squiggle.prototype.animate_end = function() {
  
  this.playing = false;
  this.reset();

};


Squiggle.prototype.initialize = function( ) {

  if ( this.playing ) return;
  
  this._points = new Array( this._amount );
  this.reset();

};


Squiggle.prototype.reset = function() {
  
  if ( this.playing ) return;

  for ( var i = 0; i < this._amount; i += 1 ) {
    this._points[i] = this._getPointOnLine( i / this._amount );
  }
};


Squiggle.prototype.render = function() {
  
  if ( !this.playing ) return;
  
  this._app.lineWidth = this._app.height / 60;
  this._app.strokeStyle = this.pigment.toString();
  this._app.lineCap = 'round';
  this._app.lineJoin = 'round';
  // noFill
  this._app.fillStyle = 'rgba(0, 0, 0, 0)';

  this._app.beginPath();

  if ( this._entering ) {

    for ( var i = 0; i < this._amount; i += 1 ) {

      var pct = i / this._amount;

      if ( pct >= this._state ) continue;

      var p = this._points[i];
      if ( 0 === i ) {
        this._app.moveTo( p.x, p.y );
      } else {
        this._app.lineTo( p.x, p.y );
      }
    }
  } else {
    var l = this._getPointOnLine( 1.0 );
    this._app.moveTo( l.x, l.y );
    for ( var i = this._amount - 1; i >= 0; i-- ) {
      var pct = i / this._amount;
      if ( pct <= this._state ) continue;
      var p = this._points[i];
      this._app.lineTo( p.x, p.y );
    }
    var t = this._getPointOnLine( this._state );
    this._app.lineTo( t.x, t.y );
  }

  //this._app.closePath();
  this._app.stroke();

};

Squiggle.prototype._getPointOnLine = function( pct ) {

  var halfDistance = this._distance / 2
    , theta = pct * this._revolutions * TWO_PI
    , up = this._angle - HALF_PI
    , x = this._origin.x - halfDistance * cos( this._angle )
    , y = this._origin.y - halfDistance * sin( this._angle );

  x += pct * this._distance * cos( this._angle );
  x += cos( up ) * cos( theta ) * this._amplitude;

  y += pct * this._distance * sin( this._angle );
  y += sin( up ) * sin( theta + up ) * this._amplitude;

  return new Vector( x, y );
};

});
require.register("utils/index.js", function(exports, require, module){
exports.mod = function( v, l ) {

  while ( v < 0 ) {
    v += l;
  }
  return v % l;
}

exports.ease = function( cur, dest, ease) {

  var diff = dest - cur;
  if ( diff < ease ) {
    cur = dest;
  } else {
    cur += diff * ease;
  }
  return cur;

}


});
require.register("palette/index.js", function(exports, require, module){
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





});
require.register("palette/statics.js", function(exports, require, module){
module.exports = {
    MEGURO: 0
  , MIRO: 1
  , KANDINSKY: 2
  , FISCHINGER: 3
  , SHANGHAI: 4
  
  , BACKGROUND: 0
  , MIDDLE: 1
  , FOREGROUND: 2
  , ACCENT: 3
  , HIGHLIGHT: 4
  , WHITE: 5
  , BLACK: 6
}

});
require.register("router/index.js", function(exports, require, module){
module.exports = Router;

function Router(app, depth, debug){

  this.debug = debug || false;
  this.depth = depth || 128;
  
  this._app = app;
  this._damp = 0.0125;
  this._raw_frequencies = [];
  this._smooth_frequencies = [];
  this._max_amplitude = 0.0;
  this.initialize();
}

Router.prototype.initialize = function() {
  
};

Router.prototype.getBand = function(index, smooth_) {
  return 1.0;
};

Router.prototype.getDepth = function() {
  return this.depth;
};

Router.prototype.getDamp = function() {
  return this._damp;
};

Router.prototype.setDebug = function(debug) {
  this.debug = debug;
};

Router.prototype.setDepth = function(depth) {
  this.depth = depth;
  this.initialize();
};

Router.prototype.setDamp = function(damp) {
  this._damp = damp;
};

Router.prototype.isHat = function() {
  return true;
};

Router.prototype.isKick = function() {
  return true;
};

Router.prototype.isOnset = function() {
  return true;
};

Router.prototype.isRange = function(low, high, threshold) {
  return true;
};

Router.prototype.isSnare = function() {
  return false;
};

Router.prototype.setSensitivity = function(sensitivity) {
  //
};


Router.prototype.update = function() {
  
};

Router.prototype.render = function() {
};

Router.prototype.stop = function() {
};

Router.prototype._ease = function(current, target, increment) {
  var difference = target - current;
  if (Math.abs(difference) <= increment) {
    current = target;
  } else {
    current += difference * increment;
  }
  return current;
};

});
require.register("piston/index.js", function(exports, require, module){
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
  this._animate_in();
};

Piston.prototype._animate_in = function() {

  this.playing = true;
  this._reset();

  var self = this
    , from = { w: this.w }
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
        self._removeTween( this )
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
        self._removeTween( this );
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

});
require.register("engine/index.js", function(exports, require, module){
var Piston = require('piston');

module.exports = Engine;

function Engine(router, x, y, width, height){
  
  this._pistons = [];
  this._amount = 8;
  this._pigment = '#000';
  this._router = router;
  this._app = router._app;

  this._ox = x;
  this._oy = y;

  this.w = width;
  this.h = height;
  this.x = x- (this.w / 2);
  this.y = y - (this.h / 2);

  this.gutter = 0;
  this.duration = 0.15 * 1000;
  this.delay = 0;
  this.initialize();
}

Engine.prototype.isPlaying = function() {

  var result = false;
  for (var i = 0; i < this._amount; i += 1) {
    var piston = this._pistons[i];
    if ( piston.playing ) {
      result = true;
      break;
    }
  }
  return result;
};

Engine.prototype.setColor = function(color) {
  this._pigment = color;
};

Engine.prototype.setAmount = function(amount) {
  this._amount = amount;
};

Engine.prototype.setDelay = function(delay) {
  this.delay = delay;
};

Engine.prototype.setDimensions = function(width, height) {
  this.w = width;
  this.h = height;
  this.x = this._ox - (width / 2);
  this.y = this._oy - (height / 2);
};

Engine.prototype.initialize = function() {
  if (this._amount <= 1) {
    this.gutter = 0;
  } else {
    this.gutter = this.h / (this._amount * 4);
  }

  var offsetH = (this.h / this._amount) - this.gutter;

  for (var i = 0; i < this._amount; i += 1) {
    
    var piston = this._pistons[i] = new Piston(this._app, this.duration)
      , offsetY = (i / this._amount) * this.h + this.y + this.gutter / 2;

    piston.initialize(this.x, offsetY, this.w, offsetH);
    piston.setDelay(this.delay * i);
    piston.setColor(this._pigment);

  }
};

Engine.prototype.play = function() {
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._pistons[i].play();
  }
};

Engine.prototype.render = function() {
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._pistons[i].render();
  }
};

Engine.prototype.update = function() {
  for ( var i = 0; i < this._amount; i += 1 ) {
    this._pistons[i].update();
  }
};

});
require.register("perform/index.js", function(exports, require, module){

/**
 * Neuronal Synchrony
 * 
 * A collection of two dimensional animations
 * that are triggered by sound.
 * 
 * It is dependent on minim and Ani Processing
 * libraries, which can be found on the
 * Processing website.
 *
 * This application is meant to be used for live
 * performances and subtly takes in the microphone
 * or current line-in's frequencies. Currently,
 * the main interaction is through keyboard input,
 * although I'd like to change this to Monome.
 *
 * @jonobr1
 *
 * JS fork by @mnmly
 */

var Sketch = require( 'sketch' )
  , autoscale = require('autoscale-canvas')
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
  

Debug.enable('*')

module.exports = Perform;

function Perform(){
  
  var self = this
    , firstFrame = false
    , setup = this.setup.bind( this )
    , update = this.update.bind( this )
    , draw = this.draw.bind( this )
    , keyup = this.keyup.bind( this )
    , touchend = this.touchend.bind( this )
    , drawLines = false
    , params = {
        setup: setup
      , update: update
      , draw: draw
      , keyup: keyup
      , touchend: touchend
      // , width: width
      // , height: height
    }

  this.app = Sketch.create( params );
  autoscale( document.querySelector('canvas') );

  this.app.frameCount = 0;
  var width = this.app.width
    , height = this.app.height;
  
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

  window.addEventListener('devicemotion', function (e) {
    x1 = e.accelerationIncludingGravity.x;
    y1 = e.accelerationIncludingGravity.y;
    z1 = e.accelerationIncludingGravity.z;
    Math.abs( e.acceleration.x ) > 3 && self.palette.next();
  }, false);
}


Perform.prototype.setup = function() {
  debug( 'setting up' );

}

Perform.prototype.letters = [ [ ['E'], ['R'], ['M'] ],
                              [ ['P'], ['L'], ['S'] ],
                              [ ['D'], ['A'], ['C'] ],
                              [ ['O'], ['W'], ['Y'] ] ];

Perform.prototype.touchend = function( e ) {

  var width = this.app.width
    , height = this.app.height;

  for ( var i = 0; i < e.changedTouches.length; i += 1 ) {
    var t = e.changedTouches[i]
      , col = floor( t.clientX / width * 3 )
      , row = floor( t.clientY / height * 4 )
    this.keyup( this.letters[row][col] );
  }

};

Perform.prototype.keyup = function( e ) {

  var key = e.keyCode ? String.fromCharCode( e.keyCode ) : e
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
      this.suspension.setAmount( parseInt( map( amp, 0, 1, 8, 32 ), 10 ) );
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
      this.squiggle.setAngle( random( TWO_PI ) );
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
    
    if ( this.drawLines ){
      this.app.strokeStyle = this.palette.getColor( 3 ).toString();
      
      for ( var i = 1; i <= 3; i += 1 ) {
        this.app.moveTo( this.app.width / 3 * i, 0 )
        this.app.lineTo( this.app.width / 3 * i, this.app.height );
      }
      
      for ( var i = 1; i <= 4; i += 1 ) {
        this.app.moveTo( 0, this.app.height / 4 * i )
        this.app.lineTo( this.app.width, this.app.height / 4 * i)
      }

      this.app.stroke();
    }

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


});
require.alias("component-vector/index.js", "neuronal-synchrony/deps/vector/index.js");
require.alias("component-vector/index.js", "vector/index.js");

require.alias("component-tween/index.js", "neuronal-synchrony/deps/tween/index.js");
require.alias("component-tween/index.js", "tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("visionmedia-debug/index.js", "neuronal-synchrony/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuronal-synchrony/deps/debug/debug.js");
require.alias("visionmedia-debug/index.js", "debug/index.js");

require.alias("component-autoscale-canvas/index.js", "neuronal-synchrony/deps/autoscale-canvas/index.js");
require.alias("component-autoscale-canvas/index.js", "autoscale-canvas/index.js");

require.alias("perform/index.js", "neuronal-synchrony/deps/perform/index.js");
require.alias("perform/index.js", "perform/index.js");
require.alias("mnmly-sketch.js/js/sketch.js", "perform/deps/sketch/js/sketch.js");
require.alias("mnmly-sketch.js/js/sketch.js", "perform/deps/sketch/index.js");
require.alias("mnmly-sketch.js/js/sketch.js", "mnmly-sketch.js/index.js");

require.alias("visionmedia-debug/index.js", "perform/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "perform/deps/debug/debug.js");

require.alias("component-autoscale-canvas/index.js", "perform/deps/autoscale-canvas/index.js");

require.alias("record/index.js", "perform/deps/record/index.js");

require.alias("moon/index.js", "perform/deps/moon/index.js");
require.alias("component-inherit/index.js", "moon/deps/inherit/index.js");

require.alias("component-vector/index.js", "moon/deps/vector/index.js");

require.alias("component-tween/index.js", "moon/deps/tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("neuron/index.js", "moon/deps/neuron/index.js");
require.alias("component-color/index.js", "neuron/deps/color/index.js");
require.alias("component-color/RGBA.js", "neuron/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "neuron/deps/color/HSLA.js");

require.alias("visionmedia-debug/index.js", "neuron/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuron/deps/debug/debug.js");

require.alias("prism/index.js", "perform/deps/prism/index.js");
require.alias("component-inherit/index.js", "prism/deps/inherit/index.js");

require.alias("component-vector/index.js", "prism/deps/vector/index.js");

require.alias("component-tween/index.js", "prism/deps/tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("neuron/index.js", "prism/deps/neuron/index.js");
require.alias("component-color/index.js", "neuron/deps/color/index.js");
require.alias("component-color/RGBA.js", "neuron/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "neuron/deps/color/HSLA.js");

require.alias("visionmedia-debug/index.js", "neuron/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuron/deps/debug/debug.js");

require.alias("clay/index.js", "perform/deps/clay/index.js");
require.alias("component-inherit/index.js", "clay/deps/inherit/index.js");

require.alias("mnmly-vector/index.js", "clay/deps/vector/index.js");

require.alias("component-tween/index.js", "clay/deps/tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("neuron/index.js", "clay/deps/neuron/index.js");
require.alias("component-color/index.js", "neuron/deps/color/index.js");
require.alias("component-color/RGBA.js", "neuron/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "neuron/deps/color/HSLA.js");

require.alias("visionmedia-debug/index.js", "neuron/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuron/deps/debug/debug.js");

require.alias("suspension/index.js", "perform/deps/suspension/index.js");
require.alias("component-tween/index.js", "suspension/deps/tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("component-inherit/index.js", "suspension/deps/inherit/index.js");

require.alias("component-vector/index.js", "suspension/deps/vector/index.js");

require.alias("visionmedia-debug/index.js", "suspension/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "suspension/deps/debug/debug.js");

require.alias("neuron/index.js", "suspension/deps/neuron/index.js");
require.alias("component-color/index.js", "neuron/deps/color/index.js");
require.alias("component-color/RGBA.js", "neuron/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "neuron/deps/color/HSLA.js");

require.alias("visionmedia-debug/index.js", "neuron/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuron/deps/debug/debug.js");

require.alias("pinwheel/index.js", "perform/deps/pinwheel/index.js");
require.alias("component-inherit/index.js", "pinwheel/deps/inherit/index.js");

require.alias("component-vector/index.js", "pinwheel/deps/vector/index.js");

require.alias("mnmly-tween/index.js", "pinwheel/deps/tween/index.js");
require.alias("component-emitter/index.js", "mnmly-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "mnmly-tween/deps/ease/index.js");

require.alias("neuron/index.js", "pinwheel/deps/neuron/index.js");
require.alias("component-color/index.js", "neuron/deps/color/index.js");
require.alias("component-color/RGBA.js", "neuron/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "neuron/deps/color/HSLA.js");

require.alias("visionmedia-debug/index.js", "neuron/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuron/deps/debug/debug.js");

require.alias("squiggle/index.js", "perform/deps/squiggle/index.js");
require.alias("component-inherit/index.js", "squiggle/deps/inherit/index.js");

require.alias("component-vector/index.js", "squiggle/deps/vector/index.js");

require.alias("component-tween/index.js", "squiggle/deps/tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("neuron/index.js", "squiggle/deps/neuron/index.js");
require.alias("component-color/index.js", "neuron/deps/color/index.js");
require.alias("component-color/RGBA.js", "neuron/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "neuron/deps/color/HSLA.js");

require.alias("visionmedia-debug/index.js", "neuron/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuron/deps/debug/debug.js");

require.alias("palette/index.js", "perform/deps/palette/index.js");
require.alias("palette/statics.js", "perform/deps/palette/statics.js");
require.alias("component-color/index.js", "palette/deps/color/index.js");
require.alias("component-color/RGBA.js", "palette/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "palette/deps/color/HSLA.js");

require.alias("component-inherit/index.js", "palette/deps/inherit/index.js");

require.alias("utils/index.js", "palette/deps/utils/index.js");

require.alias("router/index.js", "perform/deps/router/index.js");

require.alias("engine/index.js", "perform/deps/engine/index.js");
require.alias("piston/index.js", "engine/deps/piston/index.js");
require.alias("component-inherit/index.js", "piston/deps/inherit/index.js");

require.alias("component-color/index.js", "piston/deps/color/index.js");
require.alias("component-color/RGBA.js", "piston/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "piston/deps/color/HSLA.js");

require.alias("component-tween/index.js", "piston/deps/tween/index.js");
require.alias("component-emitter/index.js", "component-tween/deps/emitter/index.js");

require.alias("component-ease/index.js", "component-tween/deps/ease/index.js");

require.alias("neuron/index.js", "piston/deps/neuron/index.js");
require.alias("component-color/index.js", "neuron/deps/color/index.js");
require.alias("component-color/RGBA.js", "neuron/deps/color/RGBA.js");
require.alias("component-color/HSLA.js", "neuron/deps/color/HSLA.js");

require.alias("visionmedia-debug/index.js", "neuron/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "neuron/deps/debug/debug.js");

