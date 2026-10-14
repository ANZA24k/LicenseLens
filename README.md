# LicenseLens

**Confidence before you ship.** LicenseLens is a complete GenLayer app that verifies committed software-release evidence against a locked open-source license and dependency policy.

A maintainer locks the policy, submits immutable public evidence with an exact SHA-256 commitment, and requests evaluation. GenLayer leader and validators independently retrieve and assess the evidence. Deterministic rules combine the agreed semantic checks with license allowlist and notice rules to return **COMPLIANT**, **NON_COMPLIANT**, or **INCONCLUSIVE**. Prior verdicts survive evidence revisions.

## Live project

- Website: https://licenselens.ansaf1st34.chatgpt.site
- Network: **Studionet**, chain ID **61999**, RPC `https://studio.genlayer.com/api`
- Contract: [`0x54B5ae48f7b7010E09191C330f63fC45c2A495F2`](https://explorer-studio.genlayer.com/address/0x54B5ae48f7b7010E09191C330f63fC45c2A495F2)
- Deployment: [`0x69151a8f3642e3f4988b572c6ba14074f7d883dfa81dba7195d49dabc31a93ee`](https://explorer-studio.genlayer.com/tx/0x69151a8f3642e3f4988b572c6ba14074f7d883dfa81dba7195d49dabc31a93ee)

The source readback matches `contracts/licenselens.py` byte for byte. Deployment configuration, transaction records and source SHA-256 are in [`web/src/deployment.json`](web/src/deployment.json). Finalized demo state and verification details are in [`docs/live-verification.json`](docs/live-verification.json) and [`docs/deployment.md`](docs/deployment.md).

## Reviewer walkthrough

1. Open the workspace and inspect the live finalized demo releases.
2. Compare findings, the immutable policy, dependency evidence and exact hashes.
3. Open verdict history and Explorer transaction links. Inspect the real clsx source snapshot and explicitly synthetic GPL/AGPL examples; all positive verdicts assess submitted evidence.
4. Policy/release creation requires reserved admission from the capacity administrator displayed on the site; evaluation is permissionless. To use an allocated account, connect a normal EIP-1193 wallet such as MetaMask, select Studionet, and use the forms. Every write displays its purpose and exact destination/arguments before wallet confirmation. Reads need no wallet. Connection alone never submits or signs a transaction; no Snap, token approvals, private key or seed phrase is requested.

Supported distribution modes are BINARY, SOURCE and SAAS. Supported SPDX identifiers: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, GPL-3.0-only and AGPL-3.0-only. The pilot accepts up to 12 dependencies per evidence bundle, 24,000 exact bytes and three revisions per release. See [architecture and security boundaries](docs/architecture.md) for schema, consensus and limitations.

## Reproduce the checks

Requires Python 3.12 and Node 22 or newer.

```sh
pip install -r requirements-test.txt
pytest -q tests --tb=short
genvm-lint check contracts/licenselens.py
npm ci --prefix web
npm run check --prefix web
npm test --prefix web
npm run build --prefix web
python scripts/release_check.py
node scripts/verify_live.mjs
```

Direct mode uses the official SDK with mocked web/model answers and explicitly executes captured validators. It covers integrity failures, malformed schemas/output, unsafe sources, duplicates, unauthorized writes, deterministic denial, semantic outcomes, independent disagreement and append-only revisions. Live verification uses read-only RPC calls and checks exact deployed source, finalized transaction state, demo verdicts and public evidence bytes. GitHub Actions runs the reproducible offline release gate on every push and pull request; live-network availability is verified separately rather than making CI depend on temporary Studionet uptime.

## Important boundaries

A compliant result means **the committed evidence satisfied the locked policy**. It is not legal advice, an audit, proof of inventory completeness or a universal compliance guarantee. Evidence hashes establish integrity rather than truth. Prompt injection, model uncertainty, missing dependencies and consensus disagreement remain risks. Network non-consensus writes no verdict; the application uses INCONCLUSIVE for independently agreed uncertainty or retrieval/integrity failure. Studionet can reset. This admitted demonstration reserves global capacity per account; unused quota can be reassigned, used immutable slots cannot be reclaimed. It has no production billing and holds no funds.

See [steward remediation and verification](docs/steward-response.md) for the V2 changes, full copyleft documents, recovery rules and live failure/limit evidence. Legacy deployments remain documented separately.

MIT licensed (copyleft demonstration source files carry their own explicit SPDX licenses). No private credentials are required in this repository.
