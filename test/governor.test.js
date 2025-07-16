const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkimpyGovernor", function () {
  let skimpy, timelock, governor, burnVault;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy BurnVault
    const BurnVault = await ethers.getContractFactory("BurnVault");
    burnVault = await BurnVault.deploy(ethers.ZeroAddress); // Dummy address for now
    await burnVault.waitForDeployment();
    const burnVaultAddress = await burnVault.getAddress();

    // Deploy Skimpy
    const Skimpy = await ethers.getContractFactory("Skimpy");
    skimpy = await Skimpy.deploy(burnVaultAddress);
    await skimpy.waitForDeployment();
    const skimpyAddress = await skimpy.getAddress();

    // Deploy SkimpyTimelock
    const SkimpyTimelock = await ethers.getContractFactory("SkimpyTimelock");
    timelock = await SkimpyTimelock.deploy(3600, [owner.address], [owner.address], owner.address);
    await timelock.waitForDeployment();
    const timelockAddress = await timelock.getAddress();

    // Deploy SkimpyGovernor
    const SkimpyGovernor = await ethers.getContractFactory("SkimpyGovernor");
    governor = await SkimpyGovernor.deploy(skimpyAddress);
    await governor.waitForDeployment();
    const governorAddress = await governor.getAddress();

    // Grant roles
    const proposerRole = await timelock.PROPOSER_ROLE();
    const executorRole = await timelock.EXECUTOR_ROLE();
    await timelock.grantRole(proposerRole, governorAddress);
    await timelock.grantRole(executorRole, governorAddress);
  });

  it("should deploy correctly", async function () {
    expect(await governor.name()).to.equal("SkimpyGovernor");
  });

  it("should allow creating a proposal", async function () {
    const transferCallData = skimpy.interface.encodeFunctionData("transfer", [addr1.address, ethers.parseEther("100")]);

    await skimpy.delegate(owner.address);

    const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes("Proposal #1: Transfer 100 SKMP to addr1"));
    const proposalId = await governor.hashProposal([await skimpy.getAddress()], [0], [transferCallData], descriptionHash);

    await governor.propose(
      [await skimpy.getAddress()],
      [0],
      [transferCallData],
      "Proposal #1: Transfer 100 SKMP to addr1"
    );

    const proposalState = await governor.state(proposalId);
    expect(proposalState).to.equal(0); // 0 is the enum for Pending
  });

  it("should allow voting on a proposal", async function () {
    const transferCallData = skimpy.interface.encodeFunctionData("transfer", [addr1.address, ethers.parseEther("100")]);
    await skimpy.delegate(owner.address);

    await skimpy.delegate(owner.address);

    const tx = await governor.propose(
      [await skimpy.getAddress()],
      [0],
      [transferCallData],
      "Proposal #1: Transfer 100 SKMP to addr1"
    );
    const receipt = await tx.wait();
    const logs = receipt.logs.map(log => governor.interface.parseLog(log)).filter(Boolean);
    const event = logs.find(e => e.name === 'ProposalCreated');
    const proposalId = event.args.proposalId;

    await ethers.provider.send("evm_mine", []); // Wait for voting delay

    await governor.castVote(proposalId, 1); // 1 for "For"

    const proposalState = await governor.state(proposalId);
    expect(proposalState).to.equal(1); // 1 is the enum for Active
  });
});