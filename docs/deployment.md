# Verified Studionet deployment

Verified at 2026-10-12T11:58:37.714Z. Studio execution mode: **Normal (Full Consensus)**. All six lifecycle transactions are FINALIZED with MAJORITY_AGREE; this is not leader-only execution.

Contract: [0x5c855B05FB2A843485CC54A3Ed8A407d6Ca4d074](https://explorer-studio.genlayer.com/address/0x5c855B05FB2A843485CC54A3Ed8A407d6Ca4d074)

Exact source SHA-256: `b2f21eb84f6e17cca16ed04d4e1dd227e88aa00c4b5e74c6c3710f1434347934`. RPC source readback matched repository bytes.

## Transactions

| Action | Transaction | Outcome |
| --- | --- | --- |
| Deployment | [0xad62309d1a7f24cd3568ab2a84251043cdb28c20147a0b5aa9b2bd9b6cf84809](https://explorer-studio.genlayer.com/transactions/0xad62309d1a7f24cd3568ab2a84251043cdb28c20147a0b5aa9b2bd9b6cf84809) | FINALIZED / MAJORITY_AGREE |
| Lock policy | [0xb5cca13bac43c2c5ed1e5a4e3440598154b81b717926f9ee72c008e042aa76ed](https://explorer-studio.genlayer.com/transactions/0xb5cca13bac43c2c5ed1e5a4e3440598154b81b717926f9ee72c008e042aa76ed) | FINALIZED / MAJORITY_AGREE |
| Submit compliant | [0xdb94ac66b605d2885d75bc308ab4743c19b257bc2aca925718c5e1f5bed38864](https://explorer-studio.genlayer.com/transactions/0xdb94ac66b605d2885d75bc308ab4743c19b257bc2aca925718c5e1f5bed38864) | FINALIZED / MAJORITY_AGREE |
| Review compliant | [0x5fd917699ebb74546f356f0b52c0c7da9d0f3718d90b9251a646f8a5a162d7b0](https://explorer-studio.genlayer.com/transactions/0x5fd917699ebb74546f356f0b52c0c7da9d0f3718d90b9251a646f8a5a162d7b0) | FINALIZED / MAJORITY_AGREE |
| Submit non-compliant | [0xdfdd8e6ecda4eb6b4206106f6191e87990cc2e05de786736e7aa35657efbbb52](https://explorer-studio.genlayer.com/transactions/0xdfdd8e6ecda4eb6b4206106f6191e87990cc2e05de786736e7aa35657efbbb52) | FINALIZED / MAJORITY_AGREE |
| Independent non-compliant review | [0x18e8d8f639452d0c9962f2754f4ff597548c038280f751a18b2b6453892556f4](https://explorer-studio.genlayer.com/transactions/0x18e8d8f639452d0c9962f2754f4ff597548c038280f751a18b2b6453892556f4) | FINALIZED / MAJORITY_AGREE |

## Synthetic pilot results

| Release | Verdict | Reviewer |
| --- | --- | --- |
| demo-good | COMPLIANT | `0xFE858F4f7b3F0Fff7947F40f83F0CF3b626fF580` |
| demo-bad | NON_COMPLIANT | `0x9e3CCf51f19057182D8cdbC16B6B87b4BfCEFF78` |

The compliant review required one leader rotation after disagreement. The final round reached majority agreement. The non-compliant review had three agreeing and two disagreeing validator votes; the stored result is NON_COMPLIANT. Individual model reasoning is not stored by this contract. The serialized public verification record includes the final vote map, rotation count, policies and review results.

The non-compliant fixture omits shipped license/copyright notices. Its review is performed by a different built-in Studio account than the policy owner. The compliant fixture is a single-dependency illustrative binary release with retained MIT notice evidence. Both are explicitly synthetic; neither asserts an audit of a real software distribution.

Public immutable fixture commit: `6ddedc0616503ef6ab6cf400307eb1f4eeb51e73`. The release commit bound inside each fixture is `13329682578682e0932a166f56329e044a6c5abd`, an actual repository commit used only as a synthetic release identity.

## Validation

45 direct-mode contract/security tests and 7 frontend safety tests. GenVM lint and SDK validation, TypeScript checks, production build and credential/unfinished-work scan are part of the release gate. Dependency audit reports zero known vulnerabilities after patching the affected Vite/viem dependencies. Live finalized reads and evidence SHA-256 checks pass. GitHub Actions runs the offline gate.

Visual browser QA of the Sites website is unavailable in this environment because its supported preview browser skill is not installed. The website is validated with TypeScript, safety tests, production build, public HTTP asset checks and live RPC reads. Real MetaMask signing is not exercised in this cloud browser; EIP-1193 account-only connection is tested with a provider spy, and Studio built-in-account writes demonstrate the contract lifecycle.
