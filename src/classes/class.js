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
    prototype[name] = isFunction(property) && isFunction(_super[name]) && hasSuper(property) ?
      (function createMethod(name, fn) {
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