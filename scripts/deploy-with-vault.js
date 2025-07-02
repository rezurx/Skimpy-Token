const { ethers, run, network } = require("hardhat");

async function main() {
  console.log("🚀 Starting BurnVault and Skimpy Token deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy Skimpy first (with a dummy address for BurnVault initially)
  console.log("📄 Deploying Skimpy contract (initial pass for address)...");
  const Skimpy = await ethers.getContractFactory("Skimpy");
  const initialSkimpy = await Skimpy.deploy(ethers.ZeroAddress); // Deploy with a dummy address
  await initialSkimpy.waitForDeployment();
  const skimpyAddress = await initialSkimpy.getAddress();
  console.log("✅ Skimpy (initial) deployed to:", skimpyAddress);

  // Deploy BurnVault with the actual Skimpy token address
  console.log("📄 Deploying BurnVault contract...");
  const BurnVault = await ethers.getContractFactory("BurnVault");
  const burnVault = await BurnVault.deploy(skimpyAddress);
  await burnVault.waitForDeployment();
  const burnVaultAddress = await burnVault.getAddress();
  console.log("✅ BurnVault deployed to:", burnVaultAddress);

  // Redeploy Skimpy with the correct BurnVault address
  console.log("📄 Redeploying Skimpy contract with correct BurnVault address...");
  const finalSkimpy = await Skimpy.deploy(burnVaultAddress);
  await finalSkimpy.waitForDeployment();
  const finalSkimpyAddress = await finalSkimpy.getAddress();
  console.log("✅ Skimpy (final) deployed to:", finalSkimpyAddress);

  // Verify token details from the final Skimpy contract
  const name = await finalSkimpy.name();
  const symbol = await finalSkimpy.symbol();
  const totalSupply = await finalSkimpy.totalSupply();
  const deployerBalance = await finalSkimpy.balanceOf(deployer.address);
  
  console.log("\n📊 Token Details (from final Skimpy contract):");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", ethers.formatEther(totalSupply), "SKMP");
  console.log("Deployer Balance:", ethers.formatEther(deployerBalance), "SKMP");
  console.log("Burn Vault Address:", await finalSkimpy.burnVault());

  // Wait for block confirmations and then verify
  if (network.config.chainId !== 31337 && process.env.BASESCAN_API_KEY) {
    console.log("\n⏳ Waiting for block confirmations...");
    await finalSkimpy.deploymentTransaction().wait(6);
    console.log("✅ Block confirmations received.");

    console.log("\n🔍 Verifying Skimpy contract on Basescan...");
    try {
      await run("verify:verify", {
        address: finalSkimpyAddress,
        constructorArguments: [burnVaultAddress],
      });
      console.log("✅ Skimpy contract verified successfully!");
    } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("✅ Skimpy contract is already verified.");
      } else {
        console.error("❌ Skimpy verification failed:", error);
      }
    }

    console.log("\n🔍 Verifying BurnVault contract on Basescan...");
    try {
      await run("verify:verify", {
        address: burnVaultAddress,
        constructorArguments: [skimpyAddress],
      });
      console.log("✅ BurnVault contract verified successfully!");
    } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("✅ BurnVault contract is already verified.");
      } else {
        console.error("❌ BurnVault verification failed:", error);
      }
    }
  }
  
  console.log("\n💾 Save final Skimpy contract address:", finalSkimpyAddress);
  console.log("💾 Save BurnVault contract address:", burnVaultAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });