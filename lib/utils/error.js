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