const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Skimpy", function () {
  let skimpy;
  let burnVault;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Skimpy = await ethers.getContractFactory("Skimpy");
    const BurnVault = await ethers.getContractFactory("BurnVault");

    burnVault = await BurnVault.deploy(ethers.ZeroAddress);
    await burnVault.waitForDeployment();
    const burnVaultAddress = await burnVault.getAddress();

    skimpy = await Skimpy.deploy(burnVaultAddress, owner.address);
    await skimpy.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have correct name and symbol", async function () {
      expect(await skimpy.name()).to.equal("Skimpy");
      expect(await skimpy.symbol()).to.equal("SKMP");
    });

    it("Should mint 1,000,000 SKMP to deployer", async function () {
      const totalSupply = await skimpy.totalSupply();
      const ownerBalance = await skimpy.balanceOf(owner.address);
      
      expect(totalSupply).to.equal(ethers.parseEther("1000000"));
      expect(ownerBalance).to.be.closeTo(totalSupply, ethers.parseEther("0.01"));
    });

    it("Should have 18 decimals", async function () {
      expect(await skimpy.decimals()).to.equal(18);
    });

    it("Should set the correct burn vault address", async function () {
      expect(await skimpy.burnVault()).to.equal(await burnVault.getAddress());
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts, applying decay", async function () {
      const transferAmount = ethers.parseEther("100");
      
      // Get the balance immediately before the transfer
      const ownerInitialBalance = await skimpy.balanceOf(owner.address);

      await skimpy.transfer(addr1.address, transferAmount);
      
      const addr1Balance = await skimpy.balanceOf(addr1.address);
      const ownerFinalBalance = await skimpy.balanceOf(owner.address);

      // Use closeTo to account for minor decay during test execution
      expect(addr1Balance).to.be.closeTo(transferAmount, ethers.parseEther("0.01"));
      expect(ownerFinalBalance).to.be.closeTo(ownerInitialBalance - transferAmount, ethers.parseEther("0.01"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await skimpy.balanceOf(owner.address);
      
      await expect(
        skimpy.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(skimpy, "ERC20InsufficientBalance");
      
      expect(await skimpy.balanceOf(owner.address)).to.be.closeTo(initialOwnerBalance, ethers.parseEther("0.01"));
    });
  });

  describe("Burns", function () {
    it("Should transfer tokens to the burn vault, applying decay", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialOwnerBalance = await skimpy.balanceOf(owner.address);
      const initialVaultBalance = await skimpy.balanceOf(await burnVault.getAddress());

      await skimpy.burn(burnAmount);

      const finalOwnerBalance = await skimpy.balanceOf(owner.address);
      const finalVaultBalance = await skimpy.balanceOf(await burnVault.getAddress());

      expect(finalOwnerBalance).to.be.closeTo(initialOwnerBalance - burnAmount, ethers.parseEther("0.01"));
      expect(finalVaultBalance).to.be.closeTo(initialVaultBalance + burnAmount, ethers.parseEther("0.01"));
    });

    it("Should fail if trying to burn more than balance", async function () {
      const initialOwnerBalance = await skimpy.balanceOf(owner.address);
      const burnAmount = initialOwnerBalance + ethers.parseEther("1");

      await expect(
        skimpy.burn(burnAmount)
      ).to.be.revertedWithCustomError(skimpy, "ERC20InsufficientBalance");
    });
  });

  describe("Demurrage", function () {
    it("Should have the correct decayed balance after one year", async function () {
      const initialBalance = await skimpy.balanceOf(owner.address);
      const expectedDecay = (initialBalance * BigInt(31536000) * BigInt(6341958396)) / BigInt(10**18);
      const expectedBalanceAfterDecay = initialBalance - expectedDecay;

      // First transaction to set the initial timestamp
      await skimpy.transfer(addr1.address, 0);

      // Advance time by one year
      await time.increase(31536000);

      const balanceAfterDecay = await skimpy.balanceOf(owner.address);

      // Check if the balance is close to the expected value (within a small tolerance)
      expect(balanceAfterDecay).to.be.closeTo(expectedBalanceAfterDecay, ethers.parseEther("1"));
    });

    it("Should apply decay on transfer", async function () {
      const initialBalance = await skimpy.balanceOf(owner.address);
      const transferAmount = ethers.parseEther("100");

      // First transaction to set the initial timestamp
      await skimpy.transfer(addr1.address, 0);

      // Advance time by half a year
      await time.increase(15768000);

      const expectedDecay = (initialBalance * BigInt(15768000) * BigInt(6341958396)) / BigInt(10**18);
      const expectedBalanceBeforeTransfer = initialBalance - expectedDecay;

      // Perform the transfer
      await skimpy.transfer(addr1.address, transferAmount);

      const finalBalance = await skimpy.balanceOf(owner.address);
      const expectedFinalBalance = expectedBalanceBeforeTransfer - transferAmount;

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("1"));
    });

    it("Should reduce total supply on decay", async function () {
      const initialTotalSupply = await skimpy.totalSupply();

      // First transaction to set the initial timestamp for the owner
      await skimpy.transfer(addr1.address, 0);

      // Advance time by one year
      await time.increase(31536000);

      // Trigger the decay by performing another transaction
      await skimpy.transfer(addr1.address, 0);

      const finalTotalSupply = await skimpy.totalSupply();
      const expectedDecay = (initialTotalSupply * BigInt(31536000) * BigInt(6341958396)) / BigInt(10**18);
      const expectedFinalTotalSupply = initialTotalSupply - expectedDecay;

      expect(finalTotalSupply).to.be.closeTo(expectedFinalTotalSupply, ethers.parseEther("1"));
    });
  });
});
