import {test} from 'node:test';
import assert from 'node:assert/strict';
import { safeDocumentURL,escapeHTML,safeEvidenceURL,connectWallet,validateCommitments,verdictLabel} from '../src/safety.mjs';
const url='https://raw.githubusercontent.com/u/r/'+'1'.repeat(40)+'/evidence/demo.json';
test('wallet connection requests accounts only, never transactions or signatures',async()=>{const calls=[];const p={request:async a=>{calls.push(a.method);return ['0x'+'1'.repeat(40)]}};await connectWallet(p);assert.deepEqual(calls,['eth_requestAccounts']);});
test('wallet missing and rejection errors propagate',async()=>{await assert.rejects(connectWallet(undefined));await assert.rejects(connectWallet({request:async()=>{throw Error('rejected')}}),/rejected/);await assert.rejects(connectWallet({request:async()=>[]}));});
test('untrusted evidence and RPC text are escaped',()=>{assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');});
test('immutable safe evidence accepted',()=>{assert.equal(safeEvidenceURL(url),true);validateCommitments('2'.repeat(40),url,'3'.repeat(64));});
test('unsafe sources and paths rejected',()=>{for(const u of [url+'?x=1',url.replace('/evidence/','/../'),'http://localhost/x',url.replace('raw.githubusercontent.com','evil.example'),url.replace('1'.repeat(40),'main')])assert.equal(safeEvidenceURL(u),false);});
test('invalid commitment input blocks write construction',()=>{assert.throws(()=>validateCommitments('x',url,'3'.repeat(64)));assert.throws(()=>validateCommitments('2'.repeat(40),url,'x'));});
test('all verdict states and pending label supported',()=>{assert.equal(verdictLabel('COMPLIANT'),'Evidence compliant');assert.equal(verdictLabel('NON_COMPLIANT'),'Non-compliant');assert.equal(verdictLabel('INCONCLUSIVE'),'Inconclusive');assert.equal(verdictLabel(undefined),'Awaiting review');});

test('document links enforce pinned HTTPS sources',()=>{assert.equal(safeDocumentURL('https://raw.githubusercontent.com/lukeed/clsx/'+ 'a'.repeat(40)+'/license'),true);for(const path of ['../../license','src/../license','license?x=1'])assert.equal(safeDocumentURL('https://raw.githubusercontent.com/a/b/'+ 'a'.repeat(40)+'/'+path),false);assert.equal(safeDocumentURL('https://evil.test/license'),false);});
