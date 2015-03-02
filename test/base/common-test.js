var chai = require('chai');
var expect = chai.expect;
var Common = require('../../lib/base/common');

describe('lib/base/common', function () {
    var common;
    before(function () {
        common = new Common();
    });

    it('init', function () {
        expect(common)
            .to.be.an.instanceof(Common);
    });

    it('append as string', function () {
        var child = '<g>123</g>';
        var parent = '<svg></svg>';
        var expected = '<svg><g>123</g></svg>';
        expect(common.append(parent, child))
            .to.equal(expected);
    });

    it('append as [string array]', function () {
        var childs = ['<g>123</g>','<g>123</g>'];
        var parent = '<svg></svg>';
        var expected = '<svg><g>123</g><g>123</g></svg>';
        var result = common.append(parent, childs);
        expect(result)
            .to.equal(expected);
    });

    it('_dataSetRelativeToTotal should combine and create a relative measure base on total', function () {
        var x = [0,1,2,4,5,6,7,8,9,10];
        var expected = [ 0,
                      0.019230769230769232,
                      0.038461538461538464,
                      0.07692307692307693,
                      0.09615384615384616,
                      0.11538461538461539,
                      0.1346153846153846,
                      0.15384615384615385,
                      0.17307692307692307,
                      0.19230769230769232 ];
        expect(common._dataSetRelativeToTotal(x))
            .that.is.an('array')
            .that.deep.equals(expected);
    });

    it('_randomColor should generate a random hex', function () {
        expect(common._randomColor())
            .to.have.length.within(6,7)
            .that.is.a('string')
            .to.satisfy(function (str) {
                return str[0] === '#';
            });
    });

    it('make (svg) should generate a string depending on the provided attributes', function () {
        expect(common.make('svg',{
            height: 100,
            width: 100
        },{
            label: 'test'
        }))
        .that.is.a('string')
        .to.equal('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100" data-label="test"></svg>');
    });

    it('make (other elements other then svg) should generate a string depending on the provided attributes', function () {
        expect(common.make('g',{
            height: 100,
            width: 100
        }))
        .that.is.a('string')
        .to.equal('<g width="100" height="100"></g>');
    });

    it('_makePairs should create x=y pairs', function () {
        expect(common._makePairs({
            height: 100,
            width: 100
        }))
        .that.is.a('string')
        .to.equal(' width="100" height="100"');
    });

    it('_extend should extend deep object properties', function () {
        var json = {
            x: 1,
            y: 2,
            z: {
                x: 1,
                y: 2
            }
        };

        var def = {
            a: "b",
            x: 10,
        };

        common._extend(def, json);
        expect(def)
        .to.deep.equal({
            a: 'b',
            x: 1,
            z: {
                    y: 2,
                    x: 1
                },
            y: 2
        });
    });

    it('isFn checks if its a function', function () {
        expect(common.isFn())
            .to.be.false;
        expect(common.isFn(function () {}))
            .to.be.true;
    });

    it('_sigFig should round to desired sigfig', function () {
        expect(common._sigFigs((100 / (9)),8))
            .to.be.equal(11.111111)
            .that.is.a('number');
    });

    it('_scale (multiple array) should return the min and max of set', function () {
        var set = [
            [0,1,2,3,4],
            [5,6,7,8,9]
        ];

        expect(common._scale(set))
            .to.deep.equal({ min: 0, max: 9, maxSet: [], len: 5 });
    });

    it('_scale (single array) should return the min and max of set', function () {
        var set = [
            [0,1,2,3,4]
        ];

        expect(common._scale(set))
            .to.deep.equal({ min: 0, max: 4, maxSet: [], len: 5 });
    });

    it('_scale (obj with data) should return the min and max of set', function () {
        var set = [
            {
                data: [0,1,2,3,4]
            },
            {
                data: [5,6,7,8,9]
            }
        ];
        expect(common._scale(set))
            .to.deep.equal({ min: 0, max: 9, maxSet: [], len: 5 });
    });


    it('_scale (stack = true, multiple array) should return the min and max of set', function () {
        var set = [
            [0,1,2,3,4],
            [5,6,7,8,9]
        ];

        expect(common._scale(set, { stack: true }))
            .to.deep.equal({ min: 5, max: 13, maxSet: [5,7,9,11,13], len: 5 });
    });

    it('_scale (stack = true, single array) should return the min and max of set', function () {
        var set = [
            [0,1,2,3,4]
        ];

        expect(common._scale(set, { stack: true}))
            .to.deep.equal({ min: 0, max: 4, maxSet: [0,1,2,3,4], len: 5 });
    });

    it('_scale (stack = true, obj with data) should return the min and max of set', function () {
        var set = [
            {
                data: [0,1,2,3,4]
            },
            {
                data: [5,6,7,8,9]
            }
        ];
        expect(common._scale(set, { stack: true }))
            .to.deep.equal({ min: 5, max: 13, maxSet: [5,7,9,11,13], len: 5 });
    });
});