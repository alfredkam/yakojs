/**
 * An addon to return content as an object
 * Usage documentation under https://github.com/alfredkam/yakojs/blob/master/doc.md#returnasobject
 */

var isArray = function (obj) {
    return obj instanceof Array;
};

var obj = module.exports = {
    // Extends default make from lib/base/common.js
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