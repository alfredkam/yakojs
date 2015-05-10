var composer = module.exports = {
  makePairs: function (prefix, json) {
    if (!prefix) return '';

    if (arguments.length < 2) {
      json = prefix;
      prefix = '';
    } else {
      prefix += '-';
    }

    if (!json) return '';

    var keys = Object.keys(json), len = keys.length;
    var str = '';
    while (len--) {
      str += ' ' + prefix + keys[len] + '="' + json[keys[len]] + '"';
    }
    return str;
  },

  append: function (parent, childs) {
    if (parent === '') return childs;
    if (!isArray(childs)) {
      childs = [childs];
    }
    return parent.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
        return p1 + childs.join("") + p2;
    });
  },

  // alternate to one level deep
  make: function (tagName, attribute, dataAttribute, content) {
    var el = '<' + tagName;

    if (tagName === 'svg') {
        el += ' version="1.1" xmlns="http://www.w3.org/2000/svg"';
    }
    el += composer.makePairs(attribute);
    el += composer._makePairs('data', dataAttribute);
    return el += '>' + (content || content === 0 ? content : '') + '</'+tagName+'>';
  }
};
