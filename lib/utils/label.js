// this snippet is for label formet, preserve this snippet for now
// if (opts.xAxis.format) {
//     if (opts.xAxis.format === 'dateTime') {
//         // should throw warning
//         if (multi) {
//             interval = (opts.chart.width-(40*sets.length)) / (range[0].len-1);
//             heightRatio = [];
//             for (var i in range) {
//                 heightRatio.push((opts.chart.height-25.5) / (range[i].max));
//             }
//         } else {
//             interval = (opts.chart.width-40) / (range.len-1);    //this part adjust the interval base on the width offset;
//             heightRatio = (opts.chart.height-25.5) / (max);
//         }
       
//         opts._shift = true;
//     }
// }

// TODO:: Move re-render to a seperate module
// we are now adding on to exisiting data and to allow animation
// NOTE:: We will not do MULTIPLE AXIS for real time data
// if (reRender) {
//     this._reRenderLabelAndBorders(data, opts, interval, heightRatio, min, max, splits, paddingForLabel, true);
//     var nodes = this._getNode(this.element, null, 'path');
//     for (var i in data) {
//         this._reRenderPath(nodes, data[i], opts, interval, heightRatio, paddingForLabel, this.attributes.oldData[i]);
//     }
//     yako.startCycle(this.token, function (){
//         //complete
//     });
//     return this;
// }