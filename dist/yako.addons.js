/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 			function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 				hotAddUpdateChunk(chunkId, moreModules);
/******/ 				if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 			}
/******/ 	
/******/ 			function hotDownloadUpdateChunk(chunkId) {
/******/ 				var head = document.getElementsByTagName('head')[0];
/******/ 				var script = document.createElement('script');
/******/ 				script.type = 'text/javascript';
/******/ 				script.charset = 'utf-8';
/******/ 				script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 				head.appendChild(script);
/******/ 			}
/******/ 	
/******/ 			function hotDownloadManifest(callback) {
/******/ 				if(typeof XMLHttpRequest === "undefined")
/******/ 					return callback(new Error("No browser support"));
/******/ 				try {
/******/ 					var request = new XMLHttpRequest();
/******/ 					var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 					request.open("GET", requestPath, true);
/******/ 					request.timeout = 10000;
/******/ 					request.send(null);
/******/ 				} catch(err) {
/******/ 					return callback(err);
/******/ 				}
/******/ 				request.onreadystatechange = function() {
/******/ 					if(request.readyState !== 4) return;
/******/ 					if(request.status === 0) {
/******/ 						// timeout
/******/ 						callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 					} else if(request.status === 404) {
/******/ 						// no update available
/******/ 						callback();
/******/ 					} else if(request.status !== 200 && request.status !== 304) {
/******/ 						// other failure
/******/ 						callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 					} else {
/******/ 						// success
/******/ 						try {
/******/ 							var update = JSON.parse(request.responseText);
/******/ 						} catch(e) {
/******/ 							callback(e);
/******/ 							return;
/******/ 						}
/******/ 						callback(null, update);
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c6f396e0441de90255eb";
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = [];
/******/ 	
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._acceptedDependencies[dep[i]] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) { if(err) throw err };
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0; {
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(+id);
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) { if(err) throw err };
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) { if(err) throw err };
/******/ 		}
/******/ 		
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 			
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 			
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = +id;
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j]
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 					if(child.parents.length === 0 && child.hot && child.hot._disposeHandlers && child.hot._disposeHandlers.length > 0) {
/******/ 						// Child has dispose handlers and no more references, dispose it too
/******/ 						queue.push(child.id);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// require("expose?yako.addons!../addons/index.js");
	__webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["yako"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var yako = __webpack_require__(3);
	yako.addons = {
	  Label: __webpack_require__(4),
	  ReturnAsObject: __webpack_require__(5)
	};
	module.exports = yako;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright 2015
	  MIT LICENSE
	  Alfred Kam (@alfredkam)
	*/

	module.exports = __webpack_require__(6);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var label = module.exports = {

	    // Applies the label prior to the graph is generate
	    preRender: function (immutableScale) {
	        var self = this;
	        var opts = self.attributes.opts;
	        var chart = opts.chart;
	        var xAxis = chart.xAxis || opts.xAxis;
	        var yAxis = chart.yAxis || opts.yAxis;
	        var paths = [];
	        // simple hnadOff
	        if (yAxis) {
	            paths.push(self.describeYAxis(immutableScale, yAxis));
	        }
	        // xAxis depends on scale.tickSize
	        if (xAxis) {
	          paths.push(self.describeXAxis(immutableScale, xAxis));
	        }
	        return {
	            prepend: paths
	        };
	    },

	    // Applies the external props to scale
	    // TODO:: Allow proper padding adjustment for single / multi axis
	    _getExternalProps: function (scale, yAxis, xAxis) {
	      var self = this;
	      if (yAxis) {
	        scale.paddingLeft = scale.paddingRight = 30;
	      }

	      if (xAxis) {
	        scale.paddingTop = scale.paddingBottom = 20;
	      }
	      if (!scale.pHeight && yAxis) {
	        scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom;
	      }
	      if (!scale.pWidth && xAxis) {
	        scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight;
	      }
	      if(scale.type == 'bar') {
	        scale.tickSize = scale.pWidth / scale.len;
	      }

	      if (scale.type == 'bubble-scattered') {
	        var len = (xAxis.labels ? xAxis.labels.length : 2);
	        scale.tickSize = scale.pWidth / len;
	        scale.prefLen = len;
	        if (!xAxis.labels) {
	            console.warn('Attempting to use labels with `bubble graph` type:scattered, without defining custom labels');
	        }
	      }
	    },

	    // TODO:: Support custom targets
	    // Describes the lable for y axis
	    describeYAxis: function (scale, opts) {
	        var self = this;
	        var axis = [];
	        var labels = [];
	        var y = rows = scale.rows;
	        var max = scale.max;
	        var ySegments = scale.ySecs;
	        opts = opts || {};
	        if (scale.type == 'bubble-scattered') {
	            max = [max[1]];
	        }
	        if ((!opts.hasOwnProperty('multi')) || (!opts.multi)) {
	            y = rows = 1;
	            if (!((max instanceof Array) || (max instanceof Object))) {
	                max = [max];
	            }
	            ySegments = [ySegments];
	        }
	        var partialHeight = scale.pHeight;
	        var paddingY = scale.paddingY || scale.paddingTop;
	        var paddingX = scale.paddingX || scale.paddingLeft - 5;

	        // Goes through the number of yaxis need
	        while (y--) {
	            var g = self.make('g');
	            var splits = fSplits = ySegments[y];
	            var heightFactor = partialHeight / splits;
	            var xCord = ((y + 1) % 2 === 0 ? scale.width - y * paddingX : (y+1) * paddingX);
	            labels = [];
	            splits += 1;
	            while(splits--) {
	                labels.push(self.make('text',{
	                    y: paddingY + (heightFactor * splits),
	                    x: xCord,
	                    'font-size': opts.fontSize || 12,
	                    'text-anchor': (y + 1) % 2 === 0 ? 'start' : 'end',
	                    fill: opts.color || '#333',
	                }, null, max[y] / fSplits * (fSplits - splits)));
	            }

	            // building the border
	            xCord = ( (y + 1) % 2 === 0) ? xCord - 5 : xCord + 5;
	            labels.push(self.make('path',{
	              'd' : 'M' + xCord + ' 0L' + xCord + ' ' + (partialHeight + paddingY),
	              'stroke-width': '1',
	              'stroke': opts.multi ? scale.color[y] : '#c0c0c0',
	              'fill': 'none',
	              'opacity': '1',
	              'stroke-linecap': 'round'
	            }));
	            axis.push(self._append(g, labels));
	        }
	        return axis;
	    },

	    // TODO:: support custom format
	    // Describes the label for x axis
	    // For simplicity lets only consider dateTime format atm
	    describeXAxis: function (scale, opts) {
	        var self = this;
	        var g = self.make('g');
	        var labels = [];
	        var partialHeight = scale.pHeight;
	        var tickSize = scale.tickSize;
	        var paddingX = scale.paddingX || scale.paddingLeft;
	        var paddingY = scale.paddingY ? scale.paddingY * 2 - 8 : (scale.paddingTop + scale.paddingBottom) - 8;
	        var yAxis = partialHeight + paddingY;
	        var form = opts.format == 'dateTime' ? true : false;

	        if (form) {
	            // Get UTC time stamp multiplexer
	            var tick = opts.interval;
	            var utcMultiplier = self._utcMultiplier(opts.interval);
	            var tickInterval =  (/\d+/.test(tick) ? tick.match(/\d+/)[0] : 1);
	            var format = opts.dateTimeLabelFormat;
	            var minUTC = opts.minUTC || scale.xAxis.minUTC;
	        }

	        var offset = 1;
	        if (scale.type == 'bar' || !form) {
	            offset = 0;
	        }

	        if (scale.type == 'timeSeries' && form) {
	            // In timeSeries, the data is relatively to time and there are possiblities
	            // a label should exist in spots where data does not exist.
	            // The label for the time series will be relative to time.
	            var tickSize = scale.tickSize;
	            var maxUTC = scale.xAxis.maxUTC;
	            var numberOfTicks = (maxUTC - minUTC) / utcMultiplier;

	            for (var i = 0; i < numberOfTicks; i++) {
	                var positionX = utcMultiplier * i  * tickSize + paddingX;
	                labels.push(self.make('text',{
	                    y: yAxis,
	                    x: positionX,
	                    'font-size': opts.fontSize || 12,
	                    'text-anchor': opts.textAnchor || 'middle',
	                    fill: opts.color || '#333',
	                }, null, (form ? self._formatTimeStamp(format, minUTC + (utcMultiplier * i)) : opts.labels[i] || 0)));
	            }

	        } else {
	            // Non timeSeries
	            for (var i = offset; i < (scale.prefLen || scale.len) - offset; i++) {
	                labels.push(self.make('text',{
	                    y: yAxis,
	                    x: (tickSize * i) + paddingX + (scale.type == 'bar' ? tickSize / 4 : 0 ),
	                    'font-size': opts.fontSize || 12,
	                    'text-anchor': opts.textAnchor || (scale.type == 'bar' ? 'start' : 'middle'),
	                    fill: opts.color || '#333',
	                }, null, (form ? self._formatTimeStamp(format, minUTC + (utcMultiplier * i)) : opts.labels[i] || 0)));
	            }
	        }

	        labels.push(self.make('path',{
	          'd' : 'M' + (scale.paddingLeft) + ' ' + (yAxis - 12) + ' L' + (scale.width - scale.paddingRight) + ' ' + (yAxis - 12),
	          'stroke-width': '1',
	          'stroke': '#c0c0c0',
	          'fill': 'none',
	          'opacity': '1',
	          'stroke-linecap': 'round'
	        }));

	        return [self._append(g, labels)];
	    },

	    // Determines the utc multiplier
	    _utcMultiplier: function(tick) {
	        var mili = 1e3,
	            s = 60,
	            m = 60,
	            h = 24,
	            D = 30,
	            M = 12,
	            Y = 1,
	            multiplier = 0;
	        if (/s$/.test(tick))
	            multiplier = mili;
	        else if (/m$/.test(tick))
	            multiplier = s * mili;
	        else if (/h$/.test(tick))
	            multiplier = s * m * mili;
	        else if (/D$/.test(tick))
	            multiplier = s * m * h * mili;
	        else if (/M$/.test(tick))
	            multiplier = s * m * h * D * mili;
	        else if (/Y$/.test(tick))
	            multiplier = s * m * h * D * M * mili;

	        return multiplier;
	    },

	    // Formats the time stamp
	    // TODO:: Create a template to speed up the computation
	    _formatTimeStamp: function (str, time) {
	        var dateObj = new Date(time),
	            flag = false;

	        if (/YYYY/.test(str))
	            str = str.replace('YYYY',dateObj.getFullYear());
	        else if (/YY/.test(str))
	            str = str.replace('YY',(dateObj.getFullYear()).toString().replace(/^\d{1,2}/,''));

	        if (/hh/.test(str) && /ap/.test(str)) {
	          if ((dateObj.getHours())  > 11)
	            str = str.replace(/hh/, (dateObj.getHours() - 12 === 0 ? 12 : dateObj.getHours() - 12))
	                    .replace(/ap/, 'pm');
	          else
	            str = str.replace(/hh/, (dateObj.getHours() === 0 ? 12 :  dateObj.getHours()))
	                    .replace(/ap/,'am');
	        } else
	          str = str.replace(/hh/, (dateObj.getHours() === 0 ? 12 :  dateObj.getHours()));

	        str = str.replace(/MM/,dateObj.getMonth()+1)
	            .replace(/DD/, dateObj.getDate());

	        if (/mm/.test(str) && /ss/.test(str)) {
	            str = str.replace(/mm/,(dateObj.getMinutes().toString().length == 1 ? '0'+dateObj.getMinutes(): dateObj.getMinutes()))
	            .replace(/ss/,(dateObj.getSeconds().toString().length == 1 ? '0'+dateObj.getSeconds(): dateObj.getSeconds()));
	        } else {
	            str = str.replace(/mm/,dateObj.getMinutes())
	            .replace(/ss/,dateObj.getSeconds());
	        }
	        return str;
	    }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * An addon to return content as an object
	 * Usage documentation under https://github.com/alfredkam/yakojs/blob/master/doc.md#returnasobject
	 */

	var isArray = function (obj) {
	    return obj instanceof Array;
	};

	var obj = module.exports = {
	    // Extends default make from lib/classes/common.js
	    make: function (tagName, attribute, dataAttribute, content){
	        var json = {};
	        json[tagName] = attribute;
	        if (content) {
	            json[tagName].textContent = content;
	        }
	        return json;
	    },
	    // Extends default append from lib/base/common.js
	    append: function (parent, childs){
	        if (parent === '') return childs;

	        if (!isArray(childs)) {
	          childs = [childs];
	        }
	        var tagName = Object.keys(parent)[0];
	        if (isArray(parent)) {
	            parent[tagName].push(childs);
	        } else {
	            parent[tagName] = childs;
	        }
	        return parent;
	    }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/*
	  Copyright 2015
	  MIT LICENSE
	  Alfred Kam (@alfredkam)
	*/

	var _componentsSpark = __webpack_require__(7);

	var _componentsSpark2 = _interopRequireDefault(_componentsSpark);

	var _componentsPie = __webpack_require__(8);

	var _componentsPie2 = _interopRequireDefault(_componentsPie);

	var _componentsDonut = __webpack_require__(9);

	var _componentsDonut2 = _interopRequireDefault(_componentsDonut);

	var _componentsBar = __webpack_require__(10);

	var _componentsBar2 = _interopRequireDefault(_componentsBar);

	var _componentsBubble = __webpack_require__(11);

	var _componentsBubble2 = _interopRequireDefault(_componentsBubble);

	var _svgSvg = __webpack_require__(12);

	var _svgSvg2 = _interopRequireDefault(_svgSvg);

	var _utilsMixin = __webpack_require__(13);

	var _utilsMixin2 = _interopRequireDefault(_utilsMixin);

	// time series / object base

	var _componentsBubblePoint = __webpack_require__(14);

	var _componentsBubblePoint2 = _interopRequireDefault(_componentsBubblePoint);

	var _componentsBubbleScatter = __webpack_require__(15);

	var _componentsBubbleScatter2 = _interopRequireDefault(_componentsBubbleScatter);

	var _componentsLine = __webpack_require__(16);

	var _componentsLine2 = _interopRequireDefault(_componentsLine);

	var initialize = function initialize(component, obj) {
	  if (typeof obj === 'object') {
	    return new (obj.mixin ? (0, _utilsMixin2['default'])((0, _utilsMixin2['default'])(component, obj.mixin), obj) : (0, _utilsMixin2['default'])(component, obj))();
	  }
	  return new component(obj);
	};

	exports['default'] = {
	  name: 'yakojs',
	  VERSION: '0.4.10',
	  spark: function spark(opts) {
	    return initialize(_componentsSpark2['default'], opts);
	  },
	  pie: function pie(opts) {
	    return initialize(_componentsPie2['default'], opts);
	  },
	  donut: function donut(opts) {
	    return initialize(_componentsDonut2['default'], opts);
	  },
	  bubble: function bubble(opts) {
	    return initialize(_componentsBubble2['default'], opts);
	  },
	  bar: function bar(opts) {
	    return initialize(_componentsBar2['default'], opts);
	  },
	  svg: _svgSvg2['default'],
	  timeSeries: {
	    bubble: {
	      point: function point(opts) {
	        return initialize(_componentsBubblePoint2['default'], opts);
	      },
	      scatter: function scatter(opts) {
	        return initialize(_componentsBubbleScatter2['default'], opts);
	      }
	    },
	    line: function line(opts) {
	      return initialize(_componentsLine2['default'], opts);
	    }
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(17);
	var Errors = __webpack_require__(18);
	var svgPath = __webpack_require__(19);
	var api = __webpack_require__(20);

	var spark = module.exports = Base.extend({

	  componentName: 'spark',

	  /**
	   * The parent generator that manages the svg generation
	   * @return {object} global function object
	   */
	  _startCycle: function _startCycle() {
	    var self = this;
	    var data = self.attributes.data;
	    var opts = self.attributes.opts;
	    var chart = opts.chart;
	    var xAxis = chart.xAxis || opts.xAxis;
	    var yAxis = chart.yAxis || opts.yAxis;
	    var append = self._append;
	    var svg;
	    var paths = [];

	    if (!self._isArray(data)) {
	      data = [data];
	    }

	    if (xAxis) {
	      chart.xAxis = xAxis;
	    }

	    if (yAxis) {
	      chart.yAxis = yAxis;
	    }

	    return self._lifeCycleManager(data, chart, function (scale) {
	      for (var x = 0; x < scale.rows; x++) {
	        if (yAxis && yAxis.multi) {
	          scale.heightRatio = scale.pHeight / scale.max[x];
	        }
	        var g = self.make('g');
	        // pass in a ref for event look up, here `ref` is x
	        paths.push(append(g, self._describePath(data[x], scale.paddingLeft, scale.paddingTop, scale, x)));
	      }
	      return paths;
	    });
	  },

	  // Extends default getRatio in lib/base/common.js
	  _getRatio: function _getRatio(scale) {
	    var self = this;
	    var data = self.attributes.data;

	    // Check if need inner padding
	    if (scale.paddingLeft !== 0 && scale.paddingRight !== 0) {
	      scale.innerPadding = 5;
	    }
	    if (!scale.xAxis && !scale.yAxis) {

	      for (var i = 0; i < scale.len; i++) {
	        // Find adjustments for inner left / right padding
	        var o = data[i];
	        var padding = 0;

	        if (typeof o == 'object') {
	          var strokeWidth = o.strokeWidth || 2;
	          scale.innerPaddingBottom = scale.innerPaddingTop < strokeWidth ? strokeWidth : scale.innerPaddingTop;
	        }
	        if (typeof o == 'object' && o.scattered && scale.scattered) {
	          var p = o.scattered;
	          padding = (p.strokeWidth ? p.strokeWidth : 2) + (p.radius ? p.radius : 2);
	          scale.innerPadding = scale.innerPadding < padding + 5 ? padding + 5 : scale.innerPadding;
	          scale.innerPaddingBottom = scale.innerPadding > scale.innerPaddingBottom ? scale.innerPadding : scale.innerPaddingBottom;
	          scale.innerPaddingTop = scale.innerPaddingBottom;
	        }
	      }
	    }

	    scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom - scale.innerPaddingTop - scale.innerPaddingBottom;
	    scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight - scale.innerPadding;
	    scale.heightRatio = scale.pHeight / scale.max;
	    scale.tickSize = self._sigFigs(scale.pWidth / (scale.len - 1), 8);
	  },

	  // Describes scattered graph
	  _describeScatteredGraph: api.describeScatter,

	  // Svg path builder
	  _describePath: function _describePath(data, paddingLeft, paddingTop, scale, ref) {
	    ref = ref || 0;
	    var self = this;
	    var pathToken = svgPath.describeAttributeD(data.data, paddingLeft, paddingTop, scale, ref);
	    var pathNode = self.make('path', {
	      d: pathToken,
	      stroke: data.strokeColor || self._randomColor(),
	      'stroke-width': data.strokeWidth || '3',
	      'stroke-linejoin': 'round',
	      'stroke-linecap': 'round',
	      fill: 'none'
	    }, {
	      _ref: ref
	    });
	    var paths = [];

	    if (data.fill && scale.fill) {
	      paths.push(self.make('path', {
	        d: pathToken + svgPath.describeCloseAttributeD(data.data, paddingLeft, paddingTop, scale, ref),
	        stroke: 'none',
	        'stroke-width': '2',
	        'stroke-linejoin': 'round',
	        'stroke-linecap': 'round',
	        fill: data.fill }, {
	        _ref: ref
	      }));
	    }

	    if (scale.line) {
	      paths.push(pathNode);
	    }

	    if (scale.scattered) {
	      paths.push(self._describeScatteredGraph(data, data.data, paddingLeft, paddingTop, scale, ref));
	    }

	    return paths;
	  }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var arcBase = __webpack_require__(21);
	var pie = module.exports = arcBase.extend({

	    componentName: 'pie',

	    /**
	     * [_describePath genereates the paths for each pie segment]
	     * @param  {[int]}   radius         [circumfrance]
	     * @param  {[array]} data           [data set]
	     * @param  {[json]}  chart          [user specified chart options]
	     * @return {[string]}               [the html string for the pie]
	     */
	    _describePath: function _describePath(radius, data, chart) {
	        if (!data) return '';
	        var paths = [];
	        var startAngle = 0;
	        var fills = chart.fills || 0;
	        var strokes = chart.strokeColors || 0;
	        var centerX = chart.width / 2;
	        var centerY = chart.height / 2;
	        var self = this;

	        if (chart.total == 0) {
	            return self.make('path', {
	                'stroke-linecap': 'round',
	                'stroke-linejoin': 'round',
	                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
	                fill: 'transparent',
	                d: self._describeEmptyPie(centerX, centerY, radius)
	            });
	        }

	        for (var i = 0; i < data.length; i++) {
	            var endAngle = startAngle + 360 * data[i];
	            paths.push(self.make('path', {
	                'stroke-linecap': 'round',
	                'stroke-linejoin': 'round',
	                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
	                d: self._describePie(centerX, centerY, radius, startAngle, endAngle),
	                fill: fills[i] || self._randomColor()
	            }));
	            startAngle = endAngle;
	        }
	        return paths;
	    },

	    /**
	     * [_describeEmptyPie describes a full pie using paths]
	     * @param  {Number} x           [x cordinates]
	     * @param  {Number} y           [y cordinates]
	     * @param  {Number} R           [outer radius]
	     */
	    _describeEmptyPie: function _describeEmptyPie(x, y, R) {
	        var y1 = y + R;
	        var y2 = y + r;
	        var path = 'M' + x + ' ' + y1 + 'A' + R + ' ' + R + ' 0 1 1 ' + (x + 0.001) + ' ' + y1; // Outer circle
	        return path;
	    } });

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var arcBase = __webpack_require__(21);
	var pie = module.exports = arcBase.extend({

	    componentName: 'donut',

	    /**
	     * [_describePath genereates the paths for each pie segment]
	     * @param  {[int]} radius [circumfrance]
	     * @param  {[array]} data      [data set]
	     * @param  {[json]} chart     [user specified chart options]
	     * @return {[string]}           [the html string for the pie]
	     */
	    _describePath: function _describePath(radius, data, chart) {
	        if (!data) return '';
	        var paths = [];
	        var outerRadius = chart.outerRadius || radius;
	        var innerRadius = chart.innerRadius || outerRadius / 2;
	        var startAngle = 0;
	        var fills = chart.fills || 0;
	        var strokes = chart.strokeColors || 0;
	        var centerY = chart.height / 2;
	        var centerX = chart.width / 2;
	        var self = this;

	        if (chart.total == 0) {
	            return self.make('path', {
	                'stroke-linecap': 'round',
	                'stroke-linejoin': 'round',
	                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
	                fill: 'transparent',
	                d: self._describeDonutRing(centerX, centerY, innerRadius, outerRadius)
	            });
	        }

	        for (var i = 0; i < data.length; i++) {
	            var endAngle = startAngle + 360 * data[i];
	            paths.push(self.make('path', {
	                'stroke-linecap': 'round',
	                'stroke-linejoin': 'round',
	                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
	                fill: fills[i] || self._randomColor(),
	                d: self._describeDonut(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle)
	            }));
	            startAngle = endAngle;
	        }

	        return paths;
	    },

	    /**
	     * [_describeDonutRing describes donut ring path]
	     * @param  {Number} x           [x cordinates]
	     * @param  {Number} y           [y cordinates]
	     * @param  {Number} R           [outer radius]
	     * @param  {Number} r           [inner radius]
	     */
	    _describeDonutRing: function _describeDonutRing(x, y, r, R) {
	        var y1 = y + R;
	        var y2 = y + r;
	        var path = 'M' + x + ' ' + y1 + 'A' + R + ' ' + R + ' 0 1 1 ' + (x + 0.001) + ' ' + y1; // Outer circle
	        path += 'M' + x + ' ' + y2 + 'A' + r + ' ' + r + ' 0 1 0 ' + (x - 0.001) + ' ' + y2; // Inner Circle
	        return path;
	    },

	    /**
	     * [_describeDonut describes donut path]
	     * @param  {Number} x           [x cordinates]
	     * @param  {Number} y           [y cordinates]
	     * @param  {Number} outerRadius [description]
	     * @param  {Number} innerRadius [description]
	     * @param  {Number} startAngle  [description]
	     * @param  {Number} endAngle    [description]
	     * @return {String}             [return path attribute 'd' for donut shape]
	     */
	    _describeDonut: function _describeDonut(x, y, outerRadius, innerRadius, startAngle, endAngle) {
	        // A temporary fix for working with a stroke that is 360
	        if (startAngle == 0 && endAngle == 360) {
	            startAngle = 1;
	        };

	        var outerArc = {
	            start: this._polarToCartesian(x, y, outerRadius, endAngle),
	            end: this._polarToCartesian(x, y, outerRadius, startAngle)
	        };
	        var innerArc = {
	            start: this._polarToCartesian(x, y, innerRadius, endAngle),
	            end: this._polarToCartesian(x, y, innerRadius, startAngle)
	        };
	        var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

	        return ['M', outerArc.start.x, outerArc.start.y, 'A', outerRadius, outerRadius, 0, arcSweep, 0, outerArc.end.x, outerArc.end.y, 'L', innerArc.end.x, innerArc.end.y, 'A', innerRadius, innerRadius, 0, arcSweep, 1, innerArc.start.x, innerArc.start.y, 'L', outerArc.start.x, outerArc.start.y, 'Z'].join(' ');
	    }
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(17);

	var bar = module.exports = Base.extend({

	    componentName: 'bar',

	    _startCycle: function _startCycle() {
	        var data = this.attributes.data;
	        var self = this;
	        var chart = this.attributes.opts.chart;
	        chart.type = 'bar';

	        return self._lifeCycleManager(data, chart, function (newScale) {
	            return self._describeBar(data, newScale);
	        });
	    },

	    // Describes the svg that builds out the bar
	    _describeBar: function _describeBar(data, scale) {
	        if (!data.length) return '';
	        // TODO:: need to account paddings for labels
	        // Wrap in array for consistency
	        data = typeof data[0] === 'object' ? data : [data];
	        var height = scale.height - scale.paddingTop - scale.paddingBottom;
	        var paddingY = 5;
	        var width = scale.width - scale.paddingLeft - scale.paddingRight;
	        var len = data[0].data.length;
	        var rows = data.length;
	        var tickSize = width / len;
	        var paths = [];

	        for (var i = 0; i < len; i++) {
	            // Stack chart
	            if (scale.stack) {
	                // The top padding has been taken care off, now account for the bottom padding
	                var relativeMax = height * scale.maxSet[i] / scale.max;
	                var yAxis = height - relativeMax + scale.paddingTop;
	                var total = 0;
	                for (var j = 0; j < rows; j++) {
	                    paths.push(this.make('rect', {
	                        x: tickSize * i + tickSize / 4 + scale.paddingLeft,
	                        y: yAxis,
	                        width: tickSize / rows,
	                        height: data[j].data[i] / scale.maxSet[i] * relativeMax,
	                        fill: data[j].fill || this._randomColor()
	                    }));
	                    yAxis += data[j].data[i] / scale.maxSet[i] * relativeMax;
	                }
	            } else {
	                // Side by side
	                var x = tickSize * i + tickSize / 4 + scale.paddingLeft;
	                for (var j = 0; j < rows; j++) {
	                    x += tickSize / (rows + 1) * j;
	                    var relativeMax = height * data[j].data[i] / scale.max;
	                    paths.push(this.make('rect', {
	                        x: x,
	                        y: height - relativeMax + scale.paddingTop,
	                        width: tickSize / (rows + 1),
	                        height: relativeMax,
	                        fill: data[j].fill || this._randomColor()
	                    }));
	                }
	            }
	        }
	        return paths;
	    } });

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/* Entry Points */

	var _classesDefault = __webpack_require__(17);

	var _classesDefault2 = _interopRequireDefault(_classesDefault);

	var _bubbleApi = __webpack_require__(22);

	var _bubbleApi2 = _interopRequireDefault(_bubbleApi);

	module.exports = _classesDefault2['default'].extend({

	    componentName: 'bubble',

	    // Start of a life cyle
	    _startCycle: function _startCycle() {
	        var self = this;
	        var chart = self.attributes.opts.chart;
	        var data = self.attributes.data;
	        var render = self.postRender;
	        var paths = '';
	        var scale;

	        if (chart.type == 'scattered') {
	            chart.type = 'bubble-scattered';
	            return self._lifeCycleManager(data, chart, function (newScale) {
	                return self._describeBubbleChart(data, newScale);
	            });
	        } else {
	            chart.type = 'bubble-point';
	            return self._lifeCycleManager(data, chart, function (newScale) {
	                paths = self._describeBubble(data, chart.height, chart.width, newScale);
	                paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
	                return paths;
	            });
	        }
	    },

	    // Extends default ratio w/ auto scaling
	    _getRatio: _bubbleApi2['default'].getRatioByNumberArray,

	    // Describes bubble scattered graph
	    _describeBubbleChart: _bubbleApi2['default'].describeBubbleByNumberArray,

	    // Describes the xAxis for bubble point graph
	    _describeXAxis: _bubbleApi2['default'].describeXAxisForBubbleLine,

	    // Describes bubble point graph
	    _describeBubble: _bubbleApi2['default'].describeLineByNumberArray
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _path = __webpack_require__(19);

	var _path2 = _interopRequireDefault(_path);

	var _arc = __webpack_require__(23);

	var _arc2 = _interopRequireDefault(_arc);

	var _rect = __webpack_require__(24);

	var _rect2 = _interopRequireDefault(_rect);

	var _composer = __webpack_require__(25);

	var _composer2 = _interopRequireDefault(_composer);

	var _draw = __webpack_require__(26);

	var _draw2 = _interopRequireDefault(_draw);

	module.exports = {

	    path: _path2['default'],

	    arc: _arc2['default'],

	    rect: _rect2['default'],

	    composer: _composer2['default'],

	    create: function create(svgElement) {
	        var instance = new _draw2['default']();
	        return instance.create(svgElement);
	    }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var mixin = module.exports = function (component, obj) {
	    if (obj instanceof Array) {
	        for (var i = 0; i < obj.length; i++) {
	            component = component.extend(obj[i]);
	        }
	        return component;
	    }
	    return component.extend(obj);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// time series / object base

	var _classesDefault = __webpack_require__(17);

	var _classesDefault2 = _interopRequireDefault(_classesDefault);

	var _bubbleApi = __webpack_require__(22);

	var _bubbleApi2 = _interopRequireDefault(_bubbleApi);

	module.exports = _classesDefault2['default'].extend({

	    componentName: 'bubble.point',

	    // Start of a life cyle
	    _startCycle: function _startCycle() {
	        var self = this;
	        var chart = self.attributes.opts.chart;
	        var data = self.attributes.data;
	        var render = self.postRender;
	        var paths = '';
	        var scale;

	        chart.type = 'bubble-point';
	        chart.complex = true;
	        chart.parentType = 'bubble';

	        // sort data
	        var ascByDate = function ascByDate(a, b) {
	            return a.date - b.date;
	        };
	        data.sort(ascByDate);

	        return self._lifeCycleManager(data, chart, function (newScale) {
	            paths = self._describeBubble(data, chart.height, chart.width, newScale);
	            paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
	            return paths;
	        });
	    },

	    // Extends default ratio w/ auto scaling
	    _getRatio: _bubbleApi2['default'].getRatioByTimeSeries,

	    // Describes the xAxis for bubble point graph
	    _describeXAxis: _bubbleApi2['default'].describeXAxisForBubbleLine,

	    // Describes bubble point graph
	    _describeBubble: _bubbleApi2['default'].describeBubbleLineByObject
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// time series / object base

	var _classesDefault = __webpack_require__(17);

	var _classesDefault2 = _interopRequireDefault(_classesDefault);

	var _bubbleApi = __webpack_require__(22);

	var _bubbleApi2 = _interopRequireDefault(_bubbleApi);

	module.exports = _classesDefault2['default'].extend({

	    componentName: 'bubble.scatter',

	    _startCycle: function _startCycle() {
	        var self = this;
	        var chart = self.attributes.opts.chart;
	        var data = self.attributes.data;
	        var render = self.postRender;
	        var paths = '';
	        var scale;

	        chart.type = 'bubble-scattered';
	        chart.complex = true;
	        chart.parentType = 'bubble';

	        return self._lifeCycleManager(data, chart, function (newScale) {
	            return self._describeBubbleChart(data, newScale);
	        });
	    },

	    // Describes bubble scattered graph
	    // Extends default ratio w/ auto scaling
	    _getRatio: _bubbleApi2['default'].getRatioByObject,

	    _describeBubbleChart: _bubbleApi2['default'].describeBubbleByObject
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Time Series Tick Fitting
	 * The objective of this script is to enable auto tick fitting
	 */

	/**
	 * Usage
	 * spark({
	 *   mixin: [
	 *     TimeSeriesTickFitting,
	 *     Label
	 *   ]
	 * }).attr({
	 *   data: {
	 *     props : [{}],
	 *     labels: {
	 *       'point1': {
	 *         'strokeColor' : '#000',
	 *         'strokeWidth' : '2'
	 *       }
	 *     }
	 *   }
	 * })
	 */

	/**
	 * React Usage

	  var React = require('react');
	  var spark = require('yako').spark;
	  var TimeSeriesTickFitting = require('yako/addons/TimeSeriesTickFitting');
	  var Label = require('yako/addons/Label');

	  module.exports = React.createClass({
	      render: function () {
	        var self = this;
	        var svg = spark({
	          mixin: [
	           TimeSeriesTickFitting,
	           Label
	          ]
	        }).attr({
	            'chart': self.props.chart,
	            'points' : self.props.data
	          });

	        return (
	          <div dangerouslySetInnerHTML={{__html: svg}} />
	        )
	      }
	  });
	*/

	var api = __webpack_require__(20);
	var Base = __webpack_require__(17);

	module.exports = Base.extend({

	  componentName: 'line',

	  // Find min max in time series data
	  _scale: function _scale(content, opts) {
	    content = content[0];
	    opts = opts || 0;
	    var chart = opts.chart || opts;
	    var max = 0;
	    var yAxis = chart.yAxis || 0;
	    var xAxis = chart.xAxis || 0;
	    var min = Number.MAX_VALUE;
	    var maxSet = [];
	    var temp;
	    var ans;
	    var self = this;
	    var ySecs = 0;
	    var getSplits = self._getSplits;
	    var color = [];
	    var data = content.data;
	    var key;

	    var ascByKey = function ascByKey(a, b) {
	      return parseInt(a[key]) - parseInt(b[key]);
	    };
	    var labels = Object.keys(content.labels);
	    var rows = labels.length;
	    var len = data.length;
	    var colors = [];

	    for (var c = 0; c < rows; c++) {
	      var color = content.labels[labels[c]].strokeColor = content.labels[labels[c]].strokeColor || self._randomColor();
	      colors.push(color);
	    }

	    if (yAxis) {
	      chart.paddingLeft = chart.paddingRight = 30;
	    }

	    if (xAxis) {
	      chart.paddingTop = chart.paddingBottom = 20;
	    }

	    var pHeight = chart.height - chart.paddingTop - chart.paddingBottom;
	    var pWidth = chart.width - chart.paddingLeft - chart.paddingRight;
	    var heightRatio;

	    if (yAxis && yAxis.multi) {
	      // Across multi set
	      // Each set of data needs ot have thier own individual min / max
	      min = {};
	      max = {};
	      ySecs = {};
	      heightRatio = {};
	      for (var i = 0; i < rows; i++) {
	        key = labels[i];
	        temp = data.slice(0).sort(ascByKey);
	        min[i] = temp[0][key];
	        ans = getSplits(temp[len - 1][key]);
	        max[i] = ans.max;
	        ySecs[i] = ans.splits;
	        heightRatio[i] = pHeight / max[i];
	        delete temp;
	      }
	    } else {
	      // Find min / max across the entire data set
	      for (var i = 0; i < rows; i++) {
	        // `key` is a global key
	        key = labels[i];
	        temp = data.slice(0).sort(ascByKey);
	        min = min > parseInt(temp[0][key]) ? temp[0][key] : min;
	        max = max < parseInt(temp[len - 1][key]) ? temp[len - 1][key] : max;
	        delete temp;
	      }

	      if (yAxis) {
	        ans = getSplits(max);
	        max = ans.max;
	        ySecs = ans.splits;
	      }

	      heightRatio = pHeight / max;
	    }

	    return {
	      min: min,
	      max: max,
	      len: len,
	      rows: rows,
	      ySecs: ySecs,
	      labels: labels,
	      pHeight: pHeight,
	      pWidth: pWidth,
	      heightRatio: heightRatio,
	      color: colors
	    };
	  },

	  _startCycle: function _startCycle() {
	    var self = this;
	    var data = self.attributes.data;
	    var opts = self.attributes.opts;
	    var chart = opts.chart;
	    var svg;
	    var paths = [];

	    if (!self._isArray(data)) {
	      data = [data];
	    }
	    return self._lifeCycleManager(data, chart, function (scale) {
	      return self._describeSeries(data[0], scale.paddingLeft, scale.paddingTop, scale);
	    });
	  },

	  // Extends default getRatio in lib/base/common.js
	  _getRatio: function _getRatio(scale) {
	    var self = this;
	    scale.type = 'timeSeries';

	    var max = scale._data[0].data[scale.len - 1].timestamp;
	    scale.xAxis.maxUTC = max = new Date(max).getTime();
	    var min = scale.xAxis.minUTC || 0;
	    if (!min) {
	      min = scale._data[0].data[0].timestamp;
	      scale.xAxis.minUTC = min = new Date(min).getTime();
	    }

	    // Need to calculate a tickSize relative to time
	    // Javascript MIN_VALUE is 5e-324, so should be fine
	    scale.tickSize = self._sigFigs(scale.pWidth / (max - min), 8);
	  },

	  // Describes the path to close the open path
	  _describeCloseAttributeD: function _describeCloseAttributeD(point, height, heightRatio, paddingLeft, paddingTop) {
	    return ['V', height - paddingTop, 'H', paddingLeft, 'L', paddingLeft, height - point * heightRatio - paddingTop].join(' ');
	  },

	  _describePathAndCircle: function _describePathAndCircle(dataObj, labels, paddingLeft, paddingTop, scale, isScattered, isLine, isFill) {
	    var height = scale.height;
	    var heightRatio = {};
	    var tickSize = scale.tickSize;
	    var minUTC = scale.xAxis.minUTC;
	    var pathTokens = {};
	    var rows = scale.rows;
	    var items = scale.labels;
	    var self = this;
	    var paths = [];
	    var entryPoints = {};

	    // Initialize
	    for (var x = 0; x < rows; x++) {
	      var item = labels[items[x]];
	      pathTokens[x] = '';
	      if (scale.yAxis && scale.yAxis.multi) {
	        heightRatio[x] = scale.pHeight / scale.max[x];
	      } else {
	        heightRatio[x] = scale.heightRatio;
	      }
	      item.strokeColor = item.strokeColor || self._randomColor();
	    }

	    // The length of the data obj
	    for (var i = 0; i < dataObj.length; i++) {
	      // The number of items to include
	      var timestamp = new Date(dataObj[i].timestamp).getTime();
	      var position = (timestamp - minUTC) * tickSize;

	      for (var row = 0; row < rows; row++) {
	        var point = dataObj[i][items[row]] || 0;
	        // Generate the path
	        if (point && isLine) {
	          if (pathTokens[row] == '') {
	            if (isFill) {
	              entryPoints[row] = point;
	            }
	            // X Y
	            pathTokens[row] = 'M ' + paddingLeft + ' ' + (height - point * heightRatio[row] - paddingTop);
	          } else {
	            pathTokens[row] += ' L ' + (position + paddingLeft) + ' ' + (height - point * heightRatio[row] - paddingTop);
	          }
	        }

	        // Generate the scatter points
	        var item = labels[items[row]];
	        if (point && isScattered && item.scattered) {
	          var strokeColor = item.scattered.strokeColor || item.strokeColor;
	          paths.push(self.make('circle', {
	            cx: position + paddingLeft,
	            cy: height - point * heightRatio[row] - paddingTop,
	            r: item.scattered.radius || '3',
	            stroke: strokeColor,
	            'stroke-width': item.scattered.strokeWidth || '3',
	            fill: 'white'
	          }, {
	            _ref: row
	          }));
	        }
	      }
	    }
	    for (var c = 0; c < rows; c++) {
	      var item = labels[items[c]];
	      paths.unshift(self.make('path', {
	        d: pathTokens[c],
	        stroke: item.strokeColor,
	        'stroke-width': item.strokeWidth || '3',
	        'stroke-linejoin': 'round',
	        'stroke-linecap': 'round',
	        fill: 'none'
	      }, {
	        _ref: c
	      }));
	      if (isFill && item.fill) {
	        paths.push(self.make('path', {
	          d: pathTokens[c] + self._describeCloseAttributeD(entryPoints[c], height, heightRatio[c], paddingLeft, paddingTop),
	          stroke: item.strokeColor,
	          'stroke-width': item.strokeWidth || '3',
	          'stroke-linejoin': 'round',
	          'stroke-linecap': 'round',
	          fill: item.fill
	        }, {
	          _ref: c
	        }));
	      }
	    }
	    return paths;
	  },

	  // Svg path builder
	  _describeSeries: function _describeSeries(data, paddingLeft, paddingTop, scale) {
	    var self = this;
	    var paths = self._describePathAndCircle(data.data, data.labels, paddingLeft, paddingTop, scale, scale.scattered, scale.line, scale.fill);
	    return paths;
	  }
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Common = __webpack_require__(27);
	var base = module.exports = Common.extend({

	  // Initialize
	  init: function init(node) {
	    var self = this;
	    // adding width 100% will allow us to have responsive graphs (in re-sizing)
	    if (typeof node === 'string') {
	      if (node[0] === '#') {
	        self.element = self.make('div', {
	          id: node.replace(/^#/, ''),
	          width: '100%'
	        });
	      } else {
	        self.element = self.make('div', {
	          'class': node.replace(/^\./, ''),
	          width: '100%'
	        });
	      }
	    } else {
	      self.element = '';
	    }
	    self.token = self._makeToken();
	    self.attributes = {};
	    return self;
	  },

	  // Include missing values
	  _prepare: function _prepare() {
	    var self = this;
	    var defaults = {
	      type: 'chart',
	      width: '100',
	      height: '100',
	      paddingLeft: 0,
	      paddingRight: 0,
	      paddingTop: 0,
	      paddingBottom: 0,
	      innerPadding: 0,
	      innerPaddingLeft: 0,
	      innerPaddingRight: 0,
	      innerPaddingTop: 0,
	      innerPaddingBottom: 0,
	      invert: [],
	      // spark graph configs
	      line: true,
	      fill: true,
	      scattered: false
	    };
	    self._extend(defaults, self.attributes.opts.chart);
	    self.attributes.opts.chart = defaults;
	    return self;
	  },

	  // Public function for user to set & define the graph attributes
	  attr: function attr(opts) {
	    var self = this;
	    opts = opts || 0;
	    // if a user does not include opts.chart
	    if (typeof opts.chart === 'undefined') {
	      opts = {
	        chart: opts,
	        data: opts.data || opts.points
	      };
	      delete opts.chart.data;
	      delete opts.chart.points;
	    }

	    self.props.data = self.attributes.data = opts.data || opts.points || [];
	    self.props.opts = self.attributes.opts = opts;

	    return self.postRender(self.finalize(self._prepare()._startCycle()));
	  },

	  // Add chart layout property into scale
	  _addChartLayoutProps: function _addChartLayoutProps(scale) {
	    var height = scale.height;
	    var width = scale.width;
	    var paddingTop = scale.paddingTop;
	    var paddingLeft = scale.paddingLeft;
	    var paddingRight = scale.paddingRight;
	    var paddingBottom = scale.paddingBottom;

	    scale.layout = {
	      x: paddingLeft,
	      y: paddingTop,
	      height: height - paddingTop - paddingBottom,
	      width: width - paddingLeft - paddingRight,
	      yToPixel: scale.heightRatio || null,
	      xToPixel: scale.widthRatio || scale.tickSize || null
	    };

	    return null;
	  },

	  // Wraps content with svg element
	  finalize: function finalize(content) {
	    var self = this;
	    var appendTo = self._append;
	    var append = prepend = '';
	    var scale = self.props.scale;
	    var opts = self.props.opts;
	    var svg = self.make('svg', {
	      width: scale.width,
	      height: scale.height,
	      viewBox: '0 0 ' + scale.width + ' ' + scale.height
	    });

	    self._addChartLayoutProps(scale);

	    if (opts.prepend || opts.append) {
	      var immutableScale = Object.freeze(self._deepCopy(scale));
	      append = self._getUserContent(opts.append, content, immutableScale) || '';
	      prepend = self._getUserContent(opts.prepend, content, immutableScale) || '';
	    }
	    return appendTo(self.element, appendTo(svg, prepend + content + append));
	  },

	  // If there is additional content from user, it will retrieve it
	  _getUserContent: function _getUserContent(fn, content, immutableScale) {
	    if (!fn) return '';

	    var additionalContent = fn(content, immutableScale) || '';

	    if (typeof additionalContent == 'object') {
	      additionalContent = additionalContent.stringify();
	    }
	    return additionalContent;
	  }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* istanbul ignore next */
	var warn = function warn(msg) {
	  console.warn(msg);
	};
	/* istanbul ignore next */
	module.exports = {
	  label: function label() {
	    warn("You're attempting to use labels without the `Label` addons.  Check documentation https://github.com/alfredkam/yakojs/blob/master/doc.md");
	  }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// TODO:: shrink the argument

	var api = __webpack_require__(28);

	var path = module.exports = {
	    /**
	     * scale describe the min max
	     * @param  attr: {
	     *                  data : an N * M array,
	     *                  height: chart height,
	     *                  width: chart width
	     *             }
	     * @return obj              min / max
	     */
	    // getLinearScale?
	    getScale: function getScale(attr) {
	        var data = attr.data || 0;
	        var scale = api.scale(data);
	        scale.paddingY = attr.paddingY || 5;
	        scale.tickSize = api.sigFigs(attr.width / (scale.len - 1), 8);
	        scale.heightRatio = (attr.height - scale.paddingY * 2) / scale.max;
	        scale.height = attr.height;
	        scale.width = attr.width;
	        scale.innerPadding = attr.innerPadding || 0;
	        scale.innerPaddingTop = attr.innerPaddingTop || 0;
	        scale.innerPaddingBottom = attr.innerPaddingBottom || 0;
	        return scale;
	    },

	    // Describes an open path
	    describeAttributeD: function describeAttributeD(numArr, paddingLeft, paddingTop, scale, ref) {
	        var height = scale.height;
	        var heightRatio = scale.heightRatio;
	        var tickSize = scale.tickSize;
	        var hasInverse = scale.hasInverse || {};
	        var pathToken = '';

	        if (hasInverse.y) {
	            if (typeof scale.max == 'object') {
	                max = scale.max[ref];
	            } else {
	                max = scale.max;
	            }
	        }

	        // Path generator
	        for (var i = 0; i < numArr.length; i++) {
	            var pointY = (hasInverse.y ? height - (max - numArr[i]) * heightRatio : height - numArr[i] * heightRatio) - paddingTop - scale.innerPaddingTop;
	            if (i === 0) {
	                // X Y
	                pathToken += 'M ' + (paddingLeft + scale.innerPadding) + ' ' + pointY;
	            } else {
	                pathToken += ' L ' + (tickSize * i + paddingLeft) + ' ' + pointY;
	            }
	        }

	        // Eliminates the error calls when attributiting this to the svg path
	        if (pathToken === '') {
	            pathToken = 'M 0 0';
	        }

	        return pathToken;
	    },

	    // Describes the path to close the open path
	    describeCloseAttributeD: function describeCloseAttributeD(numArr, paddingLeft, paddingTop, scale, ref) {
	        var height = scale.height;
	        var heightRatio = scale.heightRatio;
	        return ['V', height - paddingTop, 'H', paddingLeft, 'L', paddingLeft + scale.innerPadding, height - numArr[0] * heightRatio - paddingTop - scale.innerPaddingTop].join(' ');
	    },

	    /**
	     * getOpenPath describes the open path with the given set
	     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
	     * @param  {[array]} numberArray an array of numbers
	     * @return {[string]}            string that descibes attributeD
	     */
	    getOpenPath: function getOpenPath(scale, numberArray) {
	        return path.describeAttributeD(numberArray, 0, scale.paddingY, scale);
	    },

	    /**
	     * getClosedPath describes the closed path with the given set
	     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
	     * @param  {[array]} numberArray an array of numbers
	     * @return {[string]}            string that descibes attributeD
	     */
	    getClosedPath: function getClosedPath(scale, numberArray) {
	        return path.describeAttributeD(numberArray, 0, scale.paddingY, scale) + path.describeCloseAttributeD(numberArray, 0, scale.paddingY, scale);
	    },

	    beginPath: function beginPath() {
	        var self = this;
	        var d = '';
	        self.moveTo = function (x, y) {
	            d += 'M' + x + ' ' + y;
	            return self;
	        };

	        self.lineTo = function (x, y) {
	            d += 'L' + x + ' ' + y;
	            return self;
	        };

	        self.endPath = function () {
	            return d;
	        };
	        return self;
	    }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// Describes scattered graph
	var api = module.exports = {
	  describeScatter: function describeScatter(data, numArr, paddingLeft, paddingTop, scale, ref) {
	    var height = scale.height;
	    var heightRatio = scale.heightRatio;
	    var self = this;
	    var tickSize = scale.tickSize;
	    var scattered = data.scattered || 0;
	    var strokeWidth = scattered.strokeWidth || 2;
	    var strokeColor = scattered.strokeColor || self._randomColor();
	    var radius = scattered.radius || 2;
	    var fill = scattered.fill || 'white';
	    var paths = [];
	    ref = ref || 0;

	    for (var i = 0; i < numArr.length; i++) {
	      paths.push(self.make('circle', {
	        cx: i === 0 ? i + scale.innerPadding + paddingLeft : tickSize * i + paddingLeft,
	        cy: height - numArr[i] * heightRatio - paddingTop - scale.innerPaddingTop,
	        r: radius,
	        stroke: strokeColor,
	        'stroke-width': strokeWidth,
	        fill: fill
	      }, {
	        _ref: ref
	      }));
	    }
	    return paths;
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(17);
	var arc = __webpack_require__(23);

	module.exports = Base.extend({

	    // Parent generator that manages the svg
	    _startCycle: function _startCycle() {
	        var self = this;
	        var chart = self.attributes.opts.chart;
	        var data = self.attributes.data;

	        return self._lifeCycleManager(data, chart, function (scale) {
	            return self._describePath(scale.outerRadius, scale.relativeDataSet, scale);
	        });
	    },

	    // Extends _defineBaseScaleProperties in lib/base/common.js
	    _defineBaseScaleProperties: function _defineBaseScaleProperties(data, chart) {
	        var self = this;
	        var total = self._sumOfData(data);
	        var scale = {
	            total: total,
	            // Converts nums to relative => total sum equals 1
	            relativeDataSet: self._dataSetRelativeToTotal(data, total),
	            // Find the max width & height
	            outerRadius: chart.outerRadius || (chart.height < chart.width ? chart.height : chart.width) / 2
	        };

	        self._extend(scale, chart);
	        return scale;
	    },

	    _polarToCartesian: arc.polarToCartesian,

	    _describeArc: arc.describeArc,

	    _describePie: arc.describePie,

	    /**
	     * [_describePath super class]
	     * @return {[type]} [empty string]
	     */
	    _describePath: function _describePath() {
	        return '';
	    }
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// TODO:: Consolidate code

	var _svgComposer = __webpack_require__(25);

	var _svgComposer2 = _interopRequireDefault(_svgComposer);

	var _utilsRandomColor = __webpack_require__(29);

	var _utilsRandomColor2 = _interopRequireDefault(_utilsRandomColor);

	module.exports = {

	    getConfigForScatterTimeSeries: function getConfigForScatterTimeSeries(chart) {
	        chart.type = 'bubble-scattered';
	        chart.complex = true;
	        chart.parentType = 'bubble';
	        return chart;
	    },

	    getConfigForLine: function getConfigForLine(chart) {
	        chart.type = 'bubble-point';
	        chart.complex = true;
	        chart.parentType = 'bubble';
	        return chart;
	    },

	    // TODO::  Should refer to a function in path to build this
	    // Describes the xAxis for bubble point graph
	    describeXAxisForBubbleLine: function describeXAxisForBubbleLine(height, width, chart) {
	        // Note:: chart.xAxis is the old format
	        var config = chart.axis || chart.xAxis;
	        var centerY = height / 2;
	        // Self Note:: PaddingLeft / PaddingRight adjustments are taken out
	        return _svgComposer2['default'].make('path', {
	            'stroke-linecap': 'round',
	            'stroke-linejoin': 'round',
	            'stroke-width': config.strokeWidth || 2,
	            stroke: config.strokeColor || 'transparent',
	            d: 'M' + chart.paddingLeft + ' ' + centerY + ' H' + width
	        });
	    },

	    describeBubbleByObject: function describeBubbleByObject(data, scale) {
	        var height = scale.height;
	        var width = scale.width;
	        var heightRatio = scale.heightRatio;
	        var widthRatio = scale.widthRatio;
	        var len = scale.len;
	        var max = scale.max;
	        var innerPaddingLeft = scale.innerPaddingLeft;
	        var paddingLeft = scale.paddingLeft;
	        var innerPaddingTop = scale.innerPaddingTop;
	        var paddingTop = scale.paddingTop;

	        var self = this;
	        var defaultFill = scale.fill || 0;
	        var defaultStrokeColor = scale.strokeColor || 0;
	        var defaultStrokeWidth = scale.strokeWidth || 0;
	        var paths = [];
	        var refs;
	        var minRadius = scale.minRadius || 0;
	        var inverse = scale.hasInverse;

	        for (var i = 0; i < len; i++) {
	            var props = data[i];
	            var point = props.data;
	            if (scale.hasEvents) {
	                // c = column for reference
	                refs = {
	                    c: i
	                };
	            }
	            var r = (scale.maxRadius - minRadius) * (point[2] / max[2]);
	            r = r ? r + minRadius : 0;
	            paths.push(_svgComposer2['default'].make('circle', {
	                cx: inverse.x ? point[0] * widthRatio + innerPaddingLeft + paddingLeft : width - point[0] * widthRatio - innerPaddingLeft - paddingLeft,
	                cy: inverse.y ? paddingTop + innerPaddingTop + point[1] * heightRatio : height - point[1] * heightRatio - innerPaddingTop - paddingTop,
	                r: r,
	                fill: props.fill || (defaultFill || (0, _utilsRandomColor2['default'])())
	            }, refs));
	        }
	        return paths;
	    },

	    describeBubbleByNumberArray: function describeBubbleByNumberArray(data, scale) {
	        var height = scale.height;
	        var width = scale.width;
	        var heightRatio = scale.heightRatio;
	        var widthRatio = scale.widthRatio;
	        var len = scale.len;
	        var max = scale.max;

	        var self = this;
	        var fills = scale.fills || 0;
	        var paths = [];
	        var refs;
	        var minRadius = scale.minRadius || 0;

	        for (var r = 0; r < scale.rows; r++) {
	            for (var i = 0; i < len; i++) {
	                var point = data[r].data[i];
	                if (scale.hasEvents) {
	                    // r = row, c = column for reference
	                    refs = {
	                        r: r,
	                        c: i
	                    };
	                }
	                var radius = (scale.maxRadius - minRadius) * (point[2] / max[2]);
	                radius = radius ? radius + minRadius : 0;
	                paths.push(_svgComposer2['default'].make('circle', {
	                    cx: width - point[0] * widthRatio - scale.paddingLeft,
	                    cy: height - point[1] * heightRatio - scale.paddingTop,
	                    r: scale.maxRadius * (point[2] / max[2]),
	                    fill: data[r].fill || (fills[i] || (0, _utilsRandomColor2['default'])())
	                }, refs));
	            }
	        }
	        return paths;
	    },

	    describeBubbleLineByObject: function describeBubbleLineByObject(data, height, width, scale) {
	        if (!data) return '';
	        var paddingLeft = scale.paddingLeft;
	        var innerPaddingLeft = scale.innerPaddingLeft;
	        var autoFit = scale.autoFit;
	        var strokeColors = scale.strokeColors;
	        var strokeWidths = scale.strokeWidths;
	        var fill = scale.fill;
	        var tickSize = scale.tickSize;
	        var startTick = scale.startTick;
	        var minRadius = scale.minRadius;
	        var maxRadius = scale.maxRadius;

	        var dataPoints = data.length;
	        var paths = [];
	        var defaultStrokeColor = strokeColors || 0;
	        var defaultStrokeWidth = strokeWidths || 0;
	        var defaultFill = scale.fill || 0;
	        var centerY = height / 2;
	        var refs, cx;
	        var minRadius = minRadius || 0;

	        for (var i = 0; i < data.length; i++) {
	            var point = data[i];

	            if (scale.hasEvents) {
	                // c = columns
	                refs = {
	                    c: i
	                };
	            }

	            if (autoFit == false) {
	                cx = i * tickSize + paddingLeft + innerPaddingLeft;
	            } else {
	                cx = (point.date.getTime() - startTick) * tickSize + paddingLeft + innerPaddingLeft;
	            }

	            var r = (maxRadius - minRadius) * point.data / scale.max;
	            r = r ? r + minRadius : 0;

	            paths.push(_svgComposer2['default'].make('circle', {
	                cx: cx,
	                cy: centerY,
	                r: r,
	                fill: point.fill || defaultFill,
	                stroke: point.strokeColor || (defaultStrokeColor || 'transparent'),
	                'stroke-width': point.strokeWidth || (defaultStrokeWidth || 0)
	            }, refs));
	        }
	        return paths;
	    },

	    describeLineByNumberArray: function describeLineByNumberArray(data, height, width, scale) {
	        if (!data) return '';
	        var config = scale.bubble;
	        var dataPoints = data.length;
	        var paths = [];
	        var fills = config.fills || 0;
	        var strokeColor = config.strokeColor;
	        var strokeWidths = config.strokeWidths;
	        var minRadius = config.minRadius;

	        var minRadius = minRadius || 0;
	        var strokeColors = strokeColors || 0;
	        var strokeWidths = strokeWidths || 0;
	        var centerY = height / 2;
	        var refs;

	        for (var i = 0; i < data.length; i++) {
	            if (scale.hasEvents) {
	                // c = columns
	                refs = {
	                    c: i
	                };
	            }
	            var r = (config.maxRadius - minRadius) * (data[i] / scale.max);
	            r = r ? r + minRadius : 0;
	            paths.push(_svgComposer2['default'].make('circle', {
	                cx: scale.tickSize * i + scale.paddingLeft + scale.innerPaddingLeft,
	                cy: centerY,
	                r: r,
	                fill: fills[i] || (config.fill || (0, _utilsRandomColor2['default'])()),
	                stroke: strokeColors[i] || (config.strokeColor || (0, _utilsRandomColor2['default'])()),
	                'stroke-width': strokeWidths[i] || (config.strokeWidth || 2)
	            }, refs));
	        }
	        return paths;
	    },

	    getRatioByNumberArray: function getRatioByNumberArray(scale) {
	        var _data = scale._data;
	        var height = scale.height;
	        var width = scale.width;
	        var len = scale.len;
	        var paddingTop = scale.paddingTop;
	        var paddingLeft = scale.paddingLeft;
	        var paddingRight = scale.paddingRight;
	        var paddingBottom = scale.paddingBottom;

	        var data = _data;
	        var maxRadius = (height < width ? height : width) / 3;

	        if (scale.type && scale.type == 'bubble-scattered') {
	            // Bubble as a scattered graph
	            maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
	            scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
	            scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
	            scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
	            scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
	            scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
	            scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
	            scale.minRadius = scale.minRadius || 0;
	        } else {
	            // Bubble line (point) graph
	            scale.bubble = scale.bubble || {};
	            scale.xAxis = scale.xAxis || {};
	            maxRadius = scale.bubble.maxRadius = parseInt(scale.bubble.maxRadius) || maxRadius;
	            scale.bubble.minRadius = scale.bubble.minRadius || 0;
	            // Figure out the maxRadius & paddings, maxRadius is a guide line
	            var tickLen = len - 1 == 0 ? 1 : len - 1;
	            var tickSize = (width - scale.paddingLeft - scale.paddingRight) / tickLen;
	            scale.bubble.maxRadius = tickSize < maxRadius ? tickSize + scale.paddingLeft : maxRadius;
	            scale.paddingLeft = scale.paddingLeft || scale.bubble.maxRadius * (data[0] / scale.max);
	            scale.paddingRight = scale.paddingRight || scale.bubble.maxRadius * (data[len - 1] / scale.max);
	            scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / tickLen;
	        }
	    },

	    // Extends default ratio w/ auto scaling for Bubble Scatter
	    getRatioByObject: function getRatioByObject(scale) {
	        var _data = scale._data;
	        var height = scale.height;
	        var width = scale.width;
	        var len = scale.len;
	        var innerPaddingLeft = scale.innerPaddingLeft;
	        var innerPaddingTop = scale.innerPaddingTop;
	        var innerPaddingRight = scale.innerPaddingRight;
	        var innerPaddingBottom = scale.innerPaddingBottom;
	        var minRadius = scale.minRadius;

	        var data = _data;
	        // bubble as a scattered graph
	        var maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
	        scale.minRadius = minRadius || 0;

	        scale.innerPaddingLeft = innerPaddingLeft < maxRadius ? maxRadius : innerPaddingLeft;
	        scale.innerPaddingRight = innerPaddingRight < maxRadius ? maxRadius : innerPaddingRight;
	        scale.innerPaddingTop = innerPaddingTop < maxRadius ? maxRadius : innerPaddingTop;
	        scale.innerPaddingBottom = innerPaddingBottom < maxRadius ? maxRadius : innerPaddingBottom;
	        scale.widthRatio = (width - scale.innerPaddingLeft - scale.innerPaddingRight) / scale.max[0];
	        scale.heightRatio = (height - scale.innerPaddingTop - scale.innerPaddingBottom) / scale.max[1];
	    },

	    // Extends default ratio w/ auto scaling for Bubble point
	    getRatioByTimeSeries: function getRatioByTimeSeries(scale) {
	        var autoFit = scale.autoFit;
	        var _data = scale._data;
	        var height = scale.height;
	        var width = scale.width;
	        var len = scale.len;
	        var paddingTop = scale.paddingTop;
	        var paddingLeft = scale.paddingLeft;
	        var paddingRight = scale.paddingRight;
	        var paddingBottom = scale.paddingBottom;
	        var axis = scale.axis;

	        var data = _data;
	        scale.axis = axis || {};
	        var maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || maxRadius;
	        var minRadius = scale.minRadius = scale.minRadius || 0;
	        var startTick, endTick;

	        // Check if the start date is defined, if not defined using first element in array
	        if (autoFit == false) {
	            startTick = 0;
	            endTick = len - 1;
	        } else {
	            startTick = (scale.startDate || data[0].date || 0).getTime();
	            endTick = (scale.endDate || data[len - 1].date).getTime();
	        }
	        scale.startTick = startTick;
	        scale.endTick = endTick;
	        var tickLen = endTick - startTick;
	        tickLen = tickLen == 0 ? 1000 : tickLen;

	        var potentialPxTickRatio = width / tickLen;

	        var firstElementRadius = (maxRadius - minRadius) * data[0].data / scale.max;
	        var lastElementRadius = (maxRadius - minRadius) * data[len - 1].data / scale.max;

	        firstElementRadius = firstElementRadius ? firstElementRadius + minRadius : 0;
	        lastElementRadius = lastElementRadius ? lastElementRadius + minRadius : 0;

	        var startTickLeftRadius = (startTick - startTick) * potentialPxTickRatio - firstElementRadius;
	        var endTickRightRadius = (endTick - endTick) * potentialPxTickRatio + lastElementRadius;
	        scale.paddingLeft = startTickLeftRadius < 0 ? Math.abs(startTickLeftRadius) : 0;
	        scale.paddingRight = endTickRightRadius > 0 ? endTickRightRadius : 0;
	        scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / tickLen;
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var arc = module.exports = {

	    // snippet from http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	    // calculates the polar to cartesian coordinates
	    polarToCartesian: function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180;

	        return {
	            x: centerX + radius * Math.cos(angleInRadians),
	            y: centerY + radius * Math.sin(angleInRadians)
	        };
	    },

	    // describes an arc
	    describeArc: function describeArc(centerX, centerY, radius, startAngle, endAngle) {
	        if (startAngle == 0 && endAngle == 360) {
	            // Alt solution http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
	            // return [
	            //     "M", radius * 2, radius,
	            //     "a", radius, radius, 0, 1, 0, radius*2, 0,
	            //     "a", radius, radius, 0, 1, 0, -radius * 2, 0
	            // ].join(" ");
	            startAngle = 1;
	        }
	        var start = arc.polarToCartesian(centerX, centerY, radius, endAngle);
	        var end = arc.polarToCartesian(centerX, centerY, radius, startAngle);
	        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

	        return ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");
	    },

	    describePie: function describePie(centerX, centerY, radius, startAngle, endAngle) {
	        return arc.describeArc(centerX, centerY, radius, startAngle, endAngle) + " L" + centerX + " " + centerY;
	    }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {



/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var isArray = function isArray(obj) {
	  return obj instanceof Array;
	};

	var composer = {

	  makePairs: function makePairs(prefix, json) {
	    if (!prefix) return '';

	    if (arguments.length < 2) {
	      json = prefix;
	      prefix = '';
	    } else {
	      prefix += '-';
	    }

	    if (!json) return '';

	    var keys = Object.keys(json),
	        len = keys.length;
	    var str = '';
	    while (len--) {
	      str += ' ' + prefix + keys[len] + '="' + json[keys[len]] + '"';
	    }
	    return str;
	  },

	  append: function append(parent, childs) {
	    if (parent === '') return childs;
	    if (!isArray(childs)) {
	      childs = [childs];
	    }
	    return parent.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
	      return p1 + childs.join('') + p2;
	    });
	  },

	  // alternate to one level deep
	  make: function make(tagName, attribute, dataAttribute, content) {
	    var el = '<' + tagName;

	    if (tagName === 'svg') {
	      el += ' version="1.1" xmlns="http://www.w3.org/2000/svg"';
	    }
	    el += composer.makePairs(attribute);
	    el += composer.makePairs('data', dataAttribute);
	    return el += '>' + (content || content === 0 ? content : '') + '</' + tagName + '>';
	  }
	};

	exports['default'] = composer;
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _composer = __webpack_require__(25);

	var _composer2 = _interopRequireDefault(_composer);

	var _utilsExtend = __webpack_require__(30);

	var _utilsExtend2 = _interopRequireDefault(_utilsExtend);

	var Draw = (function () {
	    function Draw() {
	        _classCallCheck(this, Draw);

	        var self = this;
	        return this;
	    }

	    _createClass(Draw, [{
	        key: 'getNode',
	        value: function getNode() {
	            var node = arguments[0] === undefined ? null : arguments[0];

	            var parent = null;
	            var self = this;
	            if (!node) {
	                node = self;
	            }
	            return { node: node, parent: parent };
	        }
	    }, {
	        key: 'create',
	        value: function create(svgElement) {
	            var self = this;
	            self.element = svgElement;
	            return self;
	        }
	    }, {
	        key: 'append',
	        value: function append(svgElement) {
	            var self = this;

	            var _self$getNode = self.getNode();

	            var node = _self$getNode.node;

	            node.children = node.children || [];

	            if (Array.isArray(svgElement)) {
	                node.children = node.children.concat(svgElement);
	            } else {
	                var svg = new Draw();
	                svgElement = svg.create(svgElement);
	                node.children.push(svgElement);
	            }
	            return self;
	        }
	    }, {
	        key: 'attr',
	        value: function attr(attrName, property) {
	            var self = this;

	            var _self$getNode2 = self.getNode();

	            var node = _self$getNode2.node;

	            node.attrs = node.attrs || {};

	            if (typeof attrName == 'object') {
	                (0, _utilsExtend2['default'])(node.attrs, attrName);
	            } else {
	                node.attrs[attrName] = property;
	            }
	            return self;
	        }
	    }, {
	        key: 'forEach',
	        value: function forEach(fn) {
	            var self = this;

	            var _self$getNode3 = self.getNode();

	            var node = _self$getNode3.node;

	            var children = node.children || [];
	            children.forEach(fn);
	            return self;
	        }
	    }, {
	        key: 'stringify',
	        value: function stringify() {
	            var self = this;

	            var _self$getNode4 = self.getNode();

	            var node = _self$getNode4.node;

	            var childContent = (node.children || []).map(function (svgObj) {
	                return svgObj.stringify();
	            });

	            return _composer2['default'].make(node.element, node.attrs, {}, childContent.join(''));
	        }
	    }]);

	    return Draw;
	})();

	module.exports = Draw;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(31);
	var randomColor = __webpack_require__(29);
	var Class = __webpack_require__(32);
	var Errors = __webpack_require__(18);
	var api = __webpack_require__(28);
	var composer = __webpack_require__(25);

	var isArray = function isArray(obj) {
	  return obj instanceof Array;
	};

	var inverseList = {
	  'x': 'x',
	  'y': 'y'
	};
	/**
	 * deep extend object or json properties
	 * @param  {object} object to extend
	 * @param  {object} object
	 * @return {object} global function object
	 */
	module.exports = Class.extend({

	  // default
	  init: function init() {
	    return this;
	  },

	  // data properties
	  props: {},

	  _sumOfData: api.sumOfData,

	  // accepts a N * 1 array
	  // finds total sum then creates a relative measure base on total sum
	  _dataSetRelativeToTotal: api.dataSetRelativeToTotal,

	  // random color generator
	  _randomColor: randomColor,

	  // appends the elements
	  // accepts multiple child
	  _append: composer.append,

	  // alternate to one level deep
	  make: composer.make,

	  // Deep copies an object
	  // TODO:: improve this
	  _deepCopy: function _deepCopy(objToCopy) {
	    return JSON.parse(JSON.stringify(objToCopy));
	  },

	  /**
	   * A super class calls right before return the svg content to the user
	   */
	  postRender: function postRender(svgContent) {
	    return svgContent;
	  },

	  /**
	   * [_isArray check if variable is an array]
	   * @param  any type
	   * @return {Boolean}   true if its an array
	   */
	  _isArray: isArray,

	  // Default ratio
	  _getRatio: function _getRatio(scale) {
	    scale.heightRatio = scale.height - (scale.paddingTop + scale.paddingBottom) / scale.max;
	  },

	  // Gets invert chart props defined by user
	  _getInvertProps: function _getInvertProps(scale) {
	    // Acceptable inverse flags to inverse the data set
	    var inverse = {};
	    if (scale.invert) {
	      for (var x in scale.invert) {
	        if (inverseList[scale.invert[x]]) {
	          inverse[inverseList[scale.invert[x]]] = true;
	        }
	      }
	    }
	    scale.hasInverse = inverse;
	  },

	  /**
	   * [_defineBaseScaleProperties defines the common scale properties]
	   * @param  {[obj]} data  [raw data set from user]
	   * @param  {[obj]} chart [chart properties passed by the user]
	   * @return {[obj]}       [return an obj that describes the scale base on the data & chart properties]
	   */
	  _defineBaseScaleProperties: function _defineBaseScaleProperties(data, chart) {
	    var self = this;
	    var opts = this.attributes.opts;
	    var chart = opts.chart;
	    var xAxis = chart.xAxis || opts.xAxis;
	    var yAxis = chart.yAxis || opts.yAxis;
	    var scale = self._scale(data, chart);
	    self._extend(scale, chart);
	    scale._data = data;
	    self._getInvertProps(scale);

	    if (chart.type != 'bubble-point' && (yAxis || xAxis)) {
	      self._getExternalProps(scale, yAxis, xAxis);
	      if (!self.describeYAxis) {
	        Errors.label();
	      }
	    }
	    self._getRatio(scale);
	    self.props.scale = scale;
	    return scale;
	  },

	  /**
	   * base on the feedback and mange the render of the life cycle
	   * it passes a immutable obj to preRender and audits the user feedback
	   */
	  // TODO:: Rename lifeCycleManager, incorrect term usage
	  _lifeCycleManager: function _lifeCycleManager(data, chart, describe) {
	    var self = this;
	    var scale = self._defineBaseScaleProperties(data, chart);
	    scale.componentName = self.componentName;
	    // check if there is any external steps needed to be done
	    if (self._call) {
	      self._call(scale);
	    }
	    // make the obj's shallow properties immutable
	    // we can know if we want to skip the entire process to speed up the computation
	    var properties = self.preRender ? self.preRender(Object.freeze(self._deepCopy(scale))) : 0;

	    // properties we will except
	    // - append
	    // - prepend
	    var paths = properties.prepend ? properties.prepend : [];
	    paths = paths.concat(describe(scale));
	    paths = paths.concat(properties.append ? properties.append : []);
	    return paths;
	    // return summary
	  },

	  // only supports 1 level deep
	  _makePairs: composer.makePairs,

	  // deep extend
	  _extend: function _extend(attr, json) {
	    var self = this;
	    if (!json || !attr) return;

	    var k = Object.keys(json),
	        len = k.length;
	    while (len--) {
	      if (typeof json[k[len]] !== 'object' || isArray(json[k[len]])) {
	        attr[k[len]] = json[k[len]];
	      } else {
	        //it has child objects, copy them too.
	        if (!attr[k[len]]) {
	          attr[k[len]] = {};
	        }
	        self._extend(attr[k[len]], json[k[len]]);
	      }
	    }
	    return this;
	  },

	  isFn: function isFn(object) {
	    return !!(object && object.constructor && object.call && object.apply);
	  },

	  _makeToken: function _makeToken() {
	    return Math.random().toString(36).substr(2);
	  },

	  //sig fig rounding
	  _sigFigs: api.sigFigs,

	  _getSplits: api.getSplits,

	  // find min max between multiple rows of data sets
	  // also handles the scale needed to work with multi axis
	  _scale: api.scale
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var asc = function asc(a, b) {
	  return a - b;
	};

	var api = module.exports = {

	  sigFigs: function sigFigs(n, sig) {
	    var mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
	    return Math.round(n * mult) / mult;
	  },

	  // Returns sum of data set
	  sumOfData: function sumOfData(data) {
	    return data.reduce(function (a, b) {
	      return a + b;
	    });
	  },

	  // accepts a N * 1 array
	  // finds total sum then creates a relative measure base on total sum
	  dataSetRelativeToTotal: function dataSetRelativeToTotal(data, total) {
	    return data.map(function (num) {
	      return num / total;
	    });
	  },

	  // calculates the number of yAxis sections base on the maxium value
	  getSplits: function getSplits(value) {
	    var set = {};
	    value = Math.ceil(value, 0); // make sure its a whole number
	    if (value === 0) return { max: 2, splits: 2 };

	    var supportedBorders = [3, 2, 5];
	    var digitLen = value.toString().length;
	    var ceil = splits = 0;

	    // now search for the best for number of borders
	    var checkIfSatisfy = function checkIfSatisfy(v) {
	      for (var i = 0; i < 3; i++) {
	        if (v % supportedBorders[i] === 0) return supportedBorders[i];
	      }
	      return 0;
	    };

	    var auditSplits = function auditSplits(v) {
	      var leftInt = parseInt(v.toString()[0]);
	      if (leftInt == 1) return 2;
	      return checkIfSatisfy(leftInt);
	    };

	    if (digitLen > 2) {
	      ceil = Math.ceil10(value, digitLen - 1);
	      splits = auditSplits(ceil);
	      if (!splits) {
	        ceil += Math.pow(10, digitLen - 1);
	        splits = auditSplits(ceil);
	      }
	    } else if (digitLen == 2) {
	      // double digit
	      ceil = value.toString();
	      if (ceil[1] <= 5 && (ceil[0] == 1 || ceil[0] == 2 || ceil[0] == 5 || ceil[0] == 7) && ceil[1] != 0) {
	        ceil = parseInt(ceil[0] + '5');
	      } else {
	        ceil = Math.ceil10(value, 1);
	        ceil = ceil == 70 ? 75 : ceil;
	      }
	      splits = checkIfSatisfy(ceil);
	    } else {
	      // single digit
	      ceil = value;
	      splits = checkIfSatisfy(ceil);
	      if (ceil == 5 || ceil == 3 || ceil == 2) {
	        splits = 1;
	      }
	      if (!splits) {
	        ceil += 1;
	        splits = auditSplits(ceil);
	      }
	    }

	    return {
	      max: ceil,
	      splits: splits
	    };
	  },

	  getScaleForMulti: function getScaleForMulti(data, rows, len) {
	    // across multi set
	    // each set of data needs ot have thier own individual min / max
	    var ySecs = {};
	    var min = [];
	    var max = [];

	    for (var i = 0; i < rows; i++) {
	      temp = data[i].slice(0).sort(asc);
	      min[i] = temp[0];
	      ans = api.getSplits(temp[len - 1]);
	      max[i] = ans.max;
	      ySecs[i] = ans.splits;
	      // delete temp;
	    }

	    return {
	      min: min,
	      max: max,
	      ySecs: ySecs
	    };
	  },

	  // data reduced base by column to find a new combined min / max
	  getStackedScale: function getStackedScale(data, rows, len, yAxis, min, max) {
	    var maxSet = [];
	    var ySecs = 0;

	    for (var i = 0; i < len; i++) {
	      var rowTotal = 0;
	      for (var j = 0; j < rows; j++) {
	        rowTotal += data[j][i];
	      }
	      maxSet.push(rowTotal);
	      max = max < rowTotal ? rowTotal : max;
	      min = min > rowTotal ? rowTotal : min;
	    }

	    if (yAxis) {
	      ans = api.getSplits(max);
	      max = ans.max;
	      ySecs = ans.splits;
	    }

	    return {
	      min: min,
	      max: max,
	      ySecs: ySecs,
	      maxSet: maxSet
	    };
	  },

	  // for bubble and need to find min / max across the x, y , z axis
	  getBubbleScatterScale: function getBubbleScatterScale(data, rows, len, yAxis) {
	    var ySecs = 0;
	    var min = [];
	    var max = [];

	    for (var x = 0; x < 3; x++) {
	      min[x] = Number.MAX_VALUE;
	      max[x] = 0;
	    }

	    for (var i = 0; i < len; i++) {
	      for (var j = 0; j < rows; j++) {
	        for (var c = 0; c < 3; c++) {
	          max[c] = max[c] < data[j][i][c] ? data[j][i][c] : max[c];
	          min[c] = min[c] > data[j][i][c] ? data[j][i][c] : min[c];
	        }
	      }
	    }

	    if (yAxis) {
	      ans = api.getSplits(max[1]);
	      max[1] = ans.max;
	      ySecs = ans.splits;
	    }

	    return {
	      min: min,
	      max: max,
	      ySecs: ySecs
	    };
	  },

	  // find min / max across the entire data set
	  getSimpleScale: function getSimpleScale(data, rows, len, yAxis, min, max) {
	    var ySecs = 0;

	    for (var i = 0; i < rows; i++) {
	      temp = data[i].slice(0).sort(asc);
	      min = min > temp[0] ? temp[0] : min;
	      max = max < temp[len - 1] ? temp[len - 1] : max;
	      // delete temp;
	    }

	    if (yAxis) {
	      ans = api.getSplits(max);
	      max = ans.max;
	      ySecs = ans.splits;
	    }

	    return {
	      min: min,
	      max: max,
	      ySecs: ySecs
	    };
	  },

	  // find min max between multiple rows of data sets
	  // also handles the scale needed to work with multi axis
	  scale: function scale(data, opts) {
	    opts = opts || 0;
	    data = typeof data[0] === 'object' ? data : [data];
	    var max = 0;
	    var yAxis = opts.yAxis || (opts.chart ? opts.chart.yAxis : 0);
	    var min = Number.MAX_VALUE;
	    var maxSet = [];
	    var temp;
	    var ans;
	    var self = this;
	    var ySecs = 0;
	    var getSplits = api.getSplits;
	    var color = [];

	    // change up the structure if the data set is an object
	    if (data[0].data || data[0].data == 0) {
	      temp = [];
	      for (var x = 0; x < data.length; x++) {
	        temp.push(data[x].data);
	        color.push(data[x].strokeColor);
	      }
	      if (opts.complex) {
	        data = [temp];
	      } else {
	        data = temp;
	      }
	    }

	    var rows = data.length;
	    var len = data[0].length;

	    if (yAxis && yAxis.multi) {

	      var result = api.getScaleForMulti(data, rows, len);
	      min = result.min;
	      max = result.max;
	      ySecs = result.ySecs;
	    } else if (opts.stack) {

	      var result = api.getStackedScale(data, rows, len, yAxis, min, max);
	      min = result.min;
	      max = result.max;
	      ySecs = result.ySecs;
	      maxSet = result.maxSet;
	    } else if (opts.type == 'bubble-scattered') {

	      var result = api.getBubbleScatterScale(data, rows, len, yAxis);
	      min = result.min;
	      max = result.max;
	      ySecs = result.ySecs;
	    } else {

	      var result = api.getSimpleScale(data, rows, len, yAxis, min, max);
	      min = result.min;
	      max = result.max;
	      ySecs = result.ySecs;
	    }

	    return {
	      min: min,
	      max: max,
	      maxSet: maxSet,
	      len: len,
	      rows: rows,
	      ySecs: ySecs,
	      color: color
	    };
	  }
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	exports['default'] = function () {
	  return '#' + Math.floor(Math.random() * 16777215).toString(16);
	};

	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Extend property
	 */
	var isArray = function isArray(obj) {
	  return obj instanceof Array;
	};
	var extend = module.exports = function (props) {
	  var self = this;
	  if (arguments.length > 1) {
	    self = arguments[0];
	    props = arguments[1];
	  }
	  var keys = Object.keys(props);
	  for (var i = 0; i < keys.length; i++) {
	    self[keys[i]] = props[keys[i]];
	  }
	  return self;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Code from MDN
	 * Decimal adjustment of a number.
	 *
	 * @param   {String}    type    The type of adjustment.
	 * @param   {Number}    value   The number.
	 * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
	 * @returns {Number}            The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
	    // If the exp is undefined or zero...
	    if (typeof exp === 'undefined' || +exp === 0) {
	        return Math[type](value);
	    }
	    value = +value;
	    exp = +exp;
	    // If the value is not a number or the exp is not an integer...
	    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
	        return NaN;
	    }
	    // Shift
	    value = value.toString().split('e');
	    value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
	    // Shift back
	    value = value.toString().split('e');
	    return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
	}
	// Decimal round
	if (!Math.round10) {
	    Math.round10 = function (value, exp) {
	        return decimalAdjust('round', value, exp);
	    };
	}
	// Decimal floor
	if (!Math.floor10) {
	    Math.floor10 = function (value, exp) {
	        return decimalAdjust('floor', value, exp);
	    };
	}
	// Decimal ceil
	if (!Math.ceil10) {
	    Math.ceil10 = function (value, exp) {
	        return decimalAdjust('ceil', value, exp);
	    };
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Class provides simple JavaScript inheritance.
	 * by John Resig
	 * MIT Licensed
	 */
	function isFunction(object) {
	  return typeof object == 'function';
	}

	function hasSuper(name) {
	  return /\b_super\b/.test(name);
	}

	var Class = module.exports = function doNothing() {};

	Class.extend = function extend(properties) {
	  var _super = this.prototype;

	  // Instantiate a base class without running the init constructor.
	  var init = this.prototype.init;
	  this.prototype.init = null;
	  var prototype = new this();
	  this.prototype.init = init;

	  // Copy the properties over onto the new prototype.
	  for (var name in properties) {
	    // Check if we're overwriting an existing function.
	    var property = properties[name];
	    prototype[name] = isFunction(property) && isFunction(_super[name]) && hasSuper(property) ? (function createMethod(name, fn) {
	      return function method() {
	        var tmp = this._super;

	        // Add a new ._super() method that is the same method but on the super-class.
	        this._super = _super[name];

	        // The method only needs to be bound temporarily, so remove it when we're done executing.
	        var ret = fn.apply(this, arguments);
	        this._super = tmp;

	        return ret;
	      };
	    })(name, property) : property;
	  }

	  // The dummy class constructor.
	  function Class() {
	    if (this.init) {
	      this.init.apply(this, arguments);
	    }
	  }

	  // Populate our constructed prototype object.
	  Class.prototype = prototype;

	  // Enforce the constructor to be what we expect.
	  Class.prototype.constructor = Class;

	  // And make this class extendable.
	  Class.extend = arguments.callee;

	  return Class;
	};

/***/ }
/******/ ])