
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();

var graph, graph2;
var dataSet = [];
var dataSet2 = [];
var dataSet4 = [];
var dataSet5 = [];
for (var i=0;i<10;i++) {
    dataSet.push(Math.floor((Math.random() * 500) + 10));
    dataSet2.push(Math.floor((Math.random() * 500) + 10));
    dataSet4.push(Math.floor((Math.random() * 500) + 10));
    dataSet5.push(Math.floor((Math.random() * 500) + 10));
}
var set3 = [
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


describe('realtime graph test', function () {
  // before(function(){
  //   document.body.innerHTML = window.__html__['test/index.test.html'];
  // });
    describe('graph without hover enabled', function () {
        before(function () {
            graph = yako(document.getElementById('graph7')).set({
                chart : {
                    type: 'line',
                    //controls the width and height of the graph
                    width: 700,
                    height: 200,
                    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                    'font-size': '12',
                    //this options will show hide the hover pointer
                    showPointer: false,
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
                }
                //calling hoverable enables hover
            });
        });

        it('graph should be an object with empty data', function () {
            var data = graph.attributes.opts.data;
            expect(data).to.be.empty;
        });

        it('graph should be an object with empty data fed in', function () {
            graph = yako(document.getElementById('graph7')).set({
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
                    dateTimeLabelFormat: 'YY hh ap'
                    // or if wanted custom label
                    // format: 'label',
                    // label: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
                },
                data: []
                //calling hoverable enables hover
            });
        
            var data = graph.attributes.opts.data;
            expect(data).to.be.empty;
        });

        it('should be able to add data set', function () {
            graph.addData({
                label: 'Auto Generated 4',
                data: dataSet4
            });

            var data = graph.attributes.data[0].data;
            expect(data).to.be.equal(dataSet4);
        });

        it('should be able to add another data set', function () {
            graph.addData({
                label: 'Auto Generated 5',
                data: dataSet5
            });

            var data = graph.attributes.data[1].data;
            expect(data).to.be.equal(dataSet5);
        });

        it('should be able to remove a data set', function () {
            graph.removeData({
                label: 'Auto Generated 5',
                data: dataSet5
            });

            var data = graph.attributes.data;
            expect(data[0].data).to.be.equal(dataSet4);
            expect(data.length).to.be.equal(1);
        });

        it('should be able to remove another data set - ie no data at this point', function () {
            graph.removeData({
                label: 'Auto Generated 4',
                data: dataSet4
            });

            var data = graph.attributes.data;
            expect(data.length).to.be.equal(0);
        });
    });

    describe('graph with hover enabled', function () {
        before(function () {
            graph2 = yako(document.getElementById('graph8')).set({
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
                    dateTimeLabelFormat: 'DD hh:mm:ss'
                    // or if wanted custom label
                    // format: 'label',
                    // label: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
                }
                //calling hoverable enables hover
            });

            graph2.hoverable(function (data) {
                var res = '<div>'+data[0].x+'</div>';
                for(var i in data) {
                    res+='<div><label style="color:'+data[i].color+'">'+data[i].label+':</label>&nbsp;<label>'+data[i].y+'</label></div>';
                }
                res+= '</div>';
                return res;
                //the css configs, need to define them
            });
        });

        it('graph should be an object with empty data', function () {
            var data = graph2.attributes.opts.data;
            expect(data).to.be.empty;
        });

        it('should be able to add data set', function () {
            graph2.addData({
                label: 'Auto Generated 4',
                data: dataSet4
            });

            var data = graph2.attributes.data[0].data;
            expect(data).to.be.equal(dataSet4);
        });

        it('should be able to add another data set', function () {
            graph2.addData({
                label: 'Auto Generated 5',
                data: dataSet5
            });

            var data = graph2.attributes.data[1].data;
            expect(data).to.be.equal(dataSet5);
        });

        it('should be able to remove a data set', function () {
            graph2.removeData({
                label: 'Auto Generated 5',
                data: dataSet5
            });

            var data = graph2.attributes.data;
            expect(data[0].data).to.be.equal(dataSet4);
            expect(data.length).to.be.equal(1);
        });

        it('should be able to remove another data set - ie no data at this point', function () {
            graph2.removeData({
                label: 'Auto Generated 4',
                data: dataSet4
            });

            var data = graph2.attributes.data;
            expect(data.length).to.be.equal(0);
        });
    });

    describe('min max test', function () {
        var compareNumbers = function (a, b) {
                return a - b;
        };
        it('should be able to determine the min max in the thousands range with max range greater or equal then the actual max', function () {    
            for (var x = 0; x < 100; x++) {
               var max = [];
               var sets = [];
                for(var i = 0; i<5; i++) {
                    var sets_ = [];
                    for(var j = 0; j < 10; j++) {
                        sets_.push(Math.floor((Math.random() * 1100) + 1000));
                    }
                    sets.push(sets_);
                    max.push((sets_.slice()).sort(compareNumbers)[9]);
                }
                max = max.sort(compareNumbers);
                var range = graph._findMinMax(sets, false);
                expect(range.max).to.be.at.least(max[4]);
            }
        });

        it('should be able to determine the min max in the 1 digit range with max range greater or equal then the actual max', function () {
               for (var x = 0; x < 100; x++) {
                   var max = [];
                   var sets = [];
                for(var i = 0; i<5; i++) {
                    var sets_ = [];
                    for(var j = 0; j < 10; j++) {
                        sets_.push(Math.floor((Math.random() * 7) + 2));
                    }
                    sets.push(sets_);
                    max.push((sets_.slice()).sort(compareNumbers)[9]);
                }
                max = max.sort(compareNumbers);
                var range = graph._findMinMax(sets, false);
                expect(range.max).to.be.at.least(max[4]);
            }
        });

        it('should be able to determine the min max in the 2 digit range with max range greater or equal then the actual max', function () {
               for (var x = 0; x < 100; x++) {
                   var max = [];
                   var sets = [];
                for(var i = 0; i<5; i++) {
                    var sets_ = [];
                    for(var j = 0; j < 10; j++) {
                        sets_.push(Math.floor((Math.random() * 10) + 2));
                    }
                    sets.push(sets_);
                    max.push((sets_.slice()).sort(compareNumbers)[9]);
                }
                max = max.sort(compareNumbers);
                var range = graph._findMinMax(sets, false);
                expect(range.max).to.be.at.least(max[4]);
            }
        });

        it('should be able to determine the min max in the 3 digit range with max range greater or equal then the actual max', function () {
            for (var x = 0; x < 100; x++) {
               var max = [];
               var sets = [];
               for(var i = 0; i<5; i++) {
                    var sets_ = [];
                    for(var j = 0; j < 10; j++) {
                        sets_.push(Math.floor((Math.random() * 500) + 100));
                    }
                    sets.push(sets_);
                    max.push((sets_.slice()).sort(compareNumbers)[9]);
                }
                max = max.sort(compareNumbers);
                var range = graph._findMinMax(sets, false);
                expect(range.max).to.be.at.least(max[4]);
            }
        });
    });

    describe('real time graphs', function () {
        it('should be able to increment 10 data points in the thousands range without any issue', function (done) {
            this.timeout(40000);

            graph = yako(document.getElementById('graph8')).set({
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
                data: JSON.parse(JSON.stringify(set3))
                //calling hoverable enables hover
            });

            var counter = 0;
            var testFn = function () {
                setTimeout(function () {
                    var _d1 = Math.floor((Math.random() * 1100) + 1000);
                    var _d2 = Math.floor((Math.random() * 1100) + 1000);

                    graph.incrementData([{
                        label: 'Auto Generated',
                        data: [_d1]
                    },{
                        label: 'Auto Generated 2',
                        data: [_d2]
                    }]);
                    expect(graph.attributes._range.max).to.be.at.least(_d1);
                    expect(graph.attributes._range.max).to.be.at.least(_d2);
                    expect(graph.attributes.data[0].data).to.contain(_d1);
                    expect(graph.attributes.data[1].data).to.contain(_d2);
                    if (counter < 1) {
                        counter+=1;
                        testFn();
                    } else {
                        done();
                    }
                },1000);
            };
            testFn();
        });

        it('should be able to increment 10 data points in the 2 digit range without any issue', function (done) {
            this.timeout(40000);

            var counter = 0;
            var testFn = function () {
                setTimeout(function () {
                    var _d1 = Math.floor((Math.random() * 5) + 2);
                    var _d2 = Math.floor((Math.random() * 5) + 2);

                    graph.incrementData([{
                        label: 'Auto Generated',
                        data: [_d1] 
                    },{
                        label: 'Auto Generated 2',
                        data: [_d2]
                    }]);
                    expect(graph.attributes._range.max).to.be.at.least(_d1);
                    expect(graph.attributes._range.max).to.be.at.least(_d2);
                    expect(graph.attributes.data[0].data).to.contain(_d1);
                    expect(graph.attributes.data[1].data).to.contain(_d2);
                    if (counter < 10) {
                        counter+=1;
                        testFn();
                    } else {
                        done();
                    }
                },1000);
            };
            testFn();
        });
    });
});