/* istanbul ignore next */
var warn = function (msg) {
  console.warn(msg);
};

/* istanbul ignore next */
module.exports = {

  label: function () {
    warn("You're attempting to use labels without the `Label` addons.  Check documentation https://github.com/alfredkam/yakojs/blob/master/doc.md");
  },

  eventFeedback: function (componentName) {
    warn("No event feedback associated with chart component " + componentName);
  },

  insufficientRange: function (componentName) {
    warn("A 'maxRange: [x, y, z]' must be passed in for " + componentName);
  }
};
