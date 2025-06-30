const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Skimpy Token deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("📄 Deploying Skimpy contract...");
  const Skimpy = await ethers.getContractFactory("Skimpy");
  const skimpy = await Skimpy.deploy();
  
  await skimpy.waitForDeployment();
  const contractAddress = await skimpy.getAddress();
  
  console.log("✅ Skimpy deployed to:", contractAddress);
  
  // Verify token details
  const name = await skimpy.name();
  const symbol = await skimpy.symbol();
  const totalSupply = await skimpy.totalSupply();
  const deployerBalance = await skimpy.balanceOf(deployer.address);
  
  console.log("\n📊 Token Details:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", ethers.formatEther(totalSupply), "SKMP");
  console.log("Deployer Balance:", ethers.formatEther(deployerBalance), "SKMP");
  
  console.log("\n🔗 Next Steps:");
  console.log("1. Verify contract on Basescan:");
  console.log(`   npx hardhat verify --network ${network.name} ${contractAddress}`);
  console.log("2. Add token metadata on Basescan");
  console.log("3. Optional: Create Aerodrome liquidity pool");
  
  console.log("\n💾 Save this contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });