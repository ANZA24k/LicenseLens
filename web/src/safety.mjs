export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeEvidenceURL(url) {
 return /^https:\/\/raw\.githubusercontent\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+\/[0-9a-f]{40}\/[A-Za-z0-9_./-]+\.json$/.test(url) && !url.slice(34).split('/').some(p => !p || p==='.' || p==='..') && url.length<=300;
}
export async function connectWallet(provider) {
 if(!provider) throw new Error('Install MetaMask or another EIP-1193 wallet to use write actions. Reads do not need a wallet.');
 const accounts = await provider.request({method:'eth_requestAccounts'});
 if(!/^0x[0-9a-fA-F]{40}$/.test(accounts[0] || '')) throw new Error('Wallet returned no valid account.');
 return accounts[0];
}
export const verdictLabel = v => ({COMPLIANT:'Compliant',NON_COMPLIANT:'Non-compliant',INCONCLUSIVE:'Inconclusive'}[v] || 'Awaiting review');
export function validateCommitments(commit, url, hash) {
 if(!/^[0-9a-f]{40}$/.test(commit)) throw new Error('Use a full lowercase 40-character Git commit.');
 if(!safeEvidenceURL(url)) throw new Error('Use a raw GitHub JSON URL pinned to a full Git commit.');
 if(!/^[0-9a-f]{64}$/.test(hash)) throw new Error('Use a lowercase SHA-256 of the exact evidence bytes.');
}
