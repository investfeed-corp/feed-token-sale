pragma solidity ^0.4.11;
import "./MultisigWalletZeppelin.sol";

contract MultisigWallet is MultisigWalletZeppelin {
  uint public totalSpending;

  function MultisigWallet(address[] _owners, uint _required, uint _daylimit)
    MultisigWalletZeppelin(_owners, _required, _daylimit) payable { }

  function changeOwner(address _from, address _to) external { }

}
