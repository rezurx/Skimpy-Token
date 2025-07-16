const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Integration", function () {
  let skimpy, timelock, governor, burnVault, newBurnVault;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy BurnVault
    const BurnVault = await ethers.getContractFactory("BurnVault");
    burnVault = await BurnVault.deploy(ethers.ZeroAddress);
    await burnVault.waitForDeployment();
    const burnVaultAddress = await burnVault.getAddress();

    newBurnVault = await BurnVault.deploy(ethers.ZeroAddress);
    await newBurnVault.waitForDeployment();

    // Deploy Skimpy
    const Skimpy = await ethers.getContractFactory("Skimpy");
    skimpy = await Skimpy.deploy(burnVaultAddress, owner.address);
    await skimpy.waitForDeployment();
    const skimpyAddress = await skimpy.getAddress();

    // Deploy SkimpyTimelock
    const SkimpyTimelock = await ethers.getContractFactory("SkimpyTimelock");
    timelock = await SkimpyTimelock.deploy(3600, [owner.address], [owner.address], owner.address);
    await timelock.waitForDeployment();
    const timelockAddress = await timelock.getAddress();

    // Deploy SkimpyGovernor
    const SkimpyGovernor = await ethers.getContractFactory("SkimpyGovernor");
    governor = await SkimpyGovernor.deploy(skimpyAddress, timelockAddress);
    await governor.waitForDeployment();
    const governorAddress = await governor.getAddress();

    // Grant roles
    const proposerRole = await timelock.PROPOSER_ROLE();
    const executorRole = await timelock.EXECUTOR_ROLE();
    await timelock.grantRole(proposerRole, governorAddress);
    await timelock.grantRole(executorRole, governorAddress);

    // Transfer ownership of Skimpy to Timelock
    await skimpy.transferOwnership(timelockAddress);
  });

  it("should allow governance to change the burn vault", async function () {
    const newBurnVaultAddress = await newBurnVault.getAddress();
    const transferCallData = skimpy.interface.encodeFunctionData("setBurnVault", [newBurnVaultAddress]);

    await skimpy.delegate(owner.address);

    const description = "Proposal #2: Change burn vault";
    const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(description));

    const tx = await governor.propose(
      [await skimpy.getAddress()],
      [0],
      [transferCallData],
      description
    );
    const receipt = await tx.wait();
    const proposalId = receipt.logs.find(e => e.fragment.name === 'ProposalCreated').args.proposalId;

    await ethers.provider.send("evm_mine", []);

    await governor.castVote(proposalId, 1);

    // Wait for voting period to end
    for (let i = 0; i < 45818; i++) {
      await ethers.provider.send("evm_mine", []);
    }

    await governor.queue([await skimpy.getAddress()], [0], [transferCallData], descriptionHash);

    // Wait for timelock delay
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine", []);

    await governor.execute([await skimpy.getAddress()], [0], [transferCallData], descriptionHash);

    expect(await skimpy.burnVault()).to.equal(newBurnVaultAddress);
  });
});
