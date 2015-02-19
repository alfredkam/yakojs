var chai = require('chai');
var expect = chai.expect;
var Base = require('../lib/base');

describe('lib/base', function () {
    var base;
    after(function () {
        base = '';
    });

    it('should create a element with div class wrapped', function () {
        base = new Base('.graph');
        expect(base.element)
            .to.be.equal('<div width="100%" class="graph"></div>');
    });

    it('should create a element with div id wrapped', function () {
        base = new Base('#graph');
        expect(base.element)
            .to.be.equal('<div width="100%" id="graph"></div>');
    });

    it('should return empty', function () {
        base = new Base();
        expect(base.element)
            .to.be.equal('');
    });

    it('should return this', function () {
        var obj = {
            style: {
                width: '100%'
            },
            innerHTML: ''
        };
        base = new Base(obj);
        expect(base.element)
            .to.deep.equal(obj);
    });
});