const { ethers, run, network } = require("hardhat");

async function main() {
  console.log("🚀 Starting Governance System deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy Skimpy Token
  console.log("\n📄 Deploying Skimpy contract...");
  const Skimpy = await ethers.getContractFactory("Skimpy");
  // The Skimpy contract requires a burnVault address in its constructor.
  // For the purpose of deploying the governance system, we can deploy a new BurnVault
  // or use an existing one if its address is known.
  // For simplicity, we'll deploy a new BurnVault here.
  const BurnVault = await ethers.getContractFactory("BurnVault");
  const burnVault = await BurnVault.deploy(ethers.ZeroAddress); // Dummy address for now
  await burnVault.waitForDeployment();
  const burnVaultAddress = await burnVault.getAddress();
  console.log("✅ BurnVault deployed to:", burnVaultAddress);

  const skimpy = await Skimpy.deploy(burnVaultAddress);
  await skimpy.waitForDeployment();
  const skimpyAddress = await skimpy.getAddress();
  console.log("✅ Skimpy Token deployed to:", skimpyAddress);

  // Deploy SkimpyTimelock
  console.log("\n📄 Deploying SkimpyTimelock contract...");
  const SkimpyTimelock = await ethers.getContractFactory("SkimpyTimelock");
  const minDelay = 3600; // 1 hour
  const proposers = [deployer.address];
  const executors = [deployer.address];
  const admin = deployer.address;
  const timelock = await SkimpyTimelock.deploy(minDelay, proposers, executors, admin);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ SkimpyTimelock deployed to:", timelockAddress);

  // Deploy SkimpyGovernor
  console.log("\n📄 Deploying SkimpyGovernor contract...");
  const SkimpyGovernor = await ethers.getContractFactory("SkimpyGovernor");
  const governor = await SkimpyGovernor.deploy(skimpyAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("✅ SkimpyGovernor deployed to:", governorAddress);

  // Grant roles in Timelock
  console.log("\n🔐 Granting roles in Timelock...");
  const proposerRole = await timelock.PROPOSER_ROLE();
  const executorRole = await timelock.EXECUTOR_ROLE();
  const adminRole = await timelock.TIMELOCK_ADMIN_ROLE();

  await timelock.grantRole(proposerRole, governorAddress);
  console.log(`Granted PROPOSER_ROLE to Governor at ${governorAddress}`);
  await timelock.grantRole(executorRole, governorAddress);
  console.log(`Granted EXECUTOR_ROLE to Governor at ${governorAddress}`);

  // Revoke deployer's admin role in Timelock for security
  await timelock.revokeRole(adminRole, deployer.address);
  console.log(`Revoked TIMELOCK_ADMIN_ROLE from deployer (${deployer.address})`);


  // Verification
  if (network.config.chainId !== 31337 && process.env.BASESCAN_API_KEY) {
    console.log("\n⏳ Waiting for block confirmations...");
    await skimpy.deploymentTransaction().wait(6);
    await timelock.deploymentTransaction().wait(6);
    await governor.deploymentTransaction().wait(6);
    console.log("✅ Block confirmations received.");

    console.log("\n🔍 Verifying contracts on Etherscan...");
    await run("verify:verify", { address: skimpyAddress, constructorArguments: [burnVaultAddress] });
    await run("verify:verify", { address: timelockAddress, constructorArguments: [minDelay, proposers, executors, admin] });
    await run("verify:verify", { address: governorAddress, constructorArguments: [skimpyAddress] });
  }

  console.log("\n🎉 Governance System Deployed! 🎉");
  console.log("Skimpy Token:", skimpyAddress);
  console.log("SkimpyTimelock:", timelockAddress);
  console.log("SkimpyGovernor:", governorAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
