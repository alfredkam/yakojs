var chai = require('chai');
var expect = chai.expect;
var Common = require('../../src/classes/common');

describe('src/classes/common', function () {
    var common;
    before(function () {
        common = new Common();
    });

    it('init', function () {
        expect(common)
            .to.be.an.instanceof(Common);
    });

    it('_append as string', function () {
        var child = '<g>123</g>';
        var parent = '<svg></svg>';
        var expected = '<svg><g>123</g></svg>';
        expect(common._append(parent, child))
            .to.equal(expected);
    });

    it('_append as [string array]', function () {
        var childs = ['<g>123</g>','<g>123</g>'];
        var parent = '<svg></svg>';
        var expected = '<svg><g>123</g><g>123</g></svg>';
        var result = common._append(parent, childs);
        expect(result)
            .to.equal(expected);
    });

    it('_getInvertProps should return an accepted scale', function () {
      var scale = {
        invert: ['y']
      };
      common._getInvertProps(scale);
      expect(scale.hasInverse)
        .to.deep.equal({
          y: true
        });
    });

    it('_sumOfData should return the total sum of dataset', function () {
        var x = [0,1,2,4,5,6,7,8,9,10];
        var total = common._sumOfData(x);
        expect(total).to.equal(52);
    });

    it('_dataSetRelativeToTotal should create a relative measure base on total', function () {
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
        var total = common._sumOfData(x);
        expect(common._dataSetRelativeToTotal(x, total))
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

        var result = common._scale(set);

        expect(result.min)
            .to.equal(0);
        expect(result.max)
            .to.equal(9);
        expect(result.len)
            .to.equal(5);
    });

    it('_scale (single array) should return the min and max of set', function () {
        var set = [
            [0,1,2,3,4]
        ];

        var result = common._scale(set);

        expect(result.min)
            .to.equal(0);
        expect(result.max)
            .to.equal(4);
        expect(result.len)
            .to.equal(5);

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

        var result = common._scale(set);

        expect(result.min)
           .to.equal(0);
        expect(result.max)
           .to.equal(9);
        expect(result.len)
           .to.equal(5);
    });


    it('_scale (stack = true, multiple array) should return the min and max of set', function () {
        var set = [
            [0,1,2,3,4],
            [5,6,7,8,9]
        ];

        var result = common._scale(set, {stack: true});

        expect(result.min)
           .to.equal(5);
        expect(result.max)
           .to.equal(13);
        expect(result.len)
           .to.equal(5);
        expect(result.maxSet)
            .to.deep.equal([5,7,9,11,13]);

    });

    it('_scale (stack = true, single array) should return the min and max of set', function () {
        var set = [
            [0,1,2,3,4]
        ];

        var result = common._scale(set, {stack: true});

        expect(result.min)
           .to.equal(0);
        expect(result.max)
           .to.equal(4);
        expect(result.len)
           .to.equal(5);
        expect(result.maxSet)
            .to.deep.equal([0,1,2,3,4]);

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

        var result = common._scale(set, {stack: true});

        expect(result.min)
           .to.equal(5);
        expect(result.max)
           .to.equal(13);
        expect(result.len)
           .to.equal(5);
        expect(result.maxSet)
            .to.deep.equal([5,7,9,11,13]);
    });

    it('_scale (yAxis = true, obj with data) should return the min and max of set and ySecs', function () {
        var set = [
            {
                data: [0,1,2,3,4]
            },
            {
                data: [5,6,7,8,9]
            }
        ];

        var result = common._scale(set, {yAxis: true});

        expect(result.min)
           .to.equal(0);
        expect(result.max)
           .to.equal(9);
        expect(result.len)
           .to.equal(5);
        expect(result.ySecs)
            .to.equal(3);
    });

    it('_scale (yAxis : multi = true, obj with data) should return the min and max of set and ySecs', function () {
        var set = [
            {
                data: [0,1,2,3,4]
            },
            {
                data: [5,6,7,8,9]
            }
        ];

        var result = common._scale(set, {yAxis: { multi : true}});

        expect(result.min)
            .to.deep.equal([0,5]);
        expect(result.max)
            .to.deep.equal([4,9]);
        expect(result.len)
            .to.equal(5);
        expect(result.rows)
            .to.equal(2);
        expect(result.ySecs)
            .to.deep.equal({ '0': 2, '1': 3 });

    });

    it('_scale (type: "bubble-scattered") should return the min and max of set', function () {
        var set = [
            {
                data: [
                    [0,1,2],
                    [1,2,3],
                    [2,3,4],
                    [3,4,5],
                    [4,5,6]
                ]
            },
            {
                data: [
                    [5,6,7],
                    [6,7,8],
                    [7,8,9],
                    [8,9,10],
                    [9,10,11]
                ]
            }
        ];

        var result = common._scale(set, {type: 'bubble-scattered'});

        expect(result.max)
            .to.deep.equal([ 9, 10, 11 ]);

        expect(result.min)
            .to.deep.equal([0, 1, 2]);

        expect(result.len)
            .to.equal(5);

        expect(result.rows)
            .to.equal(2);
    });

    it('_deepCopy should return a json copy', function () {
        var json = {
            a : {
                b : {
                    c : 1
                }
            },
            k : {
                k : {
                    a : 'a'
                }
            }
        };

        var result = common._deepCopy(json);

        expect(result)
            .to.deep.equal(json);

        json.a.b = 1;
        expect(result)
            .to.not.equal(json);

    });

    it('_getSplits should return splits, checks number length from 3+ positions to 1 position', function () {
        expect(common._getSplits(1000))
            .to.deep.equal({ max: 1000, splits: 2});
        expect(common._getSplits(853))
            .to.deep.equal({ max: 900, splits: 3 });
        expect(common._getSplits(800))
            .to.deep.equal({ max: 800, splits: 2 });
        expect(common._getSplits(700))
            .to.deep.equal({ max: 800, splits: 2 });
        expect(common._getSplits(600))
            .to.deep.equal({ max: 600, splits: 3 });
        expect(common._getSplits(500))
            .to.deep.equal({ max: 500, splits: 5 });
        expect(common._getSplits(400))
            .to.deep.equal({ max: 400, splits: 2 });
        expect(common._getSplits(350))
            .to.deep.equal({ max: 400, splits: 2 });
        expect(common._getSplits(300))
            .to.deep.equal({ max: 300, splits: 3 });
        expect(common._getSplits(180))
            .to.deep.equal({ max: 200, splits: 2 });
        expect(common._getSplits(100))
            .to.deep.equal({ max: 100, splits: 2 });

        expect(common._getSplits(95))
            .to.deep.equal({ max: 100, splits: 2 });
        expect(common._getSplits(80))
            .to.deep.equal({ max: 80, splits: 2 });
        expect(common._getSplits(70))
            .to.deep.equal({ max: 75, splits: 3 });
        expect(common._getSplits(75))
            .to.deep.equal({ max: 75, splits: 3 });
        expect(common._getSplits(65))
            .to.deep.equal({ max: 75, splits: 3 });
        expect(common._getSplits(50))
            .to.deep.equal({ max: 50, splits: 2 });
        expect(common._getSplits(30))
            .to.deep.equal({ max: 30, splits: 3 });
        expect(common._getSplits(25))
            .to.deep.equal({ max: 25, splits: 5 });
        expect(common._getSplits(20))
            .to.deep.equal({ max: 20, splits: 2});
        expect(common._getSplits(15))
            .to.deep.equal({ max: 15, splits: 3 });
        expect(common._getSplits(10))
            .to.deep.equal({ max: 10, splits: 2 });

        expect(common._getSplits(9))
            .to.deep.equal({ max: 9, splits: 3});
        expect(common._getSplits(8))
            .to.deep.equal({ max: 8, splits: 2});
        expect(common._getSplits(7))
            .to.deep.equal({ max: 8, splits: 2});
        expect(common._getSplits(6))
            .to.deep.equal({ max: 6, splits: 3});
        expect(common._getSplits(5))
            .to.deep.equal({ max: 5, splits: 1});
        expect(common._getSplits(4))
            .to.deep.equal({ max: 4, splits: 2});
        expect(common._getSplits(3))
            .to.deep.equal({ max: 3, splits: 1});
        expect(common._getSplits(2))
            .to.deep.equal({ max: 2, splits: 1});
        expect(common._getSplits(2))
            .to.deep.equal({ max: 2, splits: 1});

    });
});
