# SKIMPY Token Deployment Guide

**Deploy SKIMPY Token with Full Governance System to Base Blockchain**

---

## 🎯 Overview

This guide will walk you through deploying the complete SKIMPY Token ecosystem to Base blockchain, including:
- **Skimpy Token** (ERC-20 with ERC20Votes for governance)
- **BurnVault** (token burning mechanism)
- **SkimpyTimelock** (1-hour governance delay)
- **SkimpyGovernor** (full OpenZeppelin governance system)

**Estimated Cost**: ~$15-30 USD in ETH for Base mainnet deployment
**Estimated Time**: 30-60 minutes

---

## 🔧 Step 1: Environment Setup

### 1.1 Create Environment File
```bash
# Navigate to project directory
cd /home/resurx/blockchain-projects/skimpy-token

# Copy example environment file
cp .env.example .env
```

### 1.2 Configure Required API Keys

Edit `.env` file with your actual values:

```bash
# Alchemy API Key for Base networks
# Get from: https://dashboard.alchemy.com/ (Free tier available)
ALCHEMY_API_KEY=your-alchemy-api-key-here

# Private key of deployer wallet (without 0x prefix)
# Generate new wallet or use existing (KEEP SECURE!)
PRIVATE_KEY=your-private-key-here

# Basescan API Key for contract verification
# Get from: https://basescan.org/apis (Free)
BASESCAN_API_KEY=your-basescan-api-key-here

# Discord Webhook URL for deployment notifications (Optional)
DISCORD_WEBHOOK_URL=your-discord-webhook-url-here
```

### 1.3 API Key Setup Instructions

**Alchemy API Key:**
1. Visit https://dashboard.alchemy.com/
2. Create free account
3. Create new app → Base → Base Mainnet/Sepolia
4. Copy API Key

**Basescan API Key:**
1. Visit https://basescan.org/apis
2. Create free account
3. Generate API key
4. Copy key

**Private Key:**
- Use MetaMask: Account Details → Export Private Key
- **WARNING**: Never share or commit this key to git

---

## 🌐 Step 2: Network Configuration

### 2.1 Enable Base Networks

Edit `hardhat.config.js` and uncomment Base networks:

```javascript
networks: {
  hardhat: {
    chainId: 1337
  },
  base: {
    url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    chainId: 8453,
    accounts: [PRIVATE_KEY],
    gasPrice: "auto"
  },
  baseSepolia: {
    url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    chainId: 84532,
    accounts: [PRIVATE_KEY],
    gasPrice: "auto"
  }
}
```

### 2.2 Verify Configuration
```bash
# Test network connection
npx hardhat run scripts/deploy-governor.js --network hardhat
```

---

## 💰 Step 3: Fund Deployment Wallet

### 3.1 Get Testnet ETH (Base Sepolia)
- **Free Base Sepolia ETH**: https://bridge.base.org/deposit
- **Alternative Faucets**: 
  - https://www.alchemy.com/faucets/base-sepolia
  - https://faucet.quicknode.com/base/sepolia

### 3.2 Get Mainnet ETH (Base Mainnet)
- **Required**: ~$20-50 USD worth of ETH
- **Bridge from Ethereum**: https://bridge.base.org/
- **Buy directly**: Use Coinbase, MetaMask, or other on-ramps

### 3.3 Verify Wallet Balance
```bash
# Check balance on testnet
npx hardhat run --network baseSepolia scripts/check-balance.js

# Check balance on mainnet  
npx hardhat run --network base scripts/check-balance.js
```

**Create balance check script** (optional):
```javascript
// scripts/check-balance.js
async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
}
main();
```

---

## 🚀 Step 4: Deployment Process

### 4.1 Deploy to Testnet First (RECOMMENDED)

```bash
# Deploy complete governance system to Base Sepolia testnet
npx hardhat run scripts/deploy-governor.js --network baseSepolia
```

**Expected Output:**
```
🚀 Starting Governance System deployment...
Deploying with account: 0x1234...
Account balance: 0.1 ETH

📄 Deploying BurnVault contract...
✅ BurnVault deployed to: 0xABC123...

📄 Deploying Skimpy contract...
✅ Skimpy Token deployed to: 0xDEF456...

⏰ Deploying SkimpyTimelock contract...
✅ SkimpyTimelock deployed to: 0x789GHI...

🏛️ Deploying SkimpyGovernor contract...
✅ SkimpyGovernor deployed to: 0x012JKL...

🔧 Setting up governance roles...
✅ Governance deployment complete!
```

### 4.2 Test Deployment

Verify contracts on Base Sepolia:
1. Visit https://sepolia.basescan.org/
2. Search for your contract addresses
3. Verify all contracts appear correctly

### 4.3 Deploy to Mainnet

**ONLY after successful testnet deployment:**

```bash
# Deploy to Base mainnet
npx hardhat run scripts/deploy-governor.js --network base
```

---

## ✅ Step 5: Contract Verification

