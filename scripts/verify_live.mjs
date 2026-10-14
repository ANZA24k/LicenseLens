// Read-only release gate: exact source, consensus execution, finalized state and public commitments.
import {createClient} from '../web/node_modules/genlayer-js/dist/index.js';
import {studionet} from '../web/node_modules/genlayer-js/dist/chains/index.js';
import {TransactionHashVariant} from '../web/node_modules/genlayer-js/dist/types/index.js';
import {assertExecutionSuccess,verifyFinalizedWrite} from '../web/src/write-verification.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const d=JSON.parse(readFileSync(new URL('../web/src/deployment.json',import.meta.url),'utf8'));
const c=createClient({chain:studionet,endpoint:d.rpc});
if(await c.getContractCode(d.address)!==readFileSync(new URL('../contracts/licenselens.py',import.meta.url),'utf8'))throw Error('Deployed source differs from repository');
const read=async(method,args=[])=>JSON.parse(await c.readContract({address:d.address,functionName:method,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL}));
const index=await read('get_index');
const [policies,releases,capacity]=await Promise.all([Promise.all(index.policies.map(id=>read('get_policy',[id]))),Promise.all(index.releases.map(id=>read('get_release',[id]))),read('get_capacity',['0x0000000000000000000000000000000000000000'])]);
const records=[{hash:d.deploymentTransaction,label:'Deploy V2',expectedExecution:'SUCCESS'},...d.transactions];
const transactions=[];const frontendVerification=[];
for(const entry of records){
 const t=await c.waitForTransactionReceipt({hash:entry.hash,status:'FINALIZED',retries:40,interval:3000});const execution=t.consensus_data?.leader_receipt?.filter(r=>r.mode==='leader').at(-1);
 const status=String(t.statusName||t.status_name||'').toUpperCase();
 if(status!=='FINALIZED'||t.leader_only||t.result_name!==(entry.expectedConsensus||'MAJORITY_AGREE'))throw Error('No finalized full consensus: '+entry.hash);
 if(entry.expectedExecution==='SUCCESS')assertExecutionSuccess(t);
 else {
  let reads=0,displayError='';
  try{await verifyFinalizedWrite({client:c,hash:entry.hash,method:'submit_release',args:[],account:capacity.administrator,read:async()=>{reads++;return {}}});throw Error('Failure reported as success');}catch(error){displayError=String(error);if(!displayError.includes(entry.expectedError)||reads!==0)throw error;}
  frontendVerification.push({hash:entry.hash,label:entry.label,displayError,finalizedReads:reads,reportedCompletion:false});
 }
 transactions.push({hash:entry.hash,label:entry.label,status,consensus_result:t.result_name,execution_result:execution?.execution_result,error:execution?.genvm_result?.error_description||execution?.result?.payload?.readable||execution?.genvm_result?.stderr,leader_only:t.leader_only,rotations:t.rotation_count,votes:t.consensus_data?.votes});
}
const fresh=await read('get_index');releases.splice(0,releases.length,...await Promise.all(fresh.releases.map(id=>read('get_release',[id]))));
for(const [id,expected] of Object.entries(d.expectedVerdicts)){if(releases.find(r=>r.release_id===id)?.history.at(-1)?.result.verdict!==expected)throw Error('Unexpected verdict: '+id);}
const boundary=releases.find(r=>r.release_id==='revision-boundary');if(boundary?.revision!==3||boundary.history.length!==3||boundary.history.some(r=>r.result.error!=='HASH_MISMATCH'))throw Error('Revision boundary/history incorrect');
if(releases.some(r=>r.release_id==='unauthorized-attempt')||releases.length!==5)throw Error('Rejected write mutated release index');
const documents=new Map();
async function committed(ref){if(documents.has(ref.url)){if(documents.get(ref.url).hash!==ref.sha256)throw Error('Conflicting document commitment');return documents.get(ref.url).bytes;}const response=await fetch(ref.url,{redirect:'error'});if(!response.ok)throw Error('Public evidence HTTP '+response.status);const bytes=Buffer.from(await response.arrayBuffer());const hash=createHash('sha256').update(bytes).digest('hex');if(hash!==ref.sha256)throw Error('Public commitment mismatch: '+ref.url);documents.set(ref.url,{hash,bytes});return bytes;}
for(const r of releases){if(r.release_id==='revision-boundary')continue;const b=JSON.parse((await committed(r)).toString('utf8'));for(const ref of b.source_refs||[])await committed(ref);for(const dep of b.dependencies)for(const key of ['license_ref','source_ref'])if(dep[key])await committed(dep[key]);}
const real=releases.find(r=>r.release_id==='clsx-2.1.1-source');const tx=d.transactions.find(t=>t.label==='Submit real clsx source');
await verifyFinalizedWrite({client:c,hash:tx.hash,method:'submit_release',args:[real.policy_id,real.release_id,real.commit,real.url,real.sha256],account:real.owner,read});frontendVerification.push({hash:tx.hash,label:'Real successful submission',expectedFinalizedStateVerified:true});
const recoveryPath=new URL('../docs/transient-recovery.json',import.meta.url);const recovery=JSON.parse(readFileSync(recoveryPath));recovery.after=releases.find(r=>r.release_id==='demo-bad');recovery.recoveryTransaction=d.transactions.at(-1).hash;
if(recovery.after.revision!==recovery.before.revision||recovery.after.sha256!==recovery.before.sha256||recovery.after.history.length!==1)throw Error('Recovery consumed revision or changed evidence');writeFileSync(recoveryPath,JSON.stringify(recovery,null,2)+'\n');
const result={verified_at:new Date().toISOString(),source_match:true,source_sha256:d.sourceSha256,network:d.network,address:d.address,policies,releases,capacity,transactions,frontendVerification,publicCommitmentsVerified:documents.size};
writeFileSync(new URL('../docs/live-verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({source_match:true,transactions:transactions.length,publicCommitments:documents.size,frontendVerification,releases:releases.map(r=>({id:r.release_id,verdict:r.history.at(-1)?.result.verdict,revision:r.revision}))},null,2));
