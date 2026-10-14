"""Offline submission gate: commitments, deployment manifest and credential hygiene."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
d = json.loads((ROOT/'web/src/deployment.json').read_text())
assert re.fullmatch(r'0x[0-9a-fA-F]{40}', d['address'])
assert re.fullmatch(r'0x[0-9a-f]{64}', d['deploymentTransaction'])
assert d['sourceSha256'] == hashlib.sha256((ROOT/'contracts/licenselens.py').read_bytes()).hexdigest()
assert d['chainId'] == 61999 and d['rpc'] == 'https://studio.genlayer.com/api'
assert d['version']==2 and len(d['transactions'])>=15
assert set(d['expectedVerdicts']) >= {'clsx-2.1.1-source','gpl-complete','agpl-complete'}
assert all(re.fullmatch(r'0x[0-9a-f]{64}',t['hash']) for t in d['transactions'])
for path in ['evidence/compliant.json','evidence/noncompliant.json']:
    b = json.loads((ROOT/path).read_text())
    assert b['synthetic'] is True
    assert re.fullmatch('[0-9a-f]{40}', b['commit'])
catalog=json.loads((ROOT/'evidence/license-catalog.json').read_text())
for license,ref in catalog.items():
    doc=(ROOT/'evidence/licenses'/f'{license}.txt').read_bytes()
    assert len(doc)>5000 and hashlib.sha256(doc).hexdigest()==ref['sha256']
v=json.loads((ROOT/'docs/live-verification.json').read_text())
assert v['source_match'] and v['address']==d['address'] and v['source_sha256']==d['sourceSha256']
assert len(v['transactions'])==len(d['transactions'])+1
assert all(t['status']=='FINALIZED' for t in v['transactions'])
patterns = [r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', r'gh[pousr]_[A-Za-z0-9]{30,}', r'github_pat_[A-Za-z0-9_]{40,}', r'(?i)(?:private_key|mnemonic|seed_phrase)\s*[:=]\s*[\"\'][^\"\']{16,}']
paths = [ROOT/'README.md', ROOT/'LICENSE', ROOT/'.gitignore', ROOT/'requirements-test.txt']
for directory in ['contracts','tests','docs','evidence','scripts','web/src','web/tests','web/public','.github','examples']:
    paths.extend(p for p in (ROOT/directory).rglob('*') if p.is_file() and '__pycache__' not in str(p))
for p in paths:
    text=p.read_bytes().decode('utf-8',errors='ignore')
    assert not re.search(r'\bTODO\b|\bFIXME\b',text),f'Unfinished work in {p}'
    for pattern in patterns:
        assert not re.search(pattern,text),f'Possible credential in {p}'
print(f'Release manifest, fixture bindings and secret scan passed ({len(paths)} source files).')
