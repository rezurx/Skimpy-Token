# SKIMPY Token Deployment Status

**Last Updated:** 2025-07-30  
**Current Network:** Base Sepolia Testnet

---

## 📋 Live Contract Addresses

### Base Sepolia Testnet (Live)
- **Skimpy Token**: `0x8CACaD072091Cbbc568e4568DC3a1dF19Ab030E0`
  - ✅ Verified: https://sepolia.basescan.org/address/0x8CACaD072091Cbbc568e4568DC3a1dF19Ab030E0#code
  - Token Symbol: SKMP
  - Total Supply: 1,000,000 SKMP
  - Features: ERC20Votes, Demurrage (20% annual decay), Burn function

- **SkimpyGovernor**: `0x5F0d5Be2aE4962f4178c96a5C24FEf2Bae14D09c`
  - ✅ Verified: https://sepolia.basescan.org/address/0x5F0d5Be2aE4962f4178c96a5C24FEf2Bae14D09c#code
  - Voting Delay: 1 block
  - Voting Period: 45818 blocks (~1 week)
  - Quorum: 4% of total supply

- **SkimpyTimelock**: `0x32B53089A2f797c40168AaD32575e188A75a97fE`
  - ⏳ Deployed (verification pending)
  - Minimum Delay: 86400 seconds (24 hours)
  - Executor: SkimpyGovernor
  - Admin: None (decentralized)

- **BurnVault**: `0xa2185D2744B02577f76bA10b3895eaB1604Ce771`
  - ⏳ Deployed (verification pending)
  - Purpose: Holds burned tokens permanently

---

## 🚀 Deployment History

### 2025-07-30: Base Sepolia Testnet
- **Gas Used**: ~0.02 ETH
- **Block Height**: Latest block during deployment
- **Status**: ✅ Successful deployment and partial verification
- **Network ID**: 84532 (Base Sepolia)

---

## 🔄 Next Deployment Target

### Base Mainnet (Planned)
- **Network ID**: 8453
- **Estimated Cost**: ~$0.40 USD (in ETH)
- **Prerequisites**: 
  - Mainnet ETH for gas fees
  - Final testing validation
- **Target Addresses**: TBD (will be different from testnet)

---

## 🛠️ Technical Details

### Deployment Configuration
- **Hardhat Network**: `baseSepolia`
- **Compiler Version**: 0.8.23
- **Optimizer**: Enabled (200 runs)
- **Verification**: Etherscan API (Base networks)

### Environment Requirements
- **Alchemy API Key**: ✅ Configured
- **Private Key**: ✅ Configured
- **Basescan API Key**: ✅ Configured and working

---

## 📊 Contract Interactions

### Available Functions (Skimpy Token)
- `balanceOf(address)` - Get decayed token balance
- `transfer(address, uint256)` - Transfer tokens (applies decay)
- `burn(uint256)` - Burn tokens to vault
- `delegate(address)` - Delegate voting power
- All standard ERC-20 functions

### Governance Functions (SkimpyGovernor)
- `propose(...)` - Create governance proposal
- `castVote(uint256, uint8)` - Vote on proposal
- `execute(...)` - Execute passed proposal
- `queue(...)` - Queue proposal for execution

---

## 🔗 Useful Links

- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Base Bridge**: https://bridge.base.org/
- **Base Sepolia Faucet**: https://www.alchemy.com/faucets/base-sepolia
- **Project Repository**: https://github.com/rezurx/Skimpy-Token

---

**Status**: Ready for mainnet deployment 🚀