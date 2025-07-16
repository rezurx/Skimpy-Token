# Dev Log

## June 27, 2025

- Initial project setup and review.
- Confirmed `Skimpy.sol` as the canonical contract name.
- Created `LICENSE` file with BUSL 1.1.
- Created `docs/` directory and this `dev-log.md` file.
- Next: Update `README.md` and add burn function to `Skimpy.sol`.


## June 28, 2025

- Added `burn` function to `Skimpy.sol`.
- Added `README.md` content.
- Added `test/skimpy.test.js` with initial tests.
- Added `scripts/deploy.js` for deployment.
- Added `.env.example` for environment variables.
- Added `hardhat.config.js` with basic configuration.
- Added `.gitignore` to exclude `node_modules`, `.env`, etc.
- Added `package.json` and `package-lock.json` with dependencies.
- Ran `npm install` to install dependencies.
- Ran `npx hardhat compile` to compile contracts.
- Ran `npx hardhat test` to run tests.
- Ran `npx hardhat run scripts/deploy.js` to deploy to a local testnet.
- All steps completed successfully.

## June 29, 2025

- Created `PROGRESS.md` to track project progress.
- Created `DISCLAIMER.md` to clarify the project's experimental nature.
- Added a disclaimer to the top of `README.md`.
- Added tests for the `burn` function in `test/skimpy.test.js`.
- Updated `scripts/deploy.js` to automatically verify the contract on Basescan.
- Created `contracts/BurnVault.sol` to hold burned tokens.
- Modified `contracts/Skimpy.sol` to integrate with `BurnVault.sol`.
- Updated `test/skimpy.test.js` to reflect the `BurnVault` integration.
- Created `scripts/deploy-with-vault.js` to deploy both contracts and link them.
- Created `scripts/faucet-bot/` directory and initialized a new Node.js project.
- Created `scripts/faucet-bot/index.js` for the Discord faucet bot.
- Updated `.env.example` with faucet bot configuration.
- Implemented and tested the Discord faucet bot.

## June 30, 2025

- Created `scripts/discord-notify.js` for sending notifications to Discord.
- Created `scripts/git-commit.sh` to automate the git workflow.
- Created `.github/workflows/discord-notify.yml` for GitHub Actions.
- Updated `PROGRESS.md` with the latest changes.

## July 11, 2025

- Created `contracts/SkimpyGovernor.sol` and `contracts/SkimpyTimelock.sol`.
- Modified `contracts/Skimpy.sol` to inherit from `ERC20Votes`.
- Fixed compilation errors in the governance contracts.
- Updated `PROGRESS.md` with the latest changes.
- Updated `docs/GOVERNANCE_IMPLEMENTATION.md` with details on the governance system.
- Created `test/governor.test.js` to test the governance contracts.
- Created `scripts/deploy-governor.js` to deploy the governance contracts.

## July 16, 2025

- Created `scripts/deploy-governor.js` to deploy the governance contracts.
- Created `test/governor.test.js` to test the governance contracts.
- Debugged and fixed issues in the test file to ensure all tests pass.
- Updated `PROGRESS.md`, `README.md`, and `docs/dev-log.md` to reflect the latest changes.