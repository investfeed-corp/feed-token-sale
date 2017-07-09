var Token = artifacts.require("./CrowdsaleToken.sol");
var PricingStartegy = artifacts.require("./EthTranchePricing.sol");
//var MultisigWallet = artifacts.require("./MultisigWalletConsenSys.sol");
var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");
var Crowdsale = artifacts.require("./MintedTokenCappedCrowdsale.sol");
var FinalizeAgent = artifacts.require("./BonusFinalizeAgent.sol");


var debug = true;
var showABI = true;
var showURL = true;

module.exports = function(deployer, network, accounts) {
    /**
     * 
     * ===================================
     * Set your crowdsale parameters here
     * Parameters Section Begins
     * ===================================
     * 
     */

    /**
     * Token Parameters 
     * =====================================
     * Here you can chose your token name, symbol, initial supply & decimals etc.
     */

    var _tokenName = "Feed";
    var _tokenSymbol = "FEED";
    var _tokenDecimals = 8;
    var _tokenInitialSupply = tokenInSmallestUnit(0, _tokenDecimals);
    var _tokenMintable = true;
    //console.log("Wei price for 17k tokens is: ", tokenPriceInWeiFromTokensPerEther(17000));

    //console.log(_minRequired, _dayLimit, _listOfOwners);


    /**
     * Crowdsale parameters
     * =====================================
     * Here you will set your MultiSigWallet parameters where you will be collecting the contributed ethers
     * here you have to mention the list of wallet owners (none of them must be 0)
     * and the minimum approvals required to approve the transactions.
     */
    var _startTime = getUnixTimestamp('2017-07-23 09:00:00 GMT');
    var _endTime = getUnixTimestamp('2017-08-7 09:00:00 GMT');
    var _minimumFundingGoal = etherInWei(1500);
    var _cap = etherInWei(28000);

    /**
     * Pricing tranches for pricing strategy 
     * =====================================
     * The last token price must be 0 which means that beyond the last pricing limit, the tokens cost 
     * per ether would be 0. Which further means your tokens will not be sold further if that slab is 
     * reached. In other words that last ether pricing slab is your maximum limit of ethers you can 
     * receive during your crowdsale. So you need to make sure that your last slab will touch only when 
     * your _tokenCap (total tokens) are sold. Otherwise your crowdsale contract will stop taking 
     * contribution even before your _tokenCap (total tokens) are sold. 
     * 
     * This is applicable only if your crowdsale is capped by _tokenCap (total tokens)
     * but your pricing is in ethers slab.
     * 
     * If you chose both the crowdsale & pricing to be TokenCapped+TokenTranch or EthCapped+EthTranch 
     * then this situation will not arise. 
     */
    var _tranches = [
        etherInWei(0), tokenPriceInWeiFromTokensPerEther(10000),
        etherInWei(15000), tokenPriceInWeiFromTokensPerEther(9000),
        _cap, 0
    ];

    /**
     * Bonus Agent parameters
     * =====================================
     * Here you will set your BonusFinalizeAgent parameters.
     */
    // set BonusFinalizeAgent parameters
    // 2% to each member. 
    // Number of entries count must match with the count of _teamAddresses members
    var _teamBonusPoints;

    // list of team mebers address respective to the above percentage.
    // alternatively you can just get all the bonus in one account & then distribute 
    // using some MultiSigWallet manually
    var _teamAddresses;
    if (network == "testrpc") {
        _teamBonusPoints = [150, 150, 150, 25, 25, 75, 75];
        _teamAddresses = [
            "0x22283B7315dd4B1741676e092279fc4F46ecC003",
            "0xf1BdA8f06191bC29F46d0ee3CBF68555A478a217",
            "0x15bac2c73532663058D3E82e9B1f8C7873Fef9e7",
            "0x3312F915B20527214A5Fc097d4E6b0E7F41CC192",
            "0x5F459fB028f7598cdaeB19461FcED31020e6534E",
            "0x72Bbe344986351A0C4E899D655E81DE8f64E9794",
            "0x6c750dA8df323D53eed6812a7AFB834B0752e94c"
        ];
    } else if (network == "ropsten") {
        _teamBonusPoints = [150, 150, 150];
        var aliceRopsten = "0x00568Fa85228C66111E3181085df48681273cD77";
        var bobRopsten = "0x00B600dE56F7570AEE3d57fe55E0462e51ca5280";
        var eveRopsten = "0x00F131eD217EC029732235A96EEEe044555CEd4d";
        _teamAddresses = [aliceRopsten, bobRopsten, eveRopsten];

    } else if (network == "mainnet") {
        // you have to manually specify this 
        // before you deploy this in mainnet
        // or else this deployment will fail
        _teamBonusPoints = [150, 150, 150];
        var member1 = 0x00;
        var member2 = 0x00;
        var member3 = 0x00;
        _teamAddresses = [member1, member2, member3];
        if (member1 == "0x00" || member2 == "0x00" || member3 == "0x00") {
            throw new Error("Team members addresses are not set properly. Please set them in migration/2_deploy_contracts.js.");
        }
    }


    /**
     * MultiSigWallet parameters
     * =====================================
     * Here you will set your MultiSigWallet parameters where you will be collecting the contributed ethers
     * here you have to mention the list of wallet owners (none of them must be 0)
     * and the minimum approvals required to approve the transactions.
     */
    var _minRequired = 2;

    var _listOfOwners;
    if (network == "testrpc") {
        _listOfOwners = [accounts[1], accounts[2], accounts[3]];
    } else if (network == "ropsten") {
        var aliceRopsten = "0x00568Fa85228C66111E3181085df48681273cD77";
        var bobRopsten = "0x00B600dE56F7570AEE3d57fe55E0462e51ca5280";
        var eveRopsten = "0x00F131eD217EC029732235A96EEEe044555CEd4d";
        _listOfOwners = [aliceRopsten, bobRopsten, eveRopsten];
    } else if (network == "mainnet") {
        // you have to manually specify this 
        // before you deploy this in mainnet
        // or else this deployment will fail
        var member1 = "0x00";
        var member2 = "0x00";
        var member3 = "0x00";
        _listOfOwners = [member1, member2, member3];
        if (member1 == "0x00" || member2 == "0x00" || member3 == "0x00") {
            throw new Error("MultiSigWallet members are not set properly. Please set them in migration/2_deploy_contracts.js.");
        }
    }


    /**
     * 
     * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     * Parameters Section Ends
     * ===================================
     * 
     */

    var tokenInstance;
    var pricingInstance;
    var finalizeAgentInstance;
    var crowdsaleInstance;
    var multisigWalletInstance;

    deployer.then(function() {
        return Token.new(_tokenName, _tokenSymbol, _tokenInitialSupply, _tokenDecimals, _tokenMintable);
    }).then(function(Instance) {
        tokenInstance = Instance;
        if (debug) console.log("CrowdsaleToken Parameters are:");
        if (debug) console.log(_tokenName, _tokenSymbol, _tokenInitialSupply, _tokenDecimals, _tokenMintable);
        if (debug) console.log("CrowdsaleToken address is: ", tokenInstance.address);
        if (showURL) console.log("Token URL is: " + getEtherScanUrl(network, tokenInstance.address, "token"));
        if (showURL) console.log("Transaction URL is: " + getEtherScanUrl(network, tokenInstance.transactionHash, "tx"));
        if (showABI) console.log("CrowdsaleToken ABI is: ", JSON.stringify(tokenInstance.abi));
        if (debug) console.log("===============================================");
        if (debug) console.log("\n\n");
        if (debug) console.log("*************  Deploying EthTranchePricing  ************** \n");
        return PricingStartegy.new(_tranches);
    }).then(function(Instance) {
        pricingInstance = Instance;
        if (debug) console.log("EthTranchePricing Parameters are:");
        if (debug) console.log(_tranches);
        if (debug) console.log("EthTranchePricing address is: ", pricingInstance.address);
        if (showURL) console.log("Pricing URL is: " + getEtherScanUrl(network, pricingInstance.address, "address"));
        if (showURL) console.log("Transaction URL is: " + getEtherScanUrl(network, pricingInstance.transactionHash, "tx"));
        if (showABI) console.log("EthTranchePricing ABI is: ", JSON.stringify(pricingInstance.abi));
        if (debug) console.log("===============================================");
        if (debug) console.log("\n\n");
        if (debug) console.log("*************  Deploying MultiSigWallet by Zeppelin  ************** \n");
        return MultiSigWallet.new(_listOfOwners, _minRequired);
    }).then(function(Instance) {
        multisigWalletInstance = Instance;
        if (debug) console.log("MultiSigWallet Parameters are:");
        if (debug) console.log(_listOfOwners, _minRequired);
        if (debug) console.log("MultiSigWallet address is: ", multisigWalletInstance.address);
        if (showURL) console.log("Wallet URL is: " + getEtherScanUrl(network, multisigWalletInstance.address, "address"));
        if (showURL) console.log("Transaction URL is: " + getEtherScanUrl(network, multisigWalletInstance.transactionHash, "tx"));
        if (showABI) console.log("MultiSigWallet ABI is: ", JSON.stringify(multisigWalletInstance.abi));
        if (debug) console.log("*************  Deploying MintedEthCappedCrowdsale  ************** \n");
        return Crowdsale.new(tokenInstance.address, pricingInstance.address, multisigWalletInstance.address, _startTime, _endTime, _minimumFundingGoal, _cap);
    }).then(function(Instance) {
        crowdsaleInstance = Instance;
        if (debug) console.log("MintedEthCappedCrowdsale Parameters are:");
        if (debug) console.log(tokenInstance.address, pricingInstance.address, multisigWalletInstance.address, _startTime, _endTime, _minimumFundingGoal, _cap);
        if (debug) console.log("MintedEthCappedCrowdsale address is: ", crowdsaleInstance.address);
        if (showURL) console.log("Crowdsale URL is: " + getEtherScanUrl(network, crowdsaleInstance.address, "address"));
        if (showURL) console.log("Transaction URL is: " + getEtherScanUrl(network, crowdsaleInstance.transactionHash, "tx"));
        if (showABI) console.log("MintedTokenCappedCrowdsale ABI is: ", JSON.stringify(crowdsaleInstance.abi));
        if (debug) console.log("===============================================");
        if (debug) console.log("\n\n");
        if (debug) console.log("*************  Deploying BonusFinalizeAgent  ************** \n");
        return FinalizeAgent.new(tokenInstance.address, crowdsaleInstance.address, _teamBonusPoints, _teamAddresses);
    }).then(function(Instance) {
        finalizeAgentInstance = Instance;
        if (debug) console.log("BonusFinalizeAgent Parameters are:");
        if (debug) console.log(tokenInstance.address, crowdsaleInstance.address, _teamBonusPoints, _teamAddresses);
        if (debug) console.log("BonusFinalizeAgent address is: ", finalizeAgentInstance.address);
        if (showURL) console.log("FinalizeAgent URL is: " + getEtherScanUrl(network, finalizeAgentInstance.address, "address"));
        if (showURL) console.log("Transaction URL is: " + getEtherScanUrl(network, finalizeAgentInstance.transactionHash, "tx"));
        if (showABI) console.log("BonusFinalizeAgent ABI is: ", JSON.stringify(finalizeAgentInstance.abi));
        if (debug) console.log("===============================================");
        if (debug) console.log("\n\n");
        console.log("\n*************  Setting up Agents  ************** \n");
        return tokenInstance.setMintAgent(crowdsaleInstance.address, true);
    }).then(function() {
        console.log("MintedTokenCappedCrowdsale is set as Mint Agent in CrowdsaleToken. Moving ahead...");
        return tokenInstance.setMintAgent(finalizeAgentInstance.address, true);
    }).then(function() {
        console.log("BonusFinalizeAgent is set as Mint Agent in CrowdsaleToken. Moving ahead...");
        return tokenInstance.setReleaseAgent(finalizeAgentInstance.address);
    }).then(function() {
        console.log("BonusFinalizeAgent is set as Release Agent in CrowdsaleToken. Moving ahead...");

        return tokenInstance.setTransferAgent(crowdsaleInstance.address, true);
    }).then(function() {
        console.log("MintedTokenCappedCrowdsale is set as Transfer Agent in CrowdsaleToken. Moving ahead...");

        return crowdsaleInstance.setFinalizeAgent(finalizeAgentInstance.address);
    }).then(function() {
        console.log("BonusFinalizeAgent is set as Finalize Agent in MintedTokenCappedCrowdsale. Moving ahead...");

        return crowdsaleInstance.isFinalizerSane();
    }).then(function(status) {
        if (status == true) {
            console.log("Success: Finalizer is sane in Crowdsale application. All looks good. Moving ahead...");
        } else {
            console.log("Failure: Finalizer is NOT sane in Crowdsale application. Something is bad. Moving ahead though. Please check it manually...");
        }
        return crowdsaleInstance.isPricingSane();
    }).then(function(status) {
        if (status == true) {
            console.log("Success: Pricing is sane in Crowdsale application. All looks good. Moving ahead...");
        } else {
            console.log("Failure: Pricing is NOT sane in Crowdsale application. Something is bad. Moving ahead though. Please check it manually...");
        }
    });
};

function getEtherScanUrl(network, data, type) {
    var etherscanUrl;
    if (network == "ropsten" || network == "kovan") {
        etherscanUrl = "https://" + network + ".etherscan.io";
    } else {
        etherscanUrl = "https://etherscan.io";
    }
    if (type == "tx") {
        etherscanUrl += "/tx";
    } else if (type == "token") {
        etherscanUrl += "/token";
    } else if (type == "address") {
        etherscanUrl += "/address";
    }
    etherscanUrl = etherscanUrl + "/" + data;
    return etherscanUrl;
}

function etherInWei(x) {
    return web3.toBigNumber(web3.toWei(x, 'ether')).toNumber();
}


function tokenPriceInWeiFromTokensPerEther(x) {
    if (x == 0) return 0;
    return Math.floor(web3.toWei(1, 'ether') / x);
}

function getUnixTimestamp(timestamp) {
    var startTimestamp = new Date(timestamp);
    return startTimestamp.getTime() / 1000;
}


function tokenInSmallestUnit(tokens, _tokenDecimals) {
    return tokens * Math.pow(10, _tokenDecimals);
}