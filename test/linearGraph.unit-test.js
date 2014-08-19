
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

var graph;

describe('linear graph tests', function () {
    describe('graph test', function () {
        before(function () {
            graph = yako(document.getElementById('graph')).set({
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
        });

        it('the data should be identical to the data that was submitted', function () {
            expect(set2[0].data).to.deep.equal(graph.attributes.opts.data[0].data);
            expect(set2[1].data).to.deep.equal(graph.attributes.opts.data[1].data);
        });
    });
    
    describe('yako prototype tests', function () {
        it('yako.extend should be able to extend & deep extend', function () {
            var json = {
                test: 1
            };
            var result = {};

            yako.extend(result, json);
            expect(result).to.deep.equal(json);

            json = {
                test: 1,
                test2: {
                    test3: 1
                }
            };
            result = {};
            yako.extend(result, json);
            expect(result).to.deep.equal(json);
        });
    });
});