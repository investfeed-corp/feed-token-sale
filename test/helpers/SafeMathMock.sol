pragma solidity ^0.4.11;


import '../../contracts/SafeMathLib.sol';


contract SafeMathMock {
  uint public result;

  function mul(uint a, uint b) {
    result = SafeMathLib.mul(a, b);
  }

  function times(uint a, uint b) {
    result = SafeMathLib.times(a, b);
  }

  function safeMul(uint a, uint b) {
    result = SafeMathLib.safeMul(a, b);
  }


  function plus(uint a, uint b) {
    result = SafeMathLib.plus(a, b);
  }

  function add(uint a, uint b) {
    result = SafeMathLib.add(a, b);
  }

  function safeAdd(uint a, uint b) {
    result = SafeMathLib.safeAdd(a, b);
  }

  function minus(uint a, uint b) {
    result = SafeMathLib.minus(a, b);
  }

  function sub(uint a, uint b) {
    result = SafeMathLib.sub(a, b);
  }

  function safeSub(uint a, uint b) {
    result = SafeMathLib.safeSub(a, b);
  }


}
