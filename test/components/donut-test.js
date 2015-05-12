var chai = require('chai');
var expect = chai.expect;
var donutChart = require('../../lib/components/donut');

describe('lib/donut', function () {
    var donut;
    before(function () {
        donut = new donutChart();
    });

    after(function () {
        donut = '';
    });

    it('_describePath should return an array of paths & without NaN', function () {
        var radius = 50;
        var data =  [
          0.04800768122899664,
          0.028924627940470474,
          0.0022803648583773406,
          0.04200672107537206,
          0.05892942870859338,
          0.040206433029284686,
          0.053168506961113776,
          0.04788766202592415,
          0.024963994239078253,
          0.05736917906865099,
          0.04656745079212674,
          0.0142822851656265,
          0.054368698991838695,
          0.0037205952952472396,
          0.03960633701392223,
          0.03084493518963034,
          0.043686989918386945,
          0.007921267402784446,
          0.02556409025444071,
          0.0200432069131061,
          0.011521843494959194,
          0.008281325012001921,
          0.04956793086893903,
          0.04668746999519923,
          0.01668266922707633,
          0.0542486797887662,
          0.015602496399423908,
          0.04404704752760442,
          0.043686989918386945,
          0.019323091694671148
        ];
        var chart = {
            relativeDataSet: [ 
             0.04800768122899664,
             0.028924627940470474,
             0.0022803648583773406,
             0.04200672107537206,
             0.05892942870859338,
             0.040206433029284686,
             0.053168506961113776,
             0.04788766202592415,
             0.024963994239078253,
             0.05736917906865099,
             0.04656745079212674,
             0.0142822851656265,
             0.054368698991838695,
             0.0037205952952472396,
             0.03960633701392223,
             0.03084493518963034,
             0.043686989918386945,
             0.007921267402784446,
             0.02556409025444071,
             0.0200432069131061,
             0.011521843494959194,
             0.008281325012001921,
             0.04956793086893903,
             0.04668746999519923,
             0.01668266922707633,
             0.0542486797887662,
             0.015602496399423908,
             0.04404704752760442,
             0.043686989918386945,
             0.019323091694671148 ],
          outerRadius: 50,
          innerRadius: 40,
          scattered: false,
          fill: true,
          line: true,
          paddingBottom: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          height: 100,
          width: 300,
          type: 'chart' };

        var result = donut._describePath(radius, data, chart);
        expect(result)
            .to.be.a('array')
            .to.satisfy(function (result) {
                return (/<path\s.*>/i).test(result.join("")) && !(/NaN/).test(result.join(""));
            });
    });

    it('_describeDonut should describe a segment of donut in string', function () {
        var x = 150;
        var y = 50;
        var outerRadius = 50;
        var innerRadius = 40;
        var startAngle =  202.42438790206432;
        var endAngle = 213.52856457033124;

        var result = donut._describeDonut(x, y, outerRadius, innerRadius, startAngle, endAngle);
        expect(result)
            .to.be.a('string')
            .to.satisfy(function (result) {
                return /M 122.38236765104345 91.68052762907242 A 50 50 0 0 0 130.9268062956573 96.21918737836722 L 134.74144503652582 86.97534990269378 A 40 40 0 0 1 127.90589412083477 83.34442210325793 L 122.38236765104345 91.68052762907242 Z/.test(result);
            });
    });

});