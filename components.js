var yako = require('./addons');                          // Require yako with addons
var components = require('./lib/addons/react-components');   // Require react components build with yako
yako.components = components;
module.exports = yako;
