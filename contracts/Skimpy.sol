// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract Skimpy is ERC20, ERC20Votes, ERC20Permit, Ownable {
    address public burnVault;

    constructor(address _burnVault, address initialOwner) 
        ERC20("Skimpy", "SKMP") 
        ERC20Permit("Skimpy") 
        ERC20Votes() 
        Ownable(initialOwner) {
        burnVault = _burnVault;
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function setBurnVault(address newVault) public onlyOwner {
        burnVault = newVault;
    }

    function burn(uint256 amount) public {
        _transfer(msg.sender, burnVault, amount);
    }

    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}