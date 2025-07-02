const { ethers, run, network } = require("hardhat");

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
  
  // Wait for block confirmations and then verify
  if (network.config.chainId !== 31337 && process.env.BASESCAN_API_KEY) {
    console.log("\n⏳ Waiting for block confirmations...");
    await skimpy.deploymentTransaction().wait(6);
    console.log("✅ Block confirmations received.");

    console.log("\n🔍 Verifying contract on Basescan...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("✅ Contract is already verified.");
      } else {
        console.error("❌ Verification failed:", error);
      }
    }
  }
  
  console.log("\n💾 Save this contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
