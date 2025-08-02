# SKIMPY Token

<div align="center">
  <img src="https://ipfs.io/ipfs/bafybeigy3vvqw6wjitrfrzmolrrx5q6fsdpllpxtx5mrqxyefe74hpc63a" alt="SKIMPY Token Logo" width="200"/>
</div>

> ⚠️ **Disclaimer**  
This is an experimental project intended for education and personal development.  
SKIMPY Token (SKMP) is not promoted, marketed, or intended for public use — but it is deployed on a public blockchain and permissionless by nature.  
Use at your own risk. No roadmap, utility, or support is provided.

SKIMPY is a **sandbox token project** for exploring smart contract development, tokenomics experimentation, and decentralized identity mechanics. This is not a product or launchpad — it's a **public learning lab**.

---

## Project Purpose

**Skimpy Token (SKMP)** is a deliberately **minimal, test-only ERC-20 token** designed as a **pilot project** for practicing blockchain development workflows. The core experiment is to create and deploy a token as cheaply as possible, validating the entire workflow on a minimal budget.

### Primary Purpose
- **Learning and Testing**: Master the end-to-end process of deploying blockchain assets on a minimal budget (e.g., ~$0.40 in gas fees).
- **Alpha Test**: Serve as the foundation for future, more legitimate token projects.

### Technical Objectives
- Practice **Solidity + Hardhat workflows**.
- Test deployments on **Base Sepolia** (testnet) and **Base Mainnet**.
- Verify contracts on **Basescan**.
- Add token metadata (logo, symbol, website).
- Optionally create a tiny liquidity pool (~$1 on Aerodrome).

### Strategic Context
Skimpy is explicitly **not a product** but rather a **dry run** that will lay the groundwork for:
- Future serious token launches (RWA-backed, memecoins, governance assets).
- CI/CD token workflows and security checks.
- UX systems like airdrop scripts and LP reward mechanisms.
- Integration into a larger **AI-powered micro-business incubator**.

### Key Characteristics
- **Non-promoted**: No marketing or community building.
- **Test-only**: A pure technical exercise.
- **Minimal Cost**: Designed to prove deployment is possible on a shoestring budget.
- **Foundation Building**: Once this works end-to-end, the developer plans to "scale and launch serious tokens."

Essentially, Skimpy Token is a **proof-of-concept** to validate the technical infrastructure before deploying real projects with actual utility and community value.

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

## Tokenomics: Demurrage (Token Decay)

SKIMPY tokens are designed with a **demurrage** mechanism, meaning their balance slowly decreases over time. This feature is implemented to:

* **Discourage Hoarding:** Incentivize active use and circulation of tokens rather than holding them passively.
* **Stimulate Activity:** Encourage participation within the ecosystem by creating a cost for inaction.
* **Experimentation:** Serve as a practical experiment in dynamic tokenomics, aligning with the project's goal as a "public learning lab."

The decay is applied "just-in-time" whenever a token balance is accessed (e.g., during transfers or when checking `balanceOf`). The current decay rate is set to approximately 20% annually.

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
| Discord Webhook    | ✅ Live        |
| Burn Vault Design  | ✅ Complete    |
| Faucet Bot         | ✅ Complete    |
| GitHub Workflow    | ✅ Live        |
| Governance System  | ✅ Complete    |
| Base Mainnet Deploy| 🚀 LIVE        |
| Contract Verification| ✅ Complete  |
| Aerodrome Trading  | 🚀 LIVE        |
| CoinGecko Submission| ⏳ Under Review |
| Logo Integration   | ✅ Complete    |

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
