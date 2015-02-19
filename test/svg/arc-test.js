var chai = require('chai');
var expect = chai.expect;
var arc = require('../../lib/svg/arc');

describe('lib/svg/arc', function () {
    it('polarToCartesian should return proper polar to cartesian coordinates', function () {
        var result = arc.polarToCartesian(50, 50, 25, 50);
        expect(result)
            .to.deep.equal({
                x: 69.15111107797445,
                y: 33.93030975783652
            });
    });

    it('describArc should describe the arc\'s path', function () {
        // 1-2nd quadrent
        var result = arc.describeArc(25, 25, 10, 50, 60);
        var expected = 'M 33.66025403784439 20 A 10 10 0 0 0 32.66044443118978 18.572123903134607';

        expect(result)
            .to.be.a('string')
            .to.be.equal(expected);

        // 3-4th quadrent
        var result = arc.describeArc(25, 25, 10, 170, 320);
        var expected = 'M 18.572123903134603 17.33955556881022 A 10 10 0 0 0 26.736481776669304 34.84807753012208';

        expect(result)
            .to.be.a('string')
            .to.be.equal(expected);
    });

    it('describePie should describe a piece of a pie', function () {
        var result = arc.describePie(25, 25, 10, 50, 60);
        var expected = 'M 33.66025403784439 20 A 10 10 0 0 0 32.66044443118978 18.572123903134607 L25 25';

        expect(result)
            .to.be.a('string')
            .to.be.equal(expected);

    });
});