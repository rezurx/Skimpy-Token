# Skimpy Token Governance

This document outlines the technical implementation of the SKIMPY token's governance system.

**Objective:** To create a robust and secure governance system based on the OpenZeppelin Governor framework, allowing token holders to propose and vote on changes to the ecosystem.

**Current Status (2025-07-28):** ✅ **Complete** - A full-featured governance system with a timelock is deployed and tested.

---

## 🏛️ Core Components

The governance system consists of the following smart contracts:

1.  **`Skimpy.sol`**: The core ERC-20 token contract. It includes the `ERC20Votes` extension, which is essential for tracking voting power and enabling delegation.
2.  **`SkimpyGovernor.sol`**: The main governance contract, based on OpenZeppelin's `Governor`. It manages the proposal lifecycle, from creation to execution.
3.  **`SkimpyTimelock.sol`**: A `TimelockController` contract that adds a mandatory time delay to all successful proposals before they can be executed. This acts as a critical security measure, giving users time to react to potentially malicious proposals.

---

## 🔧 How Governance Works

The system follows a standard, battle-tested governance workflow:

1.  **Propose:** Any token holder can create a proposal, which consists of one or more actions to be executed by the governance system (e.g., calling a function on another contract).
2.  **Vote:** Once a proposal is created, a voting period begins. Token holders can cast their votes for, against, or in abstention of the proposal.
3.  **Queue:** If a proposal receives enough "For" votes to meet the quorum and passes, it is queued in the `Timelock`.
4.  **Execute:** After the timelock delay has passed, the proposal can be executed. This will trigger the actions specified in the proposal.

---

## 🗳️ How to Participate in Governance

To participate in Skimpy governance, you need to hold SKMP tokens. Your voting power is determined by the number of tokens you hold.

### Delegating Your Voting Power

To use your voting power, you must first **delegate** it. You can delegate your votes to yourself or to another address you trust to vote on your behalf.

**Why is delegation necessary?**
The `ERC20Votes` contract uses a checkpointing system to prevent "flash loan" voting attacks. It records voting power at a specific block in the past. To activate your voting power, you need to create a transaction that "snapshots" your balance, and delegation is the way to do this.

**How to Delegate:**

You can delegate your votes by calling the `delegate` function on the `Skimpy` token contract.

*   **Delegate to yourself:** Call `delegate(YOUR_OWN_ADDRESS)`. This is the most common option if you plan to vote yourself.
*   **Delegate to another address:** Call `delegate(ANOTHER_ADDRESS)`. This is useful if you want a more active community member to vote on your behalf.

Once you have delegated your votes, you will be able to create proposals and vote on existing ones.