const assertJump = require('./helpers/assertJump');
var SafeMathMock = artifacts.require("./helpers/SafeMathMock.sol");
var SafeMathLib = artifacts.require("./SafeMathLib.sol");


contract('SafeMath', function(accounts) {

    let safeMath;
    before(async function() {
        SafeMathMock.link(SafeMathLib);
        safeMath = await SafeMathMock.new();
    });

    it("mul: multiplies correctly", async function() {
        let a = 5678;
        let b = 1234;
        let mult = await safeMath.mul(a, b);
        let result = await safeMath.result();
        assert.equal(result, a * b);
    });

    it("times: multiplies correctly", async function() {
        let a = 5678;
        let b = 1234;
        let mult = await safeMath.times(a, b);
        let result = await safeMath.result();
        assert.equal(result, a * b);
    });

    it("safeMul: multiplies correctly", async function() {
        let a = 5678;
        let b = 1234;
        let mult = await safeMath.safeMul(a, b);
        let result = await safeMath.result();
        assert.equal(result, a * b);
    });

    it("add: adds correctly", async function() {
        let a = 5678;
        let b = 1234;
        let add = await safeMath.add(a, b);
        let result = await safeMath.result();

        assert.equal(result, a + b);
    });

    it("plus: adds correctly", async function() {
        let a = 5678;
        let b = 1234;
        let add = await safeMath.plus(a, b);
        let result = await safeMath.result();

        assert.equal(result, a + b);
    });

    it("safeAdd: adds correctly", async function() {
        let a = 5678;
        let b = 1234;
        let add = await safeMath.safeAdd(a, b);
        let result = await safeMath.result();

        assert.equal(result, a + b);
    });

    it("sub: subtracts correctly", async function() {
        let a = 5678;
        let b = 1234;
        let subtract = await safeMath.sub(a, b);
        let result = await safeMath.result();

        assert.equal(result, a - b);
    });

    it("minus: subtracts correctly", async function() {
        let a = 5678;
        let b = 1234;
        let subtract = await safeMath.minus(a, b);
        let result = await safeMath.result();

        assert.equal(result, a - b);
    });

    it("safeSub: subtracts correctly", async function() {
        let a = 5678;
        let b = 1234;
        let subtract = await safeMath.safeSub(a, b);
        let result = await safeMath.result();

        assert.equal(result, a - b);
    });

    it("sub: should throw an error if subtraction result would be negative", async function() {
        let a = 1234;
        let b = 5678;
        try {
            let subtract = await safeMath.sub(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("minus: should throw an error if subtraction result would be negative", async function() {
        let a = 1234;
        let b = 5678;
        try {
            let subtract = await safeMath.minus(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("safeSub: should throw an error if subtraction result would be negative", async function() {
        let a = 1234;
        let b = 5678;
        try {
            let subtract = await safeMath.safeSub(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("add: should throw an error on addition overflow", async function() {
        let a = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
        let b = 1;
        try {
            let add = await safeMath.add(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("plus: should throw an error on addition overflow", async function() {
        let a = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
        let b = 1;
        try {
            let add = await safeMath.plus(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("safeAdd: should throw an error on addition overflow", async function() {
        let a = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
        let b = 1;
        try {
            let add = await safeMath.safeAdd(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("mul: should throw an error on multiplication overflow", async function() {
        let a = 115792089237316195423570985008687907853269984665640564039457584007913129639933;
        let b = 2;
        try {
            let multiply = await safeMath.mul(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("times: should throw an error on multiplication overflow", async function() {
        let a = 115792089237316195423570985008687907853269984665640564039457584007913129639933;
        let b = 2;
        try {
            let multiply = await safeMath.times(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

    it("safeMul: should throw an error on multiplication overflow", async function() {
        let a = 115792089237316195423570985008687907853269984665640564039457584007913129639933;
        let b = 2;
        try {
            let multiply = await safeMath.safeMul(a, b);
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    });

});