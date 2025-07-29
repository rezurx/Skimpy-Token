// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract Skimpy is ERC20, ERC20Votes, ERC20Permit, Ownable {
    address public burnVault;

    // --- Demurrage State Variables ---
    uint256 public constant DECAY_PRECISION = 10**18;
    // @dev 20% annual decay rate, calculated as (0.20 / 365 / 24 / 60 / 60) * 10**18
    uint256 public constant DECAY_RATE_PER_SECOND = 6341958396; 
    mapping(address => uint256) private _lastDecayUpdate;
    mapping(address => bool) private _isApplyingDecay; // Re-entrancy guard
    // --- End Demurrage ---

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

    // --- Demurrage Logic ---

    function _calculateDecayedBalance(address account) internal view returns (uint256) {
        uint256 lastUpdate = _lastDecayUpdate[account];
        if (lastUpdate == 0) {
            return super.balanceOf(account);
        }

        uint256 timeElapsed = block.timestamp - lastUpdate;
        if (timeElapsed == 0) {
            return super.balanceOf(account);
        }

        uint256 currentBalance = super.balanceOf(account);
        uint256 decay = (currentBalance * timeElapsed * DECAY_RATE_PER_SECOND) / DECAY_PRECISION;

        return currentBalance > decay ? currentBalance - decay : 0;
    }

    function balanceOf(address account) public view override(ERC20) returns (uint256) {
        return _calculateDecayedBalance(account);
    }

    function _applyDecay(address account) private {
        if (account == address(0) || _isApplyingDecay[account]) {
            return;
        }

        _isApplyingDecay[account] = true;

        uint256 lastUpdate = _lastDecayUpdate[account];
        // On first touch, just set the timestamp
        if (lastUpdate == 0) {
            _lastDecayUpdate[account] = block.timestamp;
        } else {
            uint256 timeElapsed = block.timestamp - lastUpdate;
            if (timeElapsed > 0) {
                uint256 currentBalance = super.balanceOf(account);
                uint256 decay = (currentBalance * timeElapsed * DECAY_RATE_PER_SECOND) / DECAY_PRECISION;

                if (decay > 0) {
                    _burn(account, decay);
                }
            }
            _lastDecayUpdate[account] = block.timestamp;
        }
        
        _isApplyingDecay[account] = false;
    }
    
    // --- End Demurrage ---


    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        _applyDecay(from);
        if (from != to) {
            _applyDecay(to);
        }

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