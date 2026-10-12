// Read-only deployment and demo verification. Never accesses wallet credentials.
import {createClient} from '../web/node_modules/genlayer-js/dist/index.js';
import {studionet} from '../web/node_modules/genlayer-js/dist/chains/index.js';
import {TransactionHashVariant} from '../web/node_modules/genlayer-js/dist/types/index.js';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const d=JSON.parse(readFileSync(new URL('../web/src/deployment.json',import.meta.url),'utf8'));
const c=createClient({chain:studionet,endpoint:d.rpc});
const source=await c.getContractCode(d.address);
if(source!==readFileSync(new URL('../contracts/licenselens.py',import.meta.url),'utf8'))throw Error('Deployed source differs from repository source');
const read=async(method,args=[])=>JSON.parse(await c.readContract({address:d.address,functionName:method,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL}));
const index=await read('get_index');
const [policies,releases,transactions]=await Promise.all([Promise.all(index.policies.map(id=>read('get_policy',[id]))),Promise.all(index.releases.map(id=>read('get_release',[id]))),Promise.all([d.deploymentTransaction,...d.transactions.map(t=>t.hash)].map(hash=>c.getTransaction({hash})))]);
const summary=transactions.map(t=>({hash:t.hash,status:t.statusName,consensus_result:t.result_name,validator_execution_results:t.consensus_data?.validators?.map(v=>v.execution_result),leader_only:t.leader_only,rotations:t.rotation_count,votes:t.consensus_data?.votes}));
for(const t of summary)if(t.status!=='FINALIZED'||t.leader_only||t.consensus_result!=='MAJORITY_AGREE')throw Error('Transaction not finalized: '+t.hash);
const good=releases.find(r=>r.release_id==='demo-good');const bad=releases.find(r=>r.release_id==='demo-bad');
if(good?.history.at(-1)?.result.verdict!=='COMPLIANT'||bad?.history.at(-1)?.result.verdict!=='NON_COMPLIANT')throw Error('Demo verdicts not as documented');
for(const r of releases){const response=await fetch(r.url,{redirect:'error'});if(!response.ok)throw Error('Evidence unavailable');const bytes=Buffer.from(await response.arrayBuffer());if(createHash('sha256').update(bytes).digest('hex')!==r.sha256)throw Error('Public evidence mismatch');}
const result={verified_at:new Date().toISOString(),source_match:true,source_sha256:d.sourceSha256,network:d.network,address:d.address,policies,releases,transactions:summary};
writeFileSync(new URL('../docs/live-verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({source_match:true,transactions:summary,releases:releases.map(r=>({id:r.release_id,verdict:r.history.at(-1)?.result.verdict,reviewer:r.history.at(-1)?.reviewer}))},null,2));
