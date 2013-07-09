
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
require.register("mnmly-sketch.js/js/sketch.js", Function("exports, require, module",
"\n/* Copyright (C) 2013 Justin Windle, http://soulwire.co.uk */\n\nvar Sketch = (function() {\n\n    \"use strict\";\n\n    /*\n    ----------------------------------------------------------------------\n\n        Config\n\n    ----------------------------------------------------------------------\n    */\n\n    var MATH_PROPS = 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split( ' ' );\n    var HAS_SKETCH = '__hasSketch';\n    var M = Math;\n\n    var CANVAS = 'canvas';\n    var WEBGL = 'webgl';\n    var DOM = 'dom';\n\n    var doc = document;\n    var win = window;\n\n    var instances = [];\n\n    var defaults = {\n\n        fullscreen: true,\n        autostart: true,\n        autoclear: true,\n        autopause: true,\n        container: doc.body,\n        interval: 1,\n        globals: true,\n        retina: false,\n        type: CANVAS\n    };\n\n    var keyMap = {\n\n         8: 'BACKSPACE',\n         9: 'TAB',\n        13: 'ENTER',\n        16: 'SHIFT',\n        27: 'ESCAPE',\n        32: 'SPACE',\n        37: 'LEFT',\n        38: 'UP',\n        39: 'RIGHT',\n        40: 'DOWN'\n    };\n\n    /*\n    ----------------------------------------------------------------------\n\n        Utilities\n\n    ----------------------------------------------------------------------\n    */\n\n    function isArray( object ) {\n\n        return Object.prototype.toString.call( object ) == '[object Array]';\n    }\n\n    function isFunction( object ) {\n\n        return typeof object == 'function';\n    }\n\n    function isNumber( object ) {\n\n        return typeof object == 'number';\n    }\n\n    function isString( object ) {\n\n        return typeof object == 'string';\n    }\n\n    function keyName( code ) {\n\n        return keyMap[ code ] || String.fromCharCode( code );\n    }\n\n    function extend( target, source, overwrite ) {\n\n        for ( var key in source )\n\n            if ( overwrite || !target.hasOwnProperty( key ) )\n\n                target[ key ] = source[ key ];\n\n        return target;\n    }\n\n    function proxy( method, context ) {\n\n        return function() {\n\n            method.apply( context, arguments );\n        };\n    }\n\n    function clone( target ) {\n\n        var object = {};\n\n        for ( var key in target ) {\n\n            if ( isFunction( target[ key ] ) )\n\n                object[ key ] = proxy( target[ key ], target );\n\n            else\n\n                object[ key ] = target[ key ];\n        }\n\n        return object;\n    }\n\n    /*\n    ----------------------------------------------------------------------\n\n        Constructor\n\n    ----------------------------------------------------------------------\n    */\n\n    function constructor( context ) {\n\n        var request, handler, target, parent, bounds, index, suffix, clock, node, copy, type, key, val, min, max;\n\n        var counter = 0;\n        var touches = [];\n        var setup = false;\n        var ratio = win.devicePixelRatio;\n        var isDiv = context.type == DOM;\n        var is2D = context.type == CANVAS;\n\n        var mouse = {\n            x:  0.0, y:  0.0,\n            ox: 0.0, oy: 0.0,\n            dx: 0.0, dy: 0.0\n        };\n\n        var eventMap = [\n\n            context.element,\n\n                pointer, 'mousedown', 'touchstart',\n                pointer, 'mousemove', 'touchmove',\n                pointer, 'mouseup', 'touchend',\n                pointer, 'click',\n\n            doc,\n\n                keypress, 'keydown', 'keyup',\n\n            win,\n\n                active, 'focus', 'blur',\n                resize, 'resize'\n        ];\n\n        var keys = {}; for ( key in keyMap ) keys[ keyMap[ key ] ] = false;\n\n        function trigger( method ) {\n\n            if ( isFunction( method ) )\n\n                method.apply( context, [].splice.call( arguments, 1 ) );\n        }\n\n        function bind( on ) {\n\n            for ( index = 0; index < eventMap.length; index++ ) {\n\n                node = eventMap[ index ];\n\n                if ( isString( node ) )\n\n                    target[ ( on ? 'add' : 'remove' ) + 'EventListener' ].call( target, node, handler, false );\n\n                else if ( isFunction( node ) )\n\n                    handler = node;\n\n                else target = node;\n            }\n        }\n\n        function update() {\n\n            cAF( request );\n            request = rAF( update );\n\n            if ( !setup ) {\n\n                trigger( context.setup );\n                setup = isFunction( context.setup );\n                trigger( context.resize );\n            }\n\n            if ( context.running && !counter ) {\n\n                context.dt = ( clock = +new Date() ) - context.now;\n                context.millis += context.dt;\n                context.now = clock;\n\n                trigger( context.update );\n\n                if ( context.autoclear && is2D )\n\n                    context.clear();\n\n                trigger( context.draw );\n            }\n\n            counter = ++counter % context.interval;\n        }\n\n        function resize() {\n\n            target = isDiv ? context.style : context.canvas;\n            suffix = isDiv ? 'px' : '';\n\n            if ( context.fullscreen ) {\n\n                context.height = win.innerHeight;\n                context.width = win.innerWidth;\n            }\n\n            target.height = context.height + suffix;\n            target.width = context.width + suffix;\n\n            if ( context.retina && is2D && ratio ) {\n\n                target.height = context.height * ratio;\n                target.width = context.width * ratio;\n\n                target.style.height = context.height + 'px';\n                target.style.width = context.width + 'px';\n\n                context.scale( ratio, ratio );\n            }\n\n            if ( setup ) trigger( context.resize );\n        }\n\n        function align( touch, target ) {\n\n            bounds = target.getBoundingClientRect();\n\n            touch.x = touch.pageX - bounds.left - win.scrollX;\n            touch.y = touch.pageY - bounds.top - win.scrollY;\n\n            return touch;\n        }\n\n        function augment( touch, target ) {\n\n            align( touch, context.element );\n\n            target = target || {};\n\n            target.ox = target.x || touch.x;\n            target.oy = target.y || touch.y;\n\n            target.x = touch.x;\n            target.y = touch.y;\n\n            target.dx = target.x - target.ox;\n            target.dy = target.y - target.oy;\n\n            return target;\n        }\n\n        function process( event ) {\n\n            event.preventDefault();\n\n            copy = clone( event );\n            copy.originalEvent = event;\n\n            if ( copy.touches ) {\n\n                touches.length = copy.touches.length;\n\n                for ( index = 0; index < copy.touches.length; index++ )\n\n                    touches[ index ] = augment( copy.touches[ index ], touches[ index ] );\n\n            } else {\n\n                touches.length = 0;\n                touches[0] = augment( copy, mouse );\n            }\n\n            extend( mouse, touches[0], true );\n\n            return copy;\n        }\n\n        function pointer( event ) {\n\n            event = process( event );\n\n            min = ( max = eventMap.indexOf( type = event.type ) ) - 1;\n\n            context.dragging =\n\n                /down|start/.test( type ) ? true :\n\n                /up|end/.test( type ) ? false :\n\n                context.dragging;\n\n            while( min )\n\n                isString( eventMap[ min ] ) ?\n\n                    trigger( context[ eventMap[ min-- ] ], event ) :\n\n                isString( eventMap[ max ] ) ?\n\n                    trigger( context[ eventMap[ max++ ] ], event ) :\n\n                min = 0;\n        }\n\n        function keypress( event ) {\n\n            key = event.keyCode;\n            val = event.type == 'keyup';\n            keys[ key ] = keys[ keyName( key ) ] = !val;\n\n            trigger( context[ event.type ], event );\n        }\n\n        function active( event ) {\n\n            if ( context.autopause )\n\n                ( event.type == 'blur' ? stop : start )();\n\n            trigger( context[ event.type ], event );\n        }\n\n        // Public API\n\n        function start() {\n\n            context.now = +new Date();\n            context.running = true;\n        }\n\n        function stop() {\n\n            context.running = false;\n        }\n\n        function toggle() {\n\n            ( context.running ? stop : start )();\n        }\n\n        function clear() {\n\n            if ( is2D )\n\n                context.clearRect( 0, 0, context.width, context.height );\n        }\n\n        function destroy() {\n\n            parent = context.element.parentNode;\n            index = instances.indexOf( context );\n\n            if ( parent ) parent.removeChild( context.element );\n            if ( ~index ) instances.splice( index, 1 );\n\n            bind( false );\n            stop();\n        }\n\n        extend( context, {\n\n            touches: touches,\n            mouse: mouse,\n            keys: keys,\n\n            dragging: false,\n            running: false,\n            millis: 0,\n            now: NaN,\n            dt: NaN,\n\n            destroy: destroy,\n            toggle: toggle,\n            clear: clear,\n            start: start,\n            stop: stop\n        });\n\n        instances.push( context );\n\n        return ( context.autostart && start(), bind( true ), resize(), update(), context );\n    }\n\n    /*\n    ----------------------------------------------------------------------\n\n        Global API\n\n    ----------------------------------------------------------------------\n    */\n\n    var element, context, Sketch = {\n\n        CANVAS: CANVAS,\n        WEB_GL: WEBGL,\n        WEBGL: WEBGL,\n        DOM: DOM,\n\n        instances: instances,\n\n        install: function( context ) {\n\n            if ( !context[ HAS_SKETCH ] ) {\n\n                for ( var i = 0; i < MATH_PROPS.length; i++ )\n\n                    context[ MATH_PROPS[i] ] = M[ MATH_PROPS[i] ];\n\n                extend( context, {\n\n                    TWO_PI: M.PI * 2,\n                    HALF_PI: M.PI / 2,\n                    QUATER_PI: M.PI / 4,\n\n                    random: function( min, max ) {\n\n                        if ( isArray( min ) )\n\n                            return min[ ~~( M.random() * min.length ) ];\n\n                        if ( !isNumber( max ) )\n\n                            max = min || 1, min = 0;\n\n                        return min + M.random() * ( max - min );\n                    },\n\n                    lerp: function( min, max, amount ) {\n\n                        return min + amount * ( max - min );\n                    },\n\n                    map: function( num, minA, maxA, minB, maxB ) {\n\n                        return ( num - minA ) / ( maxA - minA ) * ( maxB - minB ) + minB;\n                    }\n                });\n\n                context[ HAS_SKETCH ] = true;\n            }\n        },\n\n        create: function( options ) {\n\n            options = extend( options || {}, defaults );\n\n            if ( options.globals ) Sketch.install( self );\n\n            element = options.element = options.element || doc.createElement( options.type === DOM ? 'div' : 'canvas' );\n\n            context = options.context = options.context || (function() {\n\n                switch( options.type ) {\n\n                    case CANVAS:\n\n                        return element.getContext( '2d', options );\n\n                    case WEBGL:\n\n                        return element.getContext( 'webgl', options ) || element.getContext( 'experimental-webgl', options );\n\n                    case DOM:\n\n                        return element.canvas = element;\n                }\n\n            })();\n\n            options.container.appendChild( element );\n\n            return Sketch.augment( context, options );\n        },\n\n        augment: function( context, options ) {\n\n            options = extend( options || {}, defaults );\n\n            options.element = context.canvas || context;\n            options.element.className += ' sketch';\n\n            extend( context, options, true );\n\n            return constructor( context );\n        }\n    };\n\n    /*\n    ----------------------------------------------------------------------\n\n        Shims\n\n    ----------------------------------------------------------------------\n    */\n\n    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];\n    var scope = self;\n    var then = 0;\n\n    var a = 'AnimationFrame';\n    var b = 'request' + a;\n    var c = 'cancel' + a;\n\n    var rAF = scope[ b ];\n    var cAF = scope[ c ];\n\n    for ( var i = 0; i < vendors.length && !rAF; i++ ) {\n\n        rAF = scope[ vendors[ i ] + 'Request' + a ];\n        cAF = scope[ vendors[ i ] + 'Cancel' + b ];\n    }\n\n    scope[ b ] = rAF = rAF || function( callback ) {\n\n        var now = +new Date();\n        var dt = M.max( 0, 16 - ( now - then ) );\n        var id = setTimeout( function() {\n            callback( now + dt );\n        }, dt );\n\n        then = now + dt;\n        return id;\n    };\n\n    scope[ c ] = cAF = cAF || function( id ) {\n        clearTimeout( id );\n    };\n\n    /*\n    ----------------------------------------------------------------------\n\n        Output\n\n    ----------------------------------------------------------------------\n    */\n\n    return Sketch;\n\n})();\n\nmodule.exports = Sketch;\n\n//@ sourceURL=mnmly-sketch.js/js/sketch.js"
));
require.register("router/index.js", Function("exports, require, module",
"module.exports = Router;\n\nfunction Router(app, depth, debug){\n\n  this.debug = debug || false;\n  this.depth = depth || 128;\n  \n  this._app = app;\n  this._damp = 0.0125;\n  this._raw_frequencies = [];\n  this._smooth_frequencies = [];\n  this._max_amplitude = 0.0;\n  this.initialize();\n}\n\nRouter.prototype.initialize = function() {\n  \n};\n\nRouter.prototype.getBand = function(index, smooth_) {\n  return 1.0;\n};\n\nRouter.prototype.getDepth = function() {\n  return this.depth;\n};\n\nRouter.prototype.getDamp = function() {\n  return this._damp;\n};\n\nRouter.prototype.setDebug = function(debug) {\n  this.debug = debug;\n};\n\nRouter.prototype.setDepth = function(depth) {\n  this.depth = depth;\n  this.initialize();\n};\n\nRouter.prototype.setDamp = function(damp) {\n  this._damp = damp;\n};\n\nRouter.prototype.isHat = function() {\n  return true;\n};\n\nRouter.prototype.isKick = function() {\n  return true;\n};\n\nRouter.prototype.isOnset = function() {\n  return true;\n};\n\nRouter.prototype.isRange = function(low, high, threshold) {\n  return true;\n};\n\nRouter.prototype.isSnare = function() {\n  return false;\n};\n\nRouter.prototype.setSensitivity = function(sensitivity) {\n  //\n};\n\n\nRouter.prototype.update = function() {\n  \n};\n\nRouter.prototype.render = function() {\n};\n\nRouter.prototype.stop = function() {\n};\n\nRouter.prototype._ease = function(current, target, increment) {\n  var difference = target - current;\n  if (Math.abs(difference) <= increment) {\n    current = target;\n  } else {\n    current += difference * increment;\n  }\n  return current;\n};\n//@ sourceURL=router/index.js"
));
require.register("engine/index.js", Function("exports, require, module",
"module.exports = Engine;\n\nfunction Engine(router, duration, amount){\n  \n  this._pistons = [];\n  this._amount = amount || 8;\n  this._pigment = '#000';\n  this._router = router;\n\n  this._ox = 0;\n  this._oy = 0;\n\n  this.x = 0;\n  this.y = 0;\n  this.w = 0;\n  this.h = 0;\n  this.gutter = 0;\n  this.duration = duration;\n  this.delay = 0;\n}\n\nEngine.prototype.isPlaying = function() {\n\n  var result = false;\n  for (var i = 0; i < this.amount; i += 1) {\n    var piston = pistons[i];\n    if (piston.playing) {\n      result = true;\n      break;\n    }\n  }\n  return result;\n};\n\nEngine.prototype.setColor = function(color) {\n  this._pigment = color;\n};\n\nEngine.prototype.setAmount = function(amount) {\n  this._amount = amount;\n};\n\nEngine.prototype.setDelay = function(delay) {\n  this.delay = delay;\n};\n\nEngine.prototype.setDimensions = function(width, height) {\n  this.w = width;\n  this.h = height;\n  this.x = this._ox - (width / 2);\n  this.y = this._oy - (height / 2);\n};\n\nEngine.prototype.initialize = function() {\n  if (this._amount <= 1) {\n    this.gutter = 0;\n  } else {\n    this.gutter = this.h / (this._amount * 4);\n  }\n\n  var offsetH = (this.h / this._amount) - this.gutter;\n\n  for (var i = 0; i < this._amount; i += 1) {\n    \n    var piston = this._pistons[i] = new Piston(this.duration)\n      , offsetY = (i / this._amount) * this.h + this.y + this.gutter / 2;\n\n    piston.initialize(this.x, offsetY, this.w, offsetH);\n    piston.setDelay(this.delay * i);\n    piston.setColor(this._pigment);\n\n  }\n};\n\nEngine.prototype.play = function() {\n  for ( var i = 0; i < this._amount; i += 1 ) {\n    this._pistons[i].play();\n  }\n};\n\nEngine.prototype.render = function() {\n  for ( var i = 0; i < this._amount; i += 1 ) {\n    this._pistons[i].render();\n  }\n};\n//@ sourceURL=engine/index.js"
));
require.register("perform/index.js", Function("exports, require, module",
"var Sketch = require('sketch')\n  , Router = require('router')\n  , Engine = require('engine')\n\nmodule.exports = Perform;\n\nfunction setup() {\n  console.log( 'setting up' );\n}\n\nfunction Perform(){\n\n  var width = 1280\n    , height = 800;\n\n  this.router = new Router(this, 128, false);\n  this.engine = new Engine(this.router, width / 2, height / 2, -width * 0.75, height / 2);\n  // this.engine.setColor();\n  this.engine.initialize();\n\n  Sketch.create({\n      setup: setup\n    , draw: function(){}\n  });\n}\n//@ sourceURL=perform/index.js"
));
require.alias("perform/index.js", "neuronal-synchrony/deps/perform/index.js");
require.alias("perform/index.js", "perform/index.js");
require.alias("mnmly-sketch.js/js/sketch.js", "perform/deps/sketch/js/sketch.js");
require.alias("mnmly-sketch.js/js/sketch.js", "perform/deps/sketch/index.js");
require.alias("mnmly-sketch.js/js/sketch.js", "mnmly-sketch.js/index.js");

require.alias("router/index.js", "perform/deps/router/index.js");

require.alias("engine/index.js", "perform/deps/engine/index.js");

