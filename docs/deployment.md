# Verified LicenseLens V2 deployment

Verified at 2026-10-14T13:34:23.619Z. Deployed through Studio using its funded built-in account in **Normal (Full Consensus)** mode. Exact RPC source readback matches `contracts/licenselens.py`; SHA-256: `07dc75b86ffe78f00064d0848b44a48229695bda4f91e4c68283cfaa224444a3`.

Contract: [0x54B5ae48f7b7010E09191C330f63fC45c2A495F2](https://explorer-studio.genlayer.com/address/0x54B5ae48f7b7010E09191C330f63fC45c2A495F2)

Website: https://licenselens.ansaf1st34.chatgpt.site · published version 4 · hosting status **succeeded**. Source inputs were compared byte for byte with `web/src`. The original website URL and background design are retained.

## Finalized results

| Release | Verdict | Scope |
| --- | --- | --- |
| clsx-2.1.1-source | COMPLIANT | Real clsx 2.1.1 runtime source snapshot |
| gpl-complete | COMPLIANT | Clearly synthetic evidence example |
| agpl-complete | COMPLIANT | Clearly synthetic evidence example |
| revision-boundary | INCONCLUSIVE | Intentional hash mismatches; three immutable revisions |
| demo-bad | NON_COMPLIANT | Clearly synthetic evidence example |

All positive results assess submitted evidence under the locked policy; they do not authenticate the entire released software. Full GPL and AGPL terms are fetched from the pinned SPDX catalog without truncation. Corresponding source/build instructions are fetched; the AGPL source implements a prominent homepage source link. The real clsx assessment corroborates runtime inventory and license against the upstream manifest, source and complete MIT notice at one commit. Published npm archives, built binaries and development tooling are outside that SOURCE policy.

## Transaction evidence

All 23 recorded transactions are FINALIZED. 22 have MAJORITY_AGREE. The initial missing-notice review encountered a temporary model failure with MAJORITY_DISAGREE, recorded no verdict and consumed no revision. A retry of the identical hash/revision reached MAJORITY_AGREE and NON_COMPLIANT. The recovered review is by a different built-in account than the policy owner. This is recovery from failed execution, not repeat adjudication of a recorded semantic outcome. `transient-recovery.json` records genuine before/after finalized state.

| Action | Transaction | Execution / consensus |
| --- | --- | --- |
| Deploy V2 | [0x69151a8f36…](https://explorer-studio.genlayer.com/tx/0x69151a8f3642e3f4988b572c6ba14074f7d883dfa81dba7195d49dabc31a93ee) | SUCCESS / MAJORITY_AGREE |
| Lock source policy | [0xb8cb8db277…](https://explorer-studio.genlayer.com/tx/0xb8cb8db2773734f547cf289116c132bc70d038e02ead1cc299f007c91bef566b) | SUCCESS / MAJORITY_AGREE |
| Submit real clsx source | [0xb8e64a2248…](https://explorer-studio.genlayer.com/tx/0xb8e64a2248c381d7cf39c74996441befddae49a13bf6e172c63b804936a43008) | SUCCESS / MAJORITY_AGREE |
| Evaluate real clsx source | [0xca39c7350c…](https://explorer-studio.genlayer.com/tx/0xca39c7350cea991021d71757edefd82f63b53132bc7fbd4b436bff1dbcbbd977) | SUCCESS / MAJORITY_AGREE |
| Submit complete GPL evidence | [0x535d230375…](https://explorer-studio.genlayer.com/tx/0x535d230375c9bac16933794a46e2379f40544e6092550cb132cc05d4b3981edd) | SUCCESS / MAJORITY_AGREE |
| Evaluate complete GPL evidence | [0xa40fed70f5…](https://explorer-studio.genlayer.com/tx/0xa40fed70f5c5cf272350a5edb9dc33dd39b5272a7f1e39d96ae85b748bc83b5a) | SUCCESS / MAJORITY_AGREE |
| Lock AGPL network policy | [0x517b1feaa2…](https://explorer-studio.genlayer.com/tx/0x517b1feaa2315da95f82462541371b8e22e76cf5ed7a14554866e5708151a138) | SUCCESS / MAJORITY_AGREE |
| Submit complete AGPL evidence | [0x4e3c2f129a…](https://explorer-studio.genlayer.com/tx/0x4e3c2f129a834fc299660b51e0d3c7f9b372c4fa64dfe2f5880cbd865b2d9f02) | SUCCESS / MAJORITY_AGREE |
| Evaluate complete AGPL evidence | [0x84fc773ac3…](https://explorer-studio.genlayer.com/tx/0x84fc773ac3cfbce0bf917ad826cbdd8993d3d100cd4a1728c572496003952bf4) | SUCCESS / MAJORITY_AGREE |
| Duplicate release rejected | [0x6a00c9e6ca…](https://explorer-studio.genlayer.com/tx/0x6a00c9e6ca555852cb4f990bd001e402e33fd00d3d338cf8d38f0df3eb1cbd82) | ERROR / MAJORITY_AGREE |
| Unauthorized release rejected | [0x04725c0ce5…](https://explorer-studio.genlayer.com/tx/0x04725c0ce5a8492da5b02ac476d2f83c7fd93dfde1ed0e32e368d09850df05f7) | ERROR / MAJORITY_AGREE |
| Global reservation overflow rejected | [0x2935d50a8b…](https://explorer-studio.genlayer.com/tx/0x2935d50a8b556443b488b62ae6ec05f356e56905617c4444f80cbff01d859d48) | ERROR / MAJORITY_AGREE |
| Submit revision boundary fixture | [0xe9a23b0853…](https://explorer-studio.genlayer.com/tx/0xe9a23b085300b0e0ee56ddff178962b189fad98e2728f4607e7fd974d8f9e693) | SUCCESS / MAJORITY_AGREE |
| Reserve separate actor capacity | [0x49c254da00…](https://explorer-studio.genlayer.com/tx/0x49c254da0087a3e55bfe4c929b5e55d928d70c60f1db29accdf86332c0842f59) | SUCCESS / MAJORITY_AGREE |
| Review revision one | [0x62d07c1eca…](https://explorer-studio.genlayer.com/tx/0x62d07c1ecaaebf44c6c22bebf0f9a244f059fb7e299d74fba884d4454b4c4365) | SUCCESS / MAJORITY_AGREE |
| Commit revision two | [0xa50725c9e1…](https://explorer-studio.genlayer.com/tx/0xa50725c9e16115e4dd93e6082aaae094229485547f951303eecf7e13895de573) | SUCCESS / MAJORITY_AGREE |
| Review revision two | [0x161b1fb2a0…](https://explorer-studio.genlayer.com/tx/0x161b1fb2a07c6f8f9fae85b7a28462440fb0b7c13505ac7b48e9fa62bc0fe766) | SUCCESS / MAJORITY_AGREE |
| Commit revision three | [0x4a64a0b542…](https://explorer-studio.genlayer.com/tx/0x4a64a0b542d0e9449e2b0edfa1fbb59f3e97ae57c6c44076ca0932de854cb260) | SUCCESS / MAJORITY_AGREE |
| Review revision three | [0x8c92cb3586…](https://explorer-studio.genlayer.com/tx/0x8c92cb3586783b75a7fbda963d80506b62f2a1a74fe653e751f3e1be6554253d) | SUCCESS / MAJORITY_AGREE |
| Fourth revision rejected | [0x2fe871aef5…](https://explorer-studio.genlayer.com/tx/0x2fe871aef52b398157c5a186a095cc24e8e8c46c87afb04813de5da43f4b082b) | ERROR / MAJORITY_AGREE |
| Submit missing-notice comparison | [0xde9dee8f4c…](https://explorer-studio.genlayer.com/tx/0xde9dee8f4c53fb6630681ea0808331fb70a3d6095a440c45a5bb5fd6e3ad2fcf) | SUCCESS / MAJORITY_AGREE |
| Temporary model failure / no revision consumed | [0x80c52b3695…](https://explorer-studio.genlayer.com/tx/0x80c52b369598bc7393c91cc7fcb0fae052cac85d2b45341c4ceb42c1f3d8ec97) | ERROR / MAJORITY_DISAGREE |
| Separate-account recovered missing-notice review | [0x5bc3ee0904…](https://explorer-studio.genlayer.com/tx/0x5bc3ee09043ca6c6734d082ca4e25c80941db5d812971d7892dbe0ad055795ec) | SUCCESS / MAJORITY_AGREE |

`live-verification.json` records finalized policies/releases, source match, consensus vote maps, execution statuses and checks of 13 immutable public commitments. The five genuine finalized failure receipts were passed through the production frontend verification function: each displays the contract error, performs no completion-state read and never reports success. A real successful submission is confirmed through a finalized contract read. Direct Mode tests also check failure, missing-success evidence, state mismatches and cancellation of validators after quorum.

## Capacity and revision boundaries

The deployment administrator reserves slots per admitted account. Initial administrator allowance is 4 policies/8 releases; the separate actor has 1/1 reserved slots. Unadmitted users cannot create policies; allocations cannot exceed global 128/128 and one account cannot consume another account’s reservation. The live attempt to allocate 125 extra policy slots fails because the existing 4-slot reservation would exceed 128. Unit tests additionally fill all 128 actual policies and releases and reject overflow, test account quota exhaustion/isolation, admin-only management and reassignment of unused slots. Immutable used slots cannot be reclaimed; global exhaustion requires a newly identified deployment.

The live boundary release records three distinct deliberately incorrect hashes as INCONCLUSIVE/HASH_MISMATCH without model calls. A fourth revision fails and leaves revision 3 and all three history entries intact. Temporary HTTP/model failures roll back without consuming history/revision; semantic INCONCLUSIVE and substantive outcomes remain terminal for the revision. Normal execution costs still apply to retries.

## Release gate and limits

67 GenLayer Direct Mode tests and 22 frontend tests pass. GenVM lint/SDK validation, TypeScript, production build, production dependency audit (zero vulnerabilities), secret scan and unfinished-work scan pass. GitHub Actions runs the complete offline release gate on main; live-network verification is kept separate to avoid dependence on temporary StudioNet uptime.

The actual contract and deployment transaction explorer pages were opened successfully in the Cloud Browser. The website’s generated transaction links use the explorer’s observed canonical `/tx/` route. Genuine deployment proof is in `studionet-v2-proof.jpg`.

Sites confirms successful public publication. Supported Sites preview browser tooling is unavailable, so visual website browser QA and real MetaMask signing are not claimed. EIP-1193 account-only connection has a provider-spy test, production transaction verification is exercised against genuine chain receipts, and all live writes use Studio’s built-in accounts. Studionet can reset; no legal or production-availability guarantee is made.

Legacy pilot evidence is preserved in `legacy-deployment.json`, `legacy-deployment.md` and `legacy-live-verification.json`. The legacy address does not contain V2 changes.
