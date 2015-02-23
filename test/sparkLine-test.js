var chai = require('chai');
var expect = chai.expect;
var SparkLine = require('../lib/sparkLine');

describe('lib/sparkLine', function () {
    var spark;
    before(function () {
        spark = new SparkLine();
    });

    after(function () {
        spark = '';
    });

    it('_describePath should return a path string', function () {
        var path = spark._describePath(
            {
                data: [ 0, 1, 2, 3, 4],
            },
            5,
            5,
            {
                chart: {
                    height: 300,
                    width: 100,
                    line: true
                },
                heightRatio: 290 / 4,
                gap: spark._sigFigs((100 / 4),8)
            }
        );
        expect(path)
            .to.be.a('string')
            .to.satisfy(function (str) {
                return /M 5 295 L 30 222.5 L 55 150 L 80 77.5 L 105 5/i.test(str);
            });
    });

    it('calling attr should render w/ default properties should render 1 series', function () {
          var set = { data:
           [ 100, 45, 500, 264, 380, 126, 186, 291, 69 ],
          strokeColor: '#2b26a0',
          fill: '#6bd775' };

        var svg = spark.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
            },
            title: 'just a test',
            data: set
        });

        expect(svg)
            .that.is.a('string').
            to.satisfy(function (result) {
                return /<path\s.*>/i.test(result) && !/<circle\s.*>/i.test(result);
            });
    });

    it('calling attr should render w/ default properties should render 2 series', function () {
          var set = [ { data:
           [ 100, 45, 500, 264, 380, 126, 186, 291, 69 ],
          strokeColor: '#2b26a0',
          fill: '#6bd775' },
        { data:
           [ 271, 335, 216, 195, 423, 332, 413, 171, 241 ],
          strokeColor: '#1dbc53',
          fill: '#befb6f' } ];

        var svg = spark.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
            },
            title: 'just a test',
            data: set
        });

        expect(svg)
            .that.is.a('string').
            to.satisfy(function (result) {
                return /<path\s.*>/i.test(result);
            });
    });

    it('calling attr should render w/ line false should not render path', function () {
          var set = [ { data:
           [ 100, 45, 500, 264, 380, 126, 186, 291, 69 ],
          strokeColor: '#2b26a0',
          fill: '#6bd775' },
        { data:
           [ 271, 335, 216, 195, 423, 332, 413, 171, 241 ],
          strokeColor: '#1dbc53',
          fill: '#befb6f' } ];

        var svg = spark.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
              line: false
            },
            title: 'just a test',
            data: set
        });

        expect(svg)
            .that.is.a('string').
            to.satisfy(function (result) {
                return !/<path\s.*>/i.test(result);
            });
    });

    it('calling attr should render w/ line false and scattered true should render a scattered graph', function () {
          var set = [ { data:
           [ 100, 45, 500, 264, 380, 126, 186, 291, 69 ],
          strokeColor: '#2b26a0',
          fill: '#6bd775' },
        { data:
           [ 271, 335, 216, 195, 423, 332, 413, 171, 241 ],
          strokeColor: '#1dbc53',
          fill: '#befb6f' } ];

        var svg = spark.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
              line: false,
              scattered: true
            },
            title: 'just a test',
            data: set
        });

        expect(svg)
            .that.is.a('string').
            to.satisfy(function (result) {
                return !/<path\s.*>/i.test(result) && /<circle\s.*>/i.test(result);
            });
    });

    it('calling attr should render w/ line false and scattered true should render a scattered graph', function () {
          var set = [ { data:
           [ 100, 45, 500, 264, 380, 126, 186, 291, 69 ],
          strokeColor: '#2b26a0',
          fill: '#6bd775' },
        { data:
           [ 271, 335, 216, 195, 423, 332, 413, 171, 241 ],
          strokeColor: '#1dbc53',
          fill: '#befb6f' } ];

        var svg = spark.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
              line: false,
              scattered: true
            },
            title: 'just a test',
            data: set
        });

        expect(svg)
            .that.is.a('string').
            to.satisfy(function (result) {
                return !/<path\s.*>/i.test(result) && /<circle\s.*>/i.test(result);
            });
    });

    it('calling attr should render w/ scattered true should render a scattered graph w/ area filled ', function () {
          var set = [ { data:
           [ 100, 45, 500, 264, 380, 126, 186, 291, 69 ],
          strokeColor: '#2b26a0',
          fill: '#6bd775' },
        { data:
           [ 271, 335, 216, 195, 423, 332, 413, 171, 241 ],
          strokeColor: '#1dbc53',
          fill: '#befb6f' } ];

        var svg = spark.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
              scattered: true
            },
            title: 'just a test',
            data: set
        });

        expect(svg)
            .that.is.a('string').
            to.satisfy(function (result) {
                return /<path\s.*>/i.test(result) && /<circle\s.*>/i.test(result);
            });
    });

    it('calling attr should render w/ scattered true should render a scattered graph w/ line & no area filled', function () {
          var set = [ { data:
           [ 100, 45, 500, 264, 380, 126, 186, 291, 69 ],
          strokeColor: '#2b26a0'},
        { data:
           [ 271, 335, 216, 195, 423, 332, 413, 171, 241 ],
          strokeColor: '#1dbc53'} ];

        var svg = spark.attr({
            chart : {
              type: 'line',
              width: 300,
              height: 100,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
              scattered: true
            },
            title: 'just a test',
            data: set
        });

        expect(svg)
            .that.is.a('string').
            to.satisfy(function (result) {
                return  /<path\s.*>/i.test(result) &&
                        /<circle\s.*>/i.test(result) &&
                        !/V\s.*H\s.*L\s.*>/i.test(result);  // for closing graph
            });
    });
});