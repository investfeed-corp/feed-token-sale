pragma solidity ^0.4.11;

import "./Crowdsale.sol";
import "./ReleasableToken.sol";

/**
 * A finalize agent that does nothing.
 *
 * - Token transfer must be manually released by the owner
 */
contract NullFinalizeAgent is FinalizeAgent {

  Crowdsale public crowdsale;

  function NullFinalizeAgent(Crowdsale _crowdsale) {
    crowdsale = _crowdsale;
  }

  /** Check that we can release the token */
  function isSane() public constant returns (bool) {
    return true;
  }

  /** Called once by crowdsale finalize() if the sale was success. */
  function finalizeCrowdsale() public {
  }

}
