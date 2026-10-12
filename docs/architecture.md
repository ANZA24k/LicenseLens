# LicenseLens architecture and review boundaries

## Why GenLayer

License declarations alone do not establish that the supplied license text matches the declaration, that shipped notices preserve the relevant terms, or that distribution obligations are supported by evidence. LicenseLens uses independent GenLayer web retrieval and semantic assessment for these questions. Ordinary Python validates commitments, schemas, identifiers, ownership and lifecycle rules and derives the final verdict.

## Workflow

1. `create_policy(policy_id, policy_json)` permanently locks an allowlist, distribution mode, notice requirement and bounded obligation requirements. There is no policy update or delete method.
2. Only that policy owner can `submit_release(policy_id, release_id, commit, url, evidence_sha256)`. Release ID, policy and release commit stay fixed. The evidence URL must point to a raw GitHub JSON file at a full immutable 40-character commit.
3. Any account can `evaluate(release_id)` once per revision. Each leader and validator retrieves the original public URL and independently checks status, size, exact SHA-256, UTF-8, schema and release binding. Each then calls its own model to assess inventory evidence, declared-license/text consistency and distribution obligations.
4. A custom `gl.vm.run_nondet_unsafe` validator compares the entire normalized decision/finding result against its independently generated result. It rejects leader errors and disagreement. The network handles rotations and consensus; a transaction that cannot reach consensus does not write a verdict.
5. After review, the owner can `revise_evidence` with a previously unreviewed hash, at most twice. Earlier verdicts, hashes, URLs and reviewer addresses remain append-only. A new review is required; the release commit and policy cannot change.

A confirmed deterministic violation or independently agreed semantic violation gives **NON_COMPLIANT**. Otherwise incomplete inventory or any unknown assessment gives **INCONCLUSIVE**. Only a complete inventory declaration and all satisfied checks gives **COMPLIANT**. Fetch, hash, size, parsing or model-output failures agree on a bounded **INCONCLUSIVE** error code. This application verdict differs from protocol non-consensus: no consensus means no state change.

## Evidence format

`evidence/compliant.json` is the exact v1 schema example. Every object has an exact field set. JSON duplicate keys, duplicated package/version identities, unknown licenses, mismatched release bindings, non-UTF-8 and invalid types are rejected. Package identity is `name@version`; rows are sorted before comparison. Seven SPDX identifiers are supported; compound SPDX expressions, exceptions, custom licenses and empty inventories are intentionally unsupported in this pilot. Unsupported inputs cannot be silently approved.

Each evidence bundle includes inventory method/coverage, declared licenses, actual license text, retained notice text, integration description and obligation evidence. SHA-256 is over **exact file bytes**, including newline and formatting. The policy hash is over canonical sorted compact ASCII JSON. These hashes use different conventions intentionally.

## Defensive controls

- Exact HTTPS host allowlist: `raw.githubusercontent.com`, immutable commits, safe path alphabet. No queries, credentials, ports, encoded characters, dot path segments, arbitrary IP/DNS hosts or evidence-supplied follow-up URLs. Raw GitHub content is requested directly; no arbitrary redirect targets are accepted as inputs. The upstream fetcher controls redirect handling; every returned byte must still match the commitment.
- 24,000-byte evidence limit checked before decoding or prompt construction; 12 dependencies, bounded field text and 8,000-byte normalized model output. These are application consumption limits, not streaming network-download limits.
- Untrusted evidence is explicitly marked as data, with instructions to ignore embedded commands. Structured enum-only output is independently reproduced; forbidden licenses and empty required notices are always enforced deterministically. This reduces injection risk but cannot prove immunity to model manipulation.
- No evaluation repeats on an already reviewed revision. No deletion or rollback endpoint, unauthorized evidence revision, policy mutation or attached-value workflow.
- Pilot storage caps: 128 policies and 128 releases globally; three revisions per release. Permissionless policy creation and first evaluation allow capacity exhaustion and reviewer races. This small unpermissioned demo is not a production anti-spam design.
- Public data only. Never put credentials, private source or personal data into evidence. No funds or tokens are held or transferred by contract logic.

## Website

The responsive TypeScript/Vite portal uses `genlayer-js` and explicit `TransactionHashVariant.LATEST_FINAL` reads. Results are read live; read failures are displayed, never replaced with synthetic results. Users can inspect policy hashes, evidence, findings, history, reviewer actors, deployment and transaction links. Evidence inspection recomputes SHA-256 in the browser before displaying dependency data. All untrusted text is HTML-escaped.

EIP-1193 connection invokes only `eth_requestAccounts`. Connection never signs or creates a transaction. Policy, submission, revision and evaluation writes require an explicit action and a review dialog showing network, destination, account, method and arguments before wallet confirmation. Writes attach zero value, request full consensus and wait for finalization before refreshing. No Snap, seed phrase, private key, token approval or permission request is implemented. A wallet must select Studionet before writing; account and chain changes invalidate pending confirmation.

## Verification limits

Direct-mode tests execute the real contract using the official GenLayer SDK with mocked web/model answers and captured validator functions. They exercise application logic and independent-validator rejection, not a real multi-node consensus simulator. The separately recorded Studio lifecycle uses full consensus with real web/model calls. Neither unit tests nor one demo proves legal correctness, inventory authenticity, model reliability or exhaustive security. A positive verdict is an assessment of submitted evidence under the locked policy, not legal advice, a security audit or guaranteed license compliance. Studionet is temporary and may reset.

## Official API references checked

- https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle
- https://docs.genlayer.com/developers/intelligent-contracts/features/web-access
- https://docs.genlayer.com/api-references/genlayer-test/direct
- https://docs.genlayer.com/api-references/genlayer-linter
- https://docs.genlayer.com/developers/decentralized-applications/reading-data
- https://docs.genlayer.com/developers/networks

The deployed contract pins the Studio-compatible SDK dependency and was checked with GenVM v0.2.16. Installed SDK source was inspected to confirm `gl.message.sender_address`, web `Response.status` and JSON model-return types.
