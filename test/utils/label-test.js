var chai = require('chai');
var expect = chai.expect;
var Label = require('../../lib/utils/label');

describe('lib/utils/label', function () {
    var label;
    var scale;
    before(function () {
        label = new Label();
        scale = { min: { '0': 30, '1': 24 },
          max: { '0': 300, '1': 600 },
          maxSet: [],
          len: 10,
          rows: 2,
          ySecs: { 0: 3, 1: 3 },
          color: [ 'red', 'blue' ],
          scattered: false,
          line: true,
          'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
          height: 500,
          width: 1200,
          pHeight: 460,
          paddingY: 20,
          paddingX: 30 };
    });

    it('describeYAxis (scale, multi : true ) should return a yaxis border', function () {
        var result = label.describeYAxis(scale, {multi: true});
        expect(result)
            .to.be.a('array')
            .to.have.length(2)
            .to.satisfy(function (arr) {
                return /text/.test(arr[0]) && /text/.test(arr[1]);
            });
    });

    it('describeYAxis (scale, true) should return a yaxis label set', function () {
        scale.ySecs = 3;
        scale.max = 300;
        var result = label.describeYAxis(scale, true);
        expect(result)
            .to.be.a('array')
            .to.have.length(1)
            .to.satisfy(function (arr) {
                return /text/.test(arr[0]);
            });
    });

    it('describeXAxis (scale, opts) should return a xaxis label set', function () {
        var scale = { min: { '0': 68, '1': 30 },
          max: { '0': 600, '1': 500 },
          maxSet: [],
          len: 10,
          rows: 2,
          ySecs: { '0': 3, '1': 5 },
          color: [ 'red', 'blue' ],
          scattered: false,
          line: true,
          'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
          height: 500,
          width: 1200,
          pHeight: 460,
          paddingY: 20,
          paddingX: 30,
          heightRatio: NaN,
          gap: 125.55556 };

        var opts = { dateTimeLabelFormat: 'MM/DD hh ap',
          minUTC: 1378512000000,
          interval: '4h',
          format: 'dateTime' };

        var result = label.describeXAxis(scale, opts);
        expect(result)
            .to.be.a('array')
            .to.have.length(1)
            .to.satisfy(function (arr) {
                return /text/.test(arr[0]);
            });
    });

    it('_utcMultiplier should return utc', function () {
        expect(label._utcMultiplier('1s'))
            .to.equal(1000);
        expect(label._utcMultiplier('1m'))
            .to.equal(6e4);
        expect(label._utcMultiplier('1h'))
            .to.equal(3600000);
        expect(label._utcMultiplier('1D'))
            .to.equal(86400000);
        expect(label._utcMultiplier('1M'))
            .to.equal(2592000000);
        expect(label._utcMultiplier('1Y'))
            .to.equal(31104000000);
    });

    it('_formatTimeStamp should return the desired time format', function () {
        var base = 1378512000000;
        expect(label._formatTimeStamp('YY/MM', base + 3600000))
            .to.equal('13/9');
        expect(label._formatTimeStamp('YYYY', base + 3600000))
            .to.equal('2013');
        expect(label._formatTimeStamp('mm.ss', base + 3600000))
            .to.equal('00.00');
    });
    
});