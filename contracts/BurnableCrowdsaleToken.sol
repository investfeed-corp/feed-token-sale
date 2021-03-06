pragma solidity ^0.4.11;

import "./BurnableToken.sol";
import "./CrowdsaleToken.sol";

/**
 * A crowdsaled token that you can also burn.
 *
 */
contract BurnableCrowdsaleToken is BurnableToken, CrowdsaleToken {

  function BurnableCrowdsaleToken(string _name, string _symbol, uint _initialSupply, uint8 _decimals, bool _mintable)
    CrowdsaleToken(_name, _symbol, _initialSupply, _decimals, _mintable) {

  }
}
