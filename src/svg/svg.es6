import path from './path';
import arc from './arc';
import rect from './rect';
import composer from './composer.es6';
import Draw from './draw.es6';

module.exports = {

    path: path,

    arc: arc,

    rect: rect,

    composer: composer,

    create (svgElement) {
        var instance = new Draw();
        return instance.create(svgElement);
    }
};
