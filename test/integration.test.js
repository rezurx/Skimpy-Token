const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Integration", function () {
  let skimpy, timelock, governor, burnVault, newBurnVault;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

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

  it("should allow a user to delegate their voting power and vote", async function () {
    // Transfer some tokens from owner to addr1
    const transferAmount = ethers.parseUnits("10000", 18);
    await skimpy.connect(owner).transfer(addr1.address, transferAmount);

    // addr1 delegates its voting power to addr2
    await skimpy.connect(addr1).delegate(addr2.address);

    // owner delegates to itself to activate its own voting power
    await skimpy.connect(owner).delegate(owner.address);

    // Check voting power after delegation
    // Note: getVotes returns the voting power at the *previous* block.
    // We need to mine a block for the delegation to be registered.
    await ethers.provider.send("evm_mine", []);
    
    // addr2's votes should now include addr1's balance
    expect(await skimpy.getVotes(addr2.address)).to.equal(transferAmount);
    // addr1's votes should be 0
    expect(await skimpy.getVotes(addr1.address)).to.equal(0);

    // Create a proposal
    const newBurnVaultAddress = await newBurnVault.getAddress();
    const transferCallData = skimpy.interface.encodeFunctionData("setBurnVault", [newBurnVaultAddress]);
    const description = "Proposal #3: Change burn vault with delegated votes";
    
    const tx = await governor.connect(owner).propose(
      [await skimpy.getAddress()],
      [0],
      [transferCallData],
      description
    );
    const receipt = await tx.wait();
    const proposalId = receipt.logs.find(e => e.fragment.name === 'ProposalCreated').args.proposalId;

    // Wait for the voting delay to pass
    await ethers.provider.send("evm_mine", []);

    // addr2 casts a vote using the delegated power
    await governor.connect(addr2).castVote(proposalId, 1); // 1 for "For"

    const proposalVotes = await governor.proposalVotes(proposalId);
    // The forVotes should equal the amount delegated from addr1
    expect(proposalVotes.forVotes).to.equal(transferAmount);
  });
});