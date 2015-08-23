(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["responsiveWatch"] = factory();
	else
		root["responsiveWatch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = responsiveWatch;
	var units = ['px', 'em', 'rem', 'ex', 'ch', 'mm', 'cm', 'in', 'pt', 'pc'];

	function responsiveWatch(_ref, cb) {
	  var _ref$sizes = _ref.sizes;
	  var sizes = _ref$sizes === undefined ? [] : _ref$sizes;
	  var _ref$orientations = _ref.orientations;
	  var orientations = _ref$orientations === undefined ? true : _ref$orientations;
	  var _ref$medias = _ref.medias;
	  var medias = _ref$medias === undefined ? false : _ref$medias;
	  var _ref$queries = _ref.queries;
	  var queries = _ref$queries === undefined ? {} : _ref$queries;
	  var _ref$check = _ref.check;
	  var check = _ref$check === undefined ? true : _ref$check;

	  if (!Array.isArray(sizes)) {
	    throw new Error('options.sizes must be an array');
	  } else if (sizes.length === 1) {
	    throw new Error('If you specify some sizes, you need at least two of them.');
	  }

	  if (check) {
	    sizes.forEach(function (size, index) {
	      if (typeof size.name !== 'string') {
	        throw new Error('Size names must be string. Invalid: ' + size.name);
	      }

	      if (index < sizes.length - 1) {
	        if (typeof size.breakpoint !== 'number') {
	          throw new Error('Size [' + size.name + '] must have a number breakpoint. Invalid: ' + size.breakpoint);
	        } else if (units.indexOf(size.unit) < 0) {
	          throw new Error('Size [' + size.name + '] doesn\'t have a valid unit. Invalid: ' + size.unit);
	        } else if (size.breakpoint <= 0) {
	          throw new Error('Size [' + size.name + '] must have a strictly positive breakpoint. Invalid: ' + size.unit);
	        }
	      } else {
	        // Last size
	        if (size.breakpoint !== undefined || size.unit !== undefined) {
	          throw new Error('You must not define neither breakpoint nor unit for the last size');
	        }
	      }
	    });

	    // If all units are the same,
	    // check that each breakpoint is bigger than the previous one
	    for (var i = 1, l = sizes.length - 1; i < l; ++i) {
	      var previous = sizes[i - 1],
	          current = sizes[i];
	      if (current.unit !== previous.unit) {
	        // Not all same units, let's stop here
	        break;
	      } else if (current.breakpoint <= previous.breakpoint) {
	        // Oops...
	        throw new Error('Each breakpoint must be bigger than the previous one.');
	      }
	    }

	    if (typeof orientations !== 'boolean') {
	      throw new Error('options.orientations must be a boolean');
	    }

	    if (typeof medias !== 'boolean') {
	      throw new Error('options.medias must be a boolean');
	    }

	    if (typeof cb !== 'function') {
	      throw new Error('callback must be a function');
	    }
	  }

	  var currentStatus = undefined;

	  function callback() {
	    currentStatus = status();
	    cb(currentStatus);
	  }

	  var watchers = {
	    sizes: {},
	    orientations: {},
	    medias: {},
	    queries: {}
	  };

	  // Create all size watchers
	  sizes.forEach(function (size, index) {
	    var min = undefined,
	        minUnit = undefined,
	        max = undefined,
	        maxUnit = undefined;

	    // The min is actually the previous size breakpoint
	    if (index > 0) {
	      min = sizes[index - 1].breakpoint;
	      minUnit = sizes[index - 1].unit;
	    }

	    // The max is the current size minus a little delta
	    if (index < sizes.length - 1) {
	      max = size.breakpoint;
	      maxUnit = size.unit;

	      switch (maxUnit) {
	        case 'cm':
	        case 'in':
	          max -= 0.01;
	          break;
	        case 'em':
	        case 'rem':
	        case 'ex':
	        case 'ch':
	        case 'mm':
	        case 'pt':
	        case 'pc':
	          max -= 0.1;
	          break;
	        default:
	          max -= 1;
	      }
	    }

	    // Merge min and max to create the final query
	    var query = '';
	    if (min !== undefined) {
	      query += '(min-width: ' + min + minUnit + ')';
	    }
	    if (max !== undefined) {
	      if (query !== '') {
	        query += ' and ';
	      }
	      query += '(max-width: ' + max + maxUnit + ')';
	    }

	    watchers.sizes[size.name] = matchMedia(query);
	    watchers.sizes[size.name].addListener(callback);
	  });

	  // Create both landscape and portrait watchers
	  if (orientations) {
	    watchers.orientations.landscape = matchMedia('(orientation: landscape)');
	    watchers.orientations.landscape.addListener(callback);

	    watchers.orientations.portrait = matchMedia('(orientation: portrait)');
	    watchers.orientations.portrait.addListener(callback);
	  }

	  // Create watchers for all medias
	  if (medias) {
	    var _medias = ['braille', 'embossed', 'handheld', 'print', 'projection', 'screen', 'speech', 'tty', 'tv'];

	    _medias.forEach(function (media) {
	      watchers.medias[media] = matchMedia(media);
	      watchers.medias[media].addListener(callback);
	    });
	  }

	  // Create all custom watchers
	  Object.keys(queries).forEach(function (query) {
	    watchers.queries[query] = matchMedia(queries[query]);
	    watchers.queries[query].addListener(callback);
	  });

	  // Save all keys just so we don't have to compute them every time
	  var keys = {};

	  Object.keys(watchers).forEach(function (level1) {
	    var level2 = Object.keys(watchers[level1]);
	    if (level2.length > 0) {
	      keys[level1] = level2;
	    }
	  });

	  var sizesHash = {};

	  sizes.forEach(function (size) {
	    sizesHash[size.name] = size;
	  });

	  function matchSizes(result, sizes) {
	    return sizes.reduce(function (acc, size) {
	      return acc || result.sizes[size.name];
	    }, false);
	  }

	  var sizeUtils = {
	    gt: function gt(result, size) {
	      return matchSizes(result, sizes.slice(sizes.indexOf(size) + 1));
	    },
	    gte: function gte(result, size) {
	      return matchSizes(result, sizes.slice(sizes.indexOf(size)));
	    },
	    lt: function lt(result, size) {
	      return matchSizes(result, sizes.slice(0, sizes.indexOf(size)));
	    },
	    lte: function lte(result, size) {
	      return matchSizes(result, sizes.slice(0, sizes.indexOf(size) + 1));
	    }
	  };

	  // Generate the current status
	  function status() {
	    var result = {};

	    // Assign a bunch of true/false flags for all media queries
	    Object.keys(keys).forEach(function (level1) {
	      keys[level1].forEach(function (level2) {
	        if (!result[level1]) {
	          result[level1] = {};
	        }

	        result[level1][level2] = watchers[level1][level2].matches;
	      });
	    });

	    // Add all size comparators
	    if (keys.sizes.length > 1) {
	      ['gt', 'gte', 'lt', 'lte'].forEach(function (comp) {
	        keys.sizes.forEach(function (sizeName) {
	          if (!result[comp]) {
	            result[comp] = {};
	          }

	          result[comp][sizeName] = sizeUtils[comp](result, sizesHash[sizeName]);
	        });
	      });
	    }

	    return result;
	  }

	  // Init callback
	  callback();

	  return {
	    status: function status() {
	      return currentStatus;
	    }
	  };
	}

	;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;