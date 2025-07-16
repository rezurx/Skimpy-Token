const { expect } = require("chai");
const { ethers } = require("hardhat");

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

    // Deploy BurnVault with dummy address first
    burnVault = await BurnVault.deploy(ethers.ZeroAddress);
    await burnVault.waitForDeployment();
    const burnVaultAddress = await burnVault.getAddress();

    // Deploy Skimpy contract with BurnVault address and owner
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
      expect(ownerBalance).to.equal(totalSupply);
    });

    it("Should have 18 decimals", async function () {
      expect(await skimpy.decimals()).to.equal(18);
    });

    it("Should set the correct burn vault address", async function () {
      expect(await skimpy.burnVault()).to.equal(await burnVault.getAddress());
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await skimpy.transfer(addr1.address, transferAmount);
      expect(await skimpy.balanceOf(addr1.address)).to.equal(transferAmount);
      
      const ownerBalance = await skimpy.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther("999900"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await skimpy.balanceOf(owner.address);
      
      await expect(
        skimpy.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(skimpy, "ERC20InsufficientBalance");
      
      expect(await skimpy.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Burns", function () {
    it("Should transfer tokens to the burn vault", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialOwnerBalance = await skimpy.balanceOf(owner.address);
      const initialVaultBalance = await skimpy.balanceOf(await burnVault.getAddress());

      await skimpy.burn(burnAmount);

      const finalOwnerBalance = await skimpy.balanceOf(owner.address);
      const finalVaultBalance = await skimpy.balanceOf(await burnVault.getAddress());

      expect(finalOwnerBalance).to.equal(initialOwnerBalance - burnAmount);
      expect(finalVaultBalance).to.equal(initialVaultBalance + burnAmount);
    });

    it("Should fail if trying to burn more than balance", async function () {
      const initialOwnerBalance = await skimpy.balanceOf(owner.address);
      const burnAmount = initialOwnerBalance + ethers.parseEther("1");

      await expect(
        skimpy.burn(burnAmount)
      ).to.be.revertedWithCustomError(skimpy, "ERC20InsufficientBalance");
    });
  });
});