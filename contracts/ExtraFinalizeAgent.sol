pragma solidity ^0.4.11;

import "./Crowdsale.sol";
import "./CrowdsaleToken.sol";
import "./SafeMathLib.sol";

/**
 * At the end of the successful crowdsale allocate % bonus of tokens to the team.
 *
 * Do not unlock the tokens.
 *
 * BonusAllocationFinal must be set as the minting agent for the MintableToken.
 *
 */
contract ExtraFinalizeAgent is FinalizeAgent, SafeMathLib {

  CrowdsaleToken public token;
  Crowdsale public crowdsale;

  /** Total percent of tokens minted to the team at the end of the sale as base points (0.0001) */
  uint public bonusBasePoints;

  /** Where we move the tokens at the end of the sale. */
  address public teamMultisig;

  /* How much bonus tokens we allocated */
  uint public allocatedBonus;

  /* How many tokens other finalizers will allocate and we do not count these in */
  uint public accountedTokenSales;

  function ExtraFinalizeAgent(CrowdsaleToken _token, Crowdsale _crowdsale, uint _bonusBasePoints, address _teamMultisig, uint _accountedTokenSales) {
    token = _token;
    crowdsale = _crowdsale;

    require(address(crowdsale) != 0);
    // if(address(crowdsale) == 0) {
    //   throw;
    // }

    teamMultisig = _teamMultisig;
    require(address(teamMultisig) != 0);
    // if(address(teamMultisig) == 0) {
    //   throw;
    // }

    accountedTokenSales = _accountedTokenSales;
  }

  /* Can we run finalize properly */
  function isSane() public constant returns (bool) {
    return (token.mintAgents(address(this)) == true);
  }

  /** Called once by crowdsale finalize() if the sale was success. */
  function finalizeCrowdsale() {
    require(msg.sender == address(crowdsale));
    // if(msg.sender != address(crowdsale)) {
    //   throw;
    // }

    // How many % of tokens the founders and others get
    uint tokensSold = safeSub(crowdsale.tokensSold(), accountedTokenSales);
    allocatedBonus = safeMul(tokensSold, bonusBasePoints) / 10000;

    // move tokens to the team multisig wallet
    token.mint(teamMultisig, allocatedBonus);

  }

}
