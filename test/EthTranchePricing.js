'use strict';

const assertJump = require('./helpers/assertJump');
var Token = artifacts.require("./helpers/UpgradeableTokenMock.sol");
var pricingContract = artifacts.require("../contracts/EthTranchePricing.sol");

function etherInWei(x) {
    return web3.toBigNumber(web3.toWei(x, 'ether')).toNumber();
}


function tokenPriceInWeiFromTokensPerEther(x) {
    if (x == 0) return 0;
    return Math.floor(web3.toWei(1, 'ether') / x);
}

function tokenInSmallestUnit(tokens, _tokenDecimals) {
    return tokens * Math.pow(10, _tokenDecimals);
}

contract('EthTranchePricing', function(accounts) {
    var _tranches = [
        etherInWei(0), tokenPriceInWeiFromTokensPerEther(1500),
        etherInWei(5), tokenPriceInWeiFromTokensPerEther(1300),
        etherInWei(10), tokenPriceInWeiFromTokensPerEther(1100),
        etherInWei(15), tokenPriceInWeiFromTokensPerEther(1050),
        etherInWei(20), tokenPriceInWeiFromTokensPerEther(1000),
        etherInWei(300), tokenPriceInWeiFromTokensPerEther(0)
    ];
    var _tokenDecimals = 8;
    var pricing = null;

    //console.log(_tranches);

    beforeEach(async() => {
        pricing = await pricingContract.new(_tranches, { from: accounts[0] });
    });

    it('Creation: Pricing tranches count must be able to initialized properly.', async function() {
        assert.equal(await pricing.trancheCount.call(), _tranches.length / 2);
    });

    it('Creation: Pricing tranches must be able to initialized properly.', async function() {
        var i = 0;
        for (i = 0; i < _tranches.length / 2; i = i + 1) {
            var data = await pricing.tranches.call(i);
            assert.equal(web3.toBigNumber(data[0]).toNumber(), _tranches[i * 2]);
            assert.equal(web3.toBigNumber(data[1]).toNumber(), _tranches[i * 2 + 1]);
        }
    });

    it('PreICOAddress: Owner must be able to set pre ICO address.', async function() {
        await pricing.setPreicoAddress(accounts[3], tokenPriceInWeiFromTokensPerEther(2000));
    });

    it('PreICOAddress: Non-Onwer must be not able to set pre ICO address.', async function() {
        try {
            await pricing.setPreicoAddress(accounts[3], tokenPriceInWeiFromTokensPerEther(2000), { from: accounts[2] });
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown exception before');
    });

    it('Calculation: Pricing must be calculated properly.', async function() {
        await pricing.setPreicoAddress(accounts[3], tokenPriceInWeiFromTokensPerEther(2000));

        var etherInvesting = 1;
        var etherAlreadyRaised = 0;
        var tokensAlreadyRaised = 0;
        var buyer = accounts[2];
        var slab = 0;

        etherInvesting = 1;
        etherAlreadyRaised = 0;
        tokensAlreadyRaised = 0;
        buyer = accounts[2];
        slab = 0;
        // 150000000000 == 
        assert.equal(web3.toBigNumber(await pricing.calculatePrice(etherInWei(etherInvesting), etherInWei(etherAlreadyRaised), tokenInSmallestUnit(tokensAlreadyRaised, _tokenDecimals), buyer, _tokenDecimals)).toNumber(), Math.floor(tokenInSmallestUnit(etherInWei(etherInvesting) / _tranches[2 * slab + 1], _tokenDecimals)));


        etherInvesting = 1;
        etherAlreadyRaised = 2;
        tokensAlreadyRaised = 3000;
        buyer = accounts[2];
        slab = 0;
        assert.equal(web3.toBigNumber(await pricing.calculatePrice(etherInWei(etherInvesting), etherInWei(etherAlreadyRaised), tokenInSmallestUnit(tokensAlreadyRaised, _tokenDecimals), buyer, _tokenDecimals)).toNumber(), Math.floor(tokenInSmallestUnit(etherInWei(etherInvesting) / _tranches[2 * slab + 1], _tokenDecimals)));


        etherInvesting = 3;
        etherAlreadyRaised = 7;
        tokensAlreadyRaised = 10100;
        buyer = accounts[2];
        slab = 1;
        assert.equal(web3.toBigNumber(await pricing.calculatePrice(etherInWei(etherInvesting), etherInWei(etherAlreadyRaised), tokenInSmallestUnit(tokensAlreadyRaised, _tokenDecimals), buyer, _tokenDecimals)).toNumber(), Math.floor(tokenInSmallestUnit(etherInWei(etherInvesting) / _tranches[2 * slab + 1], _tokenDecimals)));

    });

    it('Calculation: Pricing for pre ico user must be calculated properly.', async function() {
        await pricing.setPreicoAddress(accounts[3], tokenPriceInWeiFromTokensPerEther(2000));
        var etherInvesting = 3;
        var etherAlreadyRaised = 7;
        var tokensAlreadyRaised = 10100;
        var buyer = accounts[3];
        assert.equal(web3.toBigNumber(await pricing.calculatePrice(etherInWei(etherInvesting), etherInWei(etherAlreadyRaised), tokenInSmallestUnit(tokensAlreadyRaised, _tokenDecimals), buyer, _tokenDecimals)).toNumber(), Math.floor(tokenInSmallestUnit(etherInWei(etherInvesting) / tokenPriceInWeiFromTokensPerEther(2000), _tokenDecimals)));
    });

    it('Transfer: ether transfer to pricing address should fail.', async function() {

        try {
            await web3.eth.sendTransaction({ from: accounts[0], to: pricing.address, value: web3.toWei("10", "Ether") });
        } catch (error) {
            return assertJump(error);
        }
        assert.fail('should have thrown exception before');
    });




});