import path from './path';
import arc from './arc';
import rect from './rect';
import composer from './composer';
import Draw from './draw';

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