### 5.1 Verify All Contracts

```bash
# Verify BurnVault
npx hardhat verify --network base <BURNVAULT_ADDRESS> <CONSTRUCTOR_ARGS>

# Verify Skimpy Token
npx hardhat verify --network base <SKIMPY_ADDRESS> <BURNVAULT_ADDRESS> <DEPLOYER_ADDRESS>

# Verify Timelock
npx hardhat verify --network base <TIMELOCK_ADDRESS> <MIN_DELAY> <PROPOSERS> <EXECUTORS> <ADMIN>

# Verify Governor
npx hardhat verify --network base <GOVERNOR_ADDRESS> <SKIMPY_ADDRESS> <TIMELOCK_ADDRESS>
```

### 5.2 Verification Tips
- Save all contract addresses from deployment output
- Constructor arguments must match exactly
- Use `--constructor-args arguments.js` for complex constructors

---

## 📊 Deployment Costs Breakdown

### Base Sepolia (Testnet)
- **Cost**: FREE (testnet ETH)
- **BurnVault**: ~500,000 gas
- **Skimpy Token**: ~2,500,000 gas  
- **SkimpyTimelock**: ~1,200,000 gas
- **SkimpyGovernor**: ~4,000,000 gas
- **Total**: ~8,200,000 gas

### Base Mainnet
- **Gas Price**: ~0.1-0.5 gwei (Base is cheap!)
- **Total Cost**: $15-30 USD (depends on gas prices)
- **Deployment Time**: 5-10 minutes

---

## 🎛️ Post-Deployment Setup

### 6.1 Update Configuration Files

Update `.env` with deployed addresses:
```bash
# Add deployed contract addresses
SKIMPY_TOKEN_ADDRESS=0xYourSkimpyAddress
BURN_VAULT_ADDRESS=0xYourBurnVaultAddress
GOVERNOR_ADDRESS=0xYourGovernorAddress
TIMELOCK_ADDRESS=0xYourTimelockAddress
```

### 6.2 Test Governance Functions

```bash
# Test proposal creation
npx hardhat run scripts/test-governance.js --network base

# Test token minting/burning
npx hardhat run scripts/test-token.js --network base
```

### 6.3 Set Up Discord Notifications

Update Discord webhook with deployment success:
```bash
node scripts/discord-notify.js "🚀 SKIMPY Token successfully deployed to Base mainnet!"
```

---

## 🔒 Security Checklist

### Pre-Deployment
- [ ] Private keys stored securely (not in git)
- [ ] API keys configured correctly
- [ ] Sufficient ETH for gas fees
- [ ] Tested on testnet first

### Post-Deployment
- [ ] All contracts verified on Basescan
- [ ] Contract addresses saved securely
- [ ] Governance roles configured correctly
- [ ] Discord notifications working
- [ ] Documentation updated with addresses

---

## 🚨 Troubleshooting

### Common Issues

**"Insufficient funds for gas"**
- Solution: Add more ETH to deployer wallet

**"Network connection failed"**
- Solution: Check Alchemy API key and network URLs

**"Contract verification failed"**
- Solution: Ensure constructor arguments match exactly

**"Nonce too high/low"**
- Solution: Reset MetaMask account or use `--reset` flag

### Getting Help

1. Check Hardhat console output for specific errors
2. Verify network configuration in `hardhat.config.js`
3. Test with `--dry-run` flag first
4. Use `--verbose` flag for detailed logging

---

## 📋 Contract Addresses Template

After successful deployment, record your addresses:

```
SKIMPY TOKEN DEPLOYMENT RECORD
=============================
Network: Base Mainnet (Chain ID: 8453)
Deployment Date: [DATE]
Deployer Address: [DEPLOYER_ADDRESS]

Contract Addresses:
- BurnVault: [BURNVAULT_ADDRESS]
- Skimpy Token: [SKIMPY_ADDRESS]  
- SkimpyTimelock: [TIMELOCK_ADDRESS]
- SkimpyGovernor: [GOVERNOR_ADDRESS]

Basescan Links:
- Token: https://basescan.org/token/[SKIMPY_ADDRESS]
- Governor: https://basescan.org/address/[GOVERNOR_ADDRESS]

Total Deployment Cost: [COST] ETH
Gas Used: [GAS_USED]
```

---

## 🎉 Success!

Once deployed, your SKIMPY Token will be:
- ✅ **Live on Base blockchain**
- ✅ **Fully decentralized governance**
- ✅ **Community-controlled through voting**
- ✅ **Verifiable on Basescan**
- ✅ **Ready for trading and DeFi integration**

**Your token is now live on Base! Welcome to the decentralized world! 🚀**

---

## 📞 Support

For deployment support:
- Review Hardhat documentation
- Check Base blockchain documentation
- Reference OpenZeppelin governance guides
- Test thoroughly on testnet first

**Remember**: Once deployed to mainnet, contracts are immutable! Test extensively on Sepolia first.