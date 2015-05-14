var mixin = module.exports = function (component, obj) {
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            component = component.extend(obj[i]);
        }
        return component;
    }
    return component.extend(obj);
};