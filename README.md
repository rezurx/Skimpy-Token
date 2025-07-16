# SKIMPY Token

> ⚠️ **Disclaimer**  
This is an experimental project intended for education and personal development.  
SKIMPY Token (SKMP) is not promoted, marketed, or intended for public use — but it is deployed on a public blockchain and permissionless by nature.  
Use at your own risk. No roadmap, utility, or support is provided.

SKIMPY is a **sandbox token project** for exploring smart contract development, tokenomics experimentation, and decentralized identity mechanics. This is not a product or launchpad — it's a **public learning lab**.

---

## Project Purpose

SKIMPY exists to:

- Learn and test Ethereum-compatible token development using Hardhat
- Prototype features like burn vaults, dynamic tokenomics, and modular DAO hooks
- Serve as a timestamped public proof of capability before shipping $RES and RSTs
- Help the developer learn GitHub, Discord, and smart contract deployment workflows

---

## Project Structure

```plaintext
skimpy-token/
├── contracts/             # Solidity token contract(s)
│   └── Skimpy.sol
├── scripts/               # Deployment scripts (Hardhat)
│   └── deploy.js
├── test/                  # Tests for token logic
│   └── skimpy.test.js
├── artifacts/             # Auto-generated build outputs (excluded in .gitignore)
├── cache/                 # Hardhat cache
├── .env.example           # Placeholder for environment variables
├── .gitignore             # Node/Hardhat artifacts and secrets ignored
├── hardhat.config.js      # Project config for Hardhat
├── package.json           # Project dependencies
├── package-lock.json
├── README.md              # This file
├── LICENSE                # Business Source License (or CAL preferred)
└── docs/
    └── dev-log.md         # Ongoing log of learning and milestones
```

---

## Token Design Notes

* **Network**: Ethereum-compatible (Hardhat)
* **Token Standard**: ERC-20
* **Initial Supply**: 1,000,000 SKIMPY
* **Symbol**: SKIMPY
* **Mint Function**: Owner-only (for testing)
* **Burn Function**: Public
* **Extras** (Planned):

  * Faucet logic
  * Burn vault integration
  * Tokenomics tuning (e.g., demurrage, decay)
  * Optional metadata fields

---

## License

This project uses the **Business Source License (BUSL)**:

* You may read, clone, and fork it.
* You may not use it in production, commercial apps, or tokens without explicit permission.

See [LICENSE](./LICENSE) for details.

---

## Dev Log (Highlights)

See [`docs/dev-log.md`](docs/dev.log.md) for detailed progress notes.

---

## ✅ Status

| Component          | Status         |
| ------------------ | -------------- |
| ERC-20 Token Logic | ✅ Working      |
| Hardhat Framework  | ✅ Configured   |
| Testing Suite      | ✅ Done      |
| Discord Webhook    |  Planned     |
| Burn Vault Design  |  Drafting    |
| Faucet Bot         |  Not started |
| GitHub Workflow    |  Live        |

---

## ️ Install & Run

### Setup

```bash
npm install
```

### Compile

```bash
npx hardhat compile
```

### Deploy (to local testnet)

```bash
npx hardhat run scripts/deploy.js
```

---

## Governance Use (Later)

This project will evolve into a prototype for:

* Burn-gated voting
* On-chain identity using Reputation-Splitting Tokens (RSTs)
* Faucet-based loyalty scoring

---

## Contributing

Not accepting PRs right now — but feel free to fork and adapt. If you learn something useful, link back here so the original context is preserved.

---

## Credits

Built by [resurx@HP-Laptop] as part of a $20 → $1.5M personal challenge to build and automate Web3 micro-businesses.
