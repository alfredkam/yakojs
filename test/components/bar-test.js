var chai = require('chai');
var expect = chai.expect;
var barGraph = require('../../lib/components/bar');

describe('lib/bar', function () {
    var bar;
    before(function () {
        bar = new barGraph();
    });

    after(function () {
        bar = '';
    });

    it('_describeBar should describe a stack (group by) ', function () {
        var data = [
            { data:
            [ 23,
            162,
            304,
            135,
            350,
            56,
            387,
            356,
            283,
            14,
            112,
            59,
            505,
            489,
            78,
            194,
            340,
            118,
            305,
            74,
            71,
            316,
            206,
            208,
            143,
            355,
            97,
            238,
            308,
            264 ],
            strokeColor: '#5d2b8f',
            fill: '#11b694',
            scattered: 
            { strokeColor: '#5d2b8f',
            fill: 'white',
            strokeWidth: 2,
            radius: 3 } },
            { data:
            [ 477,
            251,
            149,
            223,
            36,
            262,
            319,
            397,
            353,
            246,
            284,
            152,
            199,
            13,
            475,
            288,
            269,
            13,
            495,
            50,
            506,
            148,
            374,
            40,
            269,
            50,
            334,
            54,
            367,
            227 ],
            strokeColor: '#85d8ef',
            fill: '#7f6677',
            scattered: 
            { strokeColor: '#85d8ef',
            fill: 'white',
            strokeWidth: 2,
            radius: 3 } } ];

       var scale = {
            min: 124,
            max: 800,
            maxSet:
            [ 500,
            413,
            453,
            358,
            386,
            318,
            706,
            753,
            636,
            260,
            396,
            211,
            704,
            502,
            553,
            482,
            609,
            131,
            800,
            124,
            577,
            464,
            580,
            248,
            412,
            405,
            431,
            292,
            675,
            491 ],
            len: 30,
            rows: 2,
            ySecs: 0,
            color: [ '#5d2b8f', '#85d8ef' ],
            stack: true,
            showPointer: false,
            scattered: false,
            fill: [],
            line: true,
            paddingBottom: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingLeft: 0,
            height: 100,
            width: 300,
            type: 'bar',
            _data: data,
            heightRatio: 100 };

        var result = bar._describeBar(data, scale);
        expect(result)
            .to.be.a('array')
            .to.have.length.of.at.least(60)
            .to.satisfy(function (result) {
                return (/<rect\s.*>/i).test(result.join("")) && !(/NaN/).test(result.join(""));
            });
    });

    it('_describeBar should describe a bar chart (side by side) ', function () {
            var data = [ { data: [ 164, 138, 359, 183, 437, 84, 79, 173, 382, 260 ],
            strokeColor: 'red',
            strokeWidth: 2,
            scattered: { strokeColor: 'red', fill: 'white', strokeWidth: 2, radius: 5 } },
            { data: [ 123, 376, 422, 212, 40, 255, 365, 446, 72, 98 ],
            strokeColor: 'blue',
            strokeWidth: 2,
            scattered: { strokeColor: 'blue', fill: 'white', strokeWidth: 2, radius: 5 } } ];

            var scale = { min: 40,
            max: 500,
            maxSet: [],
            len: 10,
            rows: 2,
            ySecs: 5,
            color: [ 'red', 'blue' ],
            showPointer: false,
            yAxis: true,
            xAxis:
            { format: 'dateTime',
             interval: '1D',
             minUTC: 1378512000000,
             dateTimeLabelFormat: 'MM/DD hh ap' },
            scattered: false,
            fill: [],
            line: true,
            paddingBottom: 20,
            paddingTop: 20,
            paddingRight: 30,
            paddingLeft: 30,
            height: 100,
            width: 600,
            type: 'bar',
            _data: data,
            pHeight: 60,
            pWidth: 540,
            tickSize: 54,
            heightRatio: 99.92 };

        var result = bar._describeBar(data, scale);
        expect(result)
            .to.be.a('array')
            .to.have.length.of.at.least(20)
            .to.satisfy(function (result) {
                return (/<rect\s.*>/i).test(result.join("")) && !(/NaN/).test(result.join(""));
            });

    });
});