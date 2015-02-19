var chai = require('chai');
var expect = chai.expect;
var Arc = require('../../lib/base/arc');

describe('/lib/base/arc', function () {
    var arc;
    before(function () {
        arc = new Arc();
    });

    it('_describePath is the super class', function () {
        expect(arc._describePath)
            .to.satisfy(function (object) {
                return !!(object && object.constructor && object.call && object.apply);
            });
    });

    it('should return a string with attr wrapped w/ defined properties', function () {
        var result = arc.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
              showPointer: false,
            },
            data: [ 100, 45, 500, 195, 371, 121, 274, 275]
        });

        var expected = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" height="100" width="300"></svg>';
        expect(result)
            .to.be.a('string')
            .to.equal(expected);
    });
});
