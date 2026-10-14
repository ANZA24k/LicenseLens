# Steward remediation — LicenseLens V2

The website keeps its original URL and design and now targets the corrected V2 Intelligent Contract. The legacy address remains documented; it is not represented as containing these changes.

| Request | Implemented change | Verification |
| --- | --- | --- |
| Complete GPL/AGPL terms | Immutable, exact SHA-256 document references; pinned authoritative SPDX full texts, no truncation; required corresponding-source reference; 50 KB/document, 160 KB aggregate external bytes | Direct Mode full GPL/AGPL, missing refs, unmet/unknown source obligations, excerpt, changed hash, oversized and malformed UTF-8 tests; live complete GPL and AGPL reviews |
| Evidence-only meaning | Structured scope SUBMITTED_EVIDENCE_ONLY, “Evidence compliant” label, visible scope and boundary explanations | Real clsx 2.1.1 source snapshot assessed with independently fetched upstream manifest, source and full MIT notice |
| Finalized write errors | Require accepting consensus and leader GenVM SUCCESS, display rollback/runtime errors, verify exact expected finalized policy/release/history change | Frontend success, unauthorized, duplicate, runtime-error and missing-state tests; production helper exercised with genuine successful and failed StudioNet receipts |
| Global capacity exhaustion | Administrator-reserved per-account quotas; no unrestricted policy creation; unused allocations reassignable; used immutable slots retained | Tests fill all 128 policy/release slots and reject overflow, test account isolation/reassignment; live global reservation overflow rejected |
| Transient failures/revision allowance | Agreed retrieval exceptions, HTTP 429/5xx and invalid model output revert without history/revision consumption; retry same immutable commitment only | Tests show retry recovery without consumed revision and prohibit repeat adjudication after semantic UNKNOWN; live temporary model failure and same-hash recovery with no revision consumed, plus three append-only integrity verdicts and rejection of fourth revision |
| Expanded demonstration | Real upstream source snapshot, full supported copyleft examples, missing-notice counterexample, separate-account review and finalized failures | Exact transactions, votes, source readback, committed-document hashes and finalized state in live-verification.json and deployment.md |

## Reviewer path

Open https://licenselens.ansaf1st34.chatgpt.site. Inspect `clsx-2.1.1-source`, `gpl-complete`, `agpl-complete`, `demo-bad` and `revision-boundary`. Compare policy, findings, evidence SHA-256, committed document links and verdict history. Open the deployment/transaction explorer links and compare with `web/src/deployment.json`. No wallet is needed for review. The capacity section displays the administrator and reserved totals; policy/release creation requires allocation, while anyone can evaluate a new revision.

Run the README release commands to reproduce 67 Direct Mode contract tests, 22 frontend tests, GenVM lint/SDK validation, TypeScript and production build. `node scripts/verify_live.mjs` verifies real execution receipts and finalized state; it issues no writes or wallet requests.

## Limits retained deliberately

COMPLIANT means the submitted evidence satisfies the locked policy. Commit-pinned upstream source/manifest/notice documents strengthen provenance but do not authenticate a published binary or prove arbitrary inventory completeness. The real clsx demonstration assesses the runtime source snapshot; development tooling and npm/binary artifacts are outside its locked SOURCE policy. GPL/AGPL demonstrations are clearly synthetic complete standalone examples. Full standard terms are inspected, but sophisticated multi-file source/build coverage requires a bounded adapter or additional workflow; one file is insufficient for arbitrary software.

Admission is an explicit demonstration boundary, not production-scale anti-spam or an unlimited public service. The administrator can reclaim unused quotas, never erase used history; exhausted immutable capacity requires a new identified deployment. Loss/unavailability of the administrator can prevent admission. Transient retries incur normal execution costs. Successful semantic judgments, including INCONCLUSIVE, cannot be rerun on the same revision; only changed commitments can advance within the three-revision limit.

Visual website browser QA and real MetaMask signing are not exercised in this environment. EIP-1193 account-only connection is tested, and the exact production transaction-verification helper is tested against genuine finalized execution errors and successful finalized state. Studio built-in accounts perform the genuine live writes. Hosting publication is verified by Sites; website HTTP inspection may be restricted by Cloudflare; actual contract and deployment explorer pages were verified in the Cloud Browser. These checks do not guarantee legal correctness or future StudioNet availability.

## Suggested steward reply

The requested fixes are implemented and deployed in LicenseLens V2. Full GPL/AGPL terms use authoritative commit-pinned SPDX documents and exact SHA-256 commitments, with corresponding-source checks. The real clsx source assessment corroborates inventory/license evidence from its upstream commit. COMPLIANT is explicitly limited to submitted evidence. Writes require accepting consensus, GenVM SUCCESS and matching finalized state. Reserved admission prevents participants from exhausting other accounts’ capacity. Temporary failures consume no revision; a genuine live failure recovered on the identical hash/revision. Three immutable revisions and rejection of a fourth are demonstrated. 67 contract and 22 frontend tests pass, alongside GenVM lint and production checks. The unchanged website now points to V2; deployment, transactions, live state, tests and limits are documented in docs/deployment.md and docs/live-verification.json.
