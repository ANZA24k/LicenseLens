// Finality alone is not success. Fail closed on missing execution evidence.
export function assertExecutionSuccess(receipt) {
 const leaders = receipt?.consensus_data?.leader_receipt;
 const execution = Array.isArray(leaders) ? leaders.filter(r=>r.mode==='leader').at(-1) : (leaders?.mode==='leader'?leaders:undefined);
 if(execution?.execution_result !== 'SUCCESS') {
  const error = execution?.genvm_result;
  const detail = error?.error_description || error?.stderr || execution?.result?.payload?.readable || execution?.result?.payload || 'GenVM execution was unsuccessful or could not be verified.';
  throw new Error((typeof detail==='object'?JSON.stringify(detail):String(detail)).slice(0,1500));
 }
 if(receipt.result_name!=='MAJORITY_AGREE')throw Error('Transaction finalized without accepting consensus; no completion is confirmed.');
}
export async function verifyFinalizedWrite({client,hash,method,args,account,before,read}) {
 const receipt=await client.waitForTransactionReceipt({hash,status:'FINALIZED',retries:60,interval:5000});
 assertExecutionSuccess(receipt);
 if(method==='create_policy') {
  const state=await read('get_policy',[args[0]]);const requested=JSON.parse(args[1]);
  const expected={...requested,allowed_licenses:[...requested.allowed_licenses].sort()};
  if(state.id!==args[0]||state.owner.toLowerCase()!==account.toLowerCase()||Object.keys(expected).some(k=>JSON.stringify(state.policy[k])!==JSON.stringify(expected[k])))throw Error('Finalized policy state does not match the requested write.');
  return state;
 }
 const state=await read('get_release',[method==='submit_release'?args[1]:args[0]]);
 if(method==='submit_release') {
  if(state.release_id!==args[1]||state.policy_id!==args[0]||state.commit!==args[2]||state.url!==args[3]||state.sha256!==args[4]||state.owner.toLowerCase()!==account.toLowerCase())throw Error('Finalized release state does not match the requested submission.');
 } else if(method==='revise_evidence') {
  if(!before||state.revision!==before.revision+1||state.url!==args[1]||state.sha256!==args[2]||JSON.stringify(state.history)!==JSON.stringify(before.history))throw Error('Finalized evidence revision did not match the expected append-only change.');
 } else if(method==='evaluate') {
  const review=state.history.at(-1);
  if(!before||state.history.length!==before.history.length+1||review?.revision!==before.revision||review.sha256!==before.sha256||review.reviewer.toLowerCase()!==account.toLowerCase())throw Error('No matching finalized review was recorded.');
 } else throw Error('Unsupported write verification method.');
 return state;
}
