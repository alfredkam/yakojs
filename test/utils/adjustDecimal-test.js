var chai = require('chai');
var expect = chai.expect;
require('../../lib/utils/adjustDecimal');

describe('lib/utils/math', function () {
    it('should be able to round10', function () {
        expect(Math.round10(120.002, 2))
            .to.be.equal(100);
        expect(Math.round10(180.002, 2))
            .to.be.equal(200);
    });

    it('should be able to floor10', function () {
        expect(Math.floor10(120.002, 2))
            .to.be.equal(100);
        expect(Math.floor10(120.684, -2))
            .to.be.equal(120.68);
    });

    it('should be able to ceil10', function () {
        expect(Math.ceil10(120.002, 2))
            .to.be.equal(200);
    });

    it('should be able to handle no arguments and return NaN', function () {
        expect(Math.round10())
            .to.satisfy(function (re) {
                if (isNaN(re)) {
                    return true;
                }
                return false;
            });
        expect(Math.floor10())
            .to.satisfy(function (re) {
                if (isNaN(re)) {
                    return true;
                }
                return false;
            });
        expect(Math.ceil10())
            .to.satisfy(function (re) {
                if (isNaN(re)) {
                    return true;
                }
                return false;
            });
    });

    it('should be able to handle and return the origin number', function () {
        expect(Math.round10(10))
            .to.be.equal(10);
        expect(Math.floor10(10))
            .to.be.equal(10);
        expect(Math.ceil10(10))
            .to.be.equal(10);
    });
});