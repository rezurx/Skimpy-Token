// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BurnVault
 * @dev A contract to hold "burned" Skimpy tokens.
 * This vault receives tokens that are considered burned, effectively taking them
 * out of circulation. The owner of this contract can recover the tokens if needed.
 */
contract BurnVault is Ownable {
    IERC20 public immutable token;

    /**
     * @dev Sets the token to be stored in the vault.
     * @param _token The address of the ERC20 token contract.
     */
    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    /**
     * @dev Returns the total balance of the token held by this vault.
     */
    function totalBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /**
     * @dev Allows the owner to withdraw tokens from the vault.
     * This is a recovery mechanism and should be used with caution.
     * @param _to The address to send the tokens to.
     * @param _amount The amount of tokens to withdraw.
     */
    function withdraw(address _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "ERC20: transfer to the zero address");
        uint256 balance = token.balanceOf(address(this));
        require(_amount <= balance, "BurnVault: insufficient balance");
        token.transfer(_to, _amount);
    }
}
