
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();

var dataSet = [];
var dataSet2 = [];
for (var i=0;i<10;i++) {
    dataSet.push(Math.floor((Math.random() * 500) + 10));
    dataSet2.push(Math.floor((Math.random() * 500) + 10));
}
var set2 = [
    {
        label: 'Auto Generated',
        data: dataSet,
        //color controls the line
        color: '#1E90FF'
        //nodeColor controls the pointer color
    },
    {
        label: 'Auto Generated 2',
        data: dataSet2,
        color: '#FF7F00'
    }
];

describe('yako initialization test', function () {
    before(function(){
        document.body.innerHTML = window.__html__['test/index.test.html'];
    });
      
      it('yako should be a function', function () {
        expect(yako).to.be.a('function');
      });

      it('yako should be an object', function () {
        var graph = yako(document.getElementById('graph')).set({
            chart : {
                type: 'line',
                //controls the width and height of the graph
                width: 700,
                height: 200,
                'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                'font-size': '12',
                //this options will show hide the hover pointer
                showPointer: false,
                realtime : {
                  zero : true
                },
                //this option will toggle the chart to save incrementable data or not
                accumulateIncrementalData: false
            },
            title : 'just a test',
            xAxis : {
                //including format will show the xAxis Label
                format : 'dateTime',
                //interval indicates the data interval, the number of the interval indicates the label tick interval
                //s - seconds
                //m - minutes
                //h - hours
                //D - days
                //M - months
                //Y - years
                interval: '4h',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
                //min start date
                //do not need end date, expecting there would be zeros to fill the gaps
                minUTC: Date.UTC(2013,08,07),
                //this controls the dateTime label format
                //depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
                dateTimeLabelFormat: 'MM/DD hh ap'
                // or if wanted custom label
                // format: 'label',
                // label: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
            },
            data: JSON.parse(JSON.stringify(set2))
            //calling hoverable enables hover
        });

        expect(graph).to.be.a('object');
      });

      it('yako objects should be a different object', function () {
        var graph2 = yako(document.getElementById('graph2')).set({
            chart : {
                type: 'line',
                //controls the width and height of the graph
                width: 700,
                height: 200,
                'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                'font-size': '12',
                //this options will show hide the hover pointer
                showPointer: false,
                realtime : {
                  zero : true
                },
                //this option will toggle the chart to save incrementable data or not
                accumulateIncrementalData: false
            },
            title : 'just a test',
            xAxis : {
                //including format will show the xAxis Label
                format : 'dateTime',
                //interval indicates the data interval, the number of the interval indicates the label tick interval
                //s - seconds
                //m - minutes
                //h - hours
                //D - days
                //M - months
                //Y - years
                interval: '4h',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
                //min start date
                //do not need end date, expecting there would be zeros to fill the gaps
                minUTC: Date.UTC(2013,08,07),
                //this controls the dateTime label format
                //depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
                dateTimeLabelFormat: 'MM/DD hh ap'
                // or if wanted custom label
                // format: 'label',
                // label: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
            },
            data: JSON.parse(JSON.stringify(set2))
            //calling hoverable enables hover
        });

        var graph3 = yako(document.getElementById('graph3')).set({
            chart : {
                type: 'line',
                //controls the width and height of the graph
                width: 700,
                height: 200,
                'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                'font-size': '12',
                //this options will show hide the hover pointer
                showPointer: false,
                realtime : {
                  zero : true
                },
                //this option will toggle the chart to save incrementable data or not
                accumulateIncrementalData: false
            },
            title : 'just a test',
            xAxis : {
                //including format will show the xAxis Label
                format : 'dateTime',
                //interval indicates the data interval, the number of the interval indicates the label tick interval
                //s - seconds
                //m - minutes
                //h - hours
                //D - days
                //M - months
                //Y - years
                interval: '2Y',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
                //min start date
                //do not need end date, expecting there would be zeros to fill the gaps
                minUTC: Date.UTC(2013,08,07),
                //this controls the dateTime label format
                //depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
                dateTimeLabelFormat: 'YYY'
                // or if wanted custom label
                // format: 'label',
                // label: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
            },
            data: JSON.parse(JSON.stringify(set2))
            //calling hoverable enables hover
        });

        expect(graph2).to.not.equal(graph3);
    });

    describe('math prototypes', function () {
        // test case from mozilla - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil
        it('round10 should be able to round properly', function () {
            expect(Math.round10(55.55, -1)).to.equal(55.6);
            expect(Math.round10(55.549,-1)).to.equal(55.5);
            expect(Math.round10(55,1)).to.equal(60);
            expect(Math.round10(655,1)).to.equal(660);
            expect(Math.round10(-55.55, -1)).to.equal(-55.5); // -55.5
            expect(Math.round10(-55.551, -1)).to.equal(-55.6); // -55.6
            expect(Math.round10(-55, 1)).to.equal(-50); // -50
            expect(Math.round10(-55.1, 1)).to.equal(-60); // -60

            // exceptions
            expect(Math.round10('sdfsf',1).toString()).to.equal('NaN');
            expect(Math.round10(undefined,1).toString()).to.equal('NaN');
            expect(Math.round10(12313,undefined)).to.equal(12313);
            expect(Math.round10(12313,0)).to.equal(12313);
        });

        it('ceil10 should be able to round down properly', function () {
            expect(Math.ceil10(55.51, -1)).to.equal(55.6); // 55.6
            expect(Math.ceil10(51, 1)).to.equal(60); // 60
            expect(Math.ceil10(-55.59, -1)).to.equal(-55.5); // -55.5
            expect(Math.ceil10(-59, 1)).to.equal(-50); // -50

            expect(Math.ceil10('sdfsf',1).toString()).to.equal('NaN');
            expect(Math.ceil10(undefined,1).toString()).to.equal('NaN');
            expect(Math.ceil10(12313,undefined)).to.equal(12313);
            expect(Math.ceil10(12313,0)).to.equal(12313);
        });

        it('floor10 should be able to round up properly', function () {
            expect(Math.floor10(55.59, -1)).to.equal(55.5); // 55.5
            expect(Math.floor10(59, 1)).to.equal(50); // 50
            expect(Math.floor10(-55.51, -1)).to.equal(-55.6); // -55.6
            expect(Math.floor10(-51, 1)).to.equal(-60); // -60

            // exceptions
            expect(Math.floor10('sdfsf',1).toString()).to.equal('NaN');
            expect(Math.floor10(undefined,1).toString()).to.equal('NaN');
            expect(Math.floor10(12313,undefined)).to.equal(12313);
            expect(Math.floor10(12313,0)).to.equal(12313);
        });
    });
});