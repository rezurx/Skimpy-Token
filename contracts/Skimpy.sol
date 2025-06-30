// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Skimpy is ERC20 {
    constructor() ERC20("Skimpy", "SKMP") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}