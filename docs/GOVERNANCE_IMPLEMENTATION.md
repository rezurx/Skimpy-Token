# Burn-Gated Governance: Implementation Plan

This document outlines the technical steps required to implement a burn-gated governance prototype for the SKIMPY token project.

**Objective:** To create a system where users vote on proposals by burning SKIMPY tokens, making voting a direct economic signal of conviction. The governance system will control a community treasury.

**Current Status (2025-07-11):** ✅ **Phase 1 Complete** - Basic governance contracts implemented and compiling successfully. Ready for deployment and testing.

---

## 🏛️ Core Components

## 🎯 Current Implementation Status

### ✅ Completed Components
1.  **`Skimpy.sol` (Updated):** ERC-20 token with `ERC20Votes` extension for governance voting power tracking
2.  **`SkimpyGovernor.sol` (Implemented):** OpenZeppelin-based governance contract with essential features
3.  **`SkimpyTimelock.sol` (Created):** Basic timelock controller (not currently integrated)

### 🚧 Planned Components  
4.  **`Treasury.sol` (Planned):** A simple contract that holds funds (e.g., Ether) to be controlled by governance

### 🔧 Technical Architecture
The current governance system uses **standard OpenZeppelin Governor voting** rather than the original burn-based voting concept. This provides:
- Token-based voting power (no burning required)
- Established, secure governance patterns
- Compatibility with existing DeFi governance tools
- Potential for future burn-gated enhancements

---

## 📝 Step-by-Step Implementation

### Step 1: Create the `Treasury.sol` Contract

This contract is a simple vault whose funds can only be released by its owner (which will be the `Governor` contract).

**File:** `contracts/Treasury.sol`

**Specification:**
- **State Variables:**
    - `address public owner;`
- **Functions:**
    - `constructor()`: Sets the `owner` to the address that deployed the contract.
    - `receive() external payable`: Allows the contract to receive Ether.
    - `releaseFunds(address payable _to, uint256 _amount)`:
        - Can only be called by the `owner`.
        - Transfers a specified amount of Ether to a target address.
        - Emits a `FundsReleased` event.
    - `transferOwnership(address _newOwner)`:
        - Can only be called by the current `owner`.
        - Transfers ownership to a new address (the `Governor` contract).

### Step 2: Create the `Governor.sol` Contract

This is the brain of the governance system. It will handle the entire proposal lifecycle.

**File:** `contracts/Governor.sol`

**Specification:**
- **State Variables:**
    - `ISkimpy public skimpyToken;`: The SKIMPY token contract interface.
    - `Treasury public treasury;`: The Treasury contract.
    - `uint256 public nextProposalId;`: A counter for proposals.
    - `mapping(uint256 => Proposal) public proposals;`: Stores all proposal data.
    - `uint256 public votingPeriod;`: The duration (in blocks or seconds) that a vote remains active. We can start with a fixed value (e.g., 7 days).

- **Structs:**
    - `Proposal`:
        - `uint256 id;`
        - `address proposer;`
        - `string description;`
        - `uint256 votes;`
        - `uint256 endBlock;`
        - `bool executed;`
        - `address target;` // The contract to call (our Treasury)
        - `bytes data;` // The function call to execute

- **Core Functions:**
    - `createProposal(address _target, bytes memory _data, string memory _description)`:
        - Allows any user to create a new proposal.
        - The `_data` field will contain the encoded function call for `treasury.releaseFunds(...)`.
        - Creates a new `Proposal` struct and stores it.
        - Emits a `ProposalCreated` event.
    - `vote(uint256 _proposalId, uint256 _voteWeight)`:
        - The core voting function.
        - Requires that the proposal is active (i.e., `block.number < proposal.endBlock`).
        - Burns `_voteWeight` SKIMPY tokens from `msg.sender` by calling `skimpyToken.burn(msg.sender, _voteWeight)`.
        - Adds `_voteWeight` to the proposal's total `votes`.
        - Emits a `Voted` event.
    - `executeProposal(uint256 _proposalId)`:
        - Checks that the voting period has ended (`block.number >= proposal.endBlock`).
        - Checks that the proposal has not already been executed.
        - **(Simple Majority Logic):** For this prototype, we can define "passing" as having any number of votes greater than zero. More complex quorum logic can be added later.
        - If the proposal passes, it executes the transaction: `proposal.target.call(proposal.data)`.
        - Marks the proposal as `executed`.
        - Emits a `ProposalExecuted` event.

### Step 3: Update Deployment Scripts

A new script is needed to deploy and configure the governance system.

**File:** `scripts/deploy-governance.js`

**Workflow:**
1.  Deploy `Skimpy.sol` (or use an existing deployment).
2.  Deploy `Treasury.sol`.
3.  Deploy `Governor.sol`, passing the addresses of the `Skimpy` and `Treasury` contracts to its constructor.
4.  **Crucial Step:** Call `treasury.transferOwnership()` to transfer ownership of the `Treasury` contract to the newly deployed `Governor` contract.
5.  Log the addresses of all three deployed contracts.

### Step 4: Write Comprehensive Tests

A new test file is required to ensure the entire system works as expected from end to end.

**File:** `test/governance.test.js`

**Test Cases:**
1.  **Deployment:**
    - Should correctly deploy all three contracts.
    - `Governor` should be the owner of the `Treasury`.
2.  **Proposal Creation:**
    - Any user should be able to create a proposal.
    - Proposal details should be stored correctly.
3.  **Voting:**
    - A user with SKIMPY tokens should be able to vote.
    - The correct number of tokens should be burned from the voter's wallet.
    - The proposal's vote count should increase correctly.
    - A user without enough tokens should not be able to vote.
4.  **Proposal Execution:**
    - A proposal should not be executable before the voting period ends.
    - A failed proposal (e.g., 0 votes) should not be executable.
    - A successful proposal should be executable once.
    - When executed, the `Treasury` should successfully release the funds.
    - A proposal should not be executable more than once.

---

## 📊 Visual Workflow

```
           (Burns SKIMPY)
User ---------------------> Governor.vote()
  ^                           |
  |                           | (Executes Proposal)
  |                           V
(Creates Proposal)        Treasury.releaseFunds() --> Recipient
```
