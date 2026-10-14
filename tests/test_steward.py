import copy,json,re
from pathlib import Path
import pytest
from test_contract import env,prepare,result,BUNDLE,ANSWER,POLICY,COMMIT,URL,encode,digest
CATALOG=json.loads((Path(__file__).parents[1]/'evidence/license-catalog.json').read_text())
SRC='https://raw.githubusercontent.com/ANZA24k/LicenseLens/'+COMMIT+'/examples/tool.py'

def copyleft(vm,c,license,missing=None):
    p={**POLICY,'allowed_licenses':[license]};c.create_policy('copy-policy',encode(p))
    b=copy.deepcopy(BUNDLE);b['schema']='licenselens/v2';dep=b['dependencies'][0];dep['license']=license;dep['license_text']='SPDX-License-Identifier: '+license;dep['license_ref']=CATALOG[license];dep['source_ref']={'url':SRC,'sha256':digest('print("demo")\n')}
    if missing:dep[missing]=None
    raw=encode(b);c.submit_release('copy-policy','demo-good',COMMIT,URL,digest(raw));vm.mock_web(re.escape(URL),{'status':200,'body':raw})
    doc=(Path(__file__).parents[1]/f'evidence/licenses/{license}.txt').read_text();assert len(doc)>5000
    vm.mock_web(re.escape(CATALOG[license]['url']),{'status':200,'body':doc});vm.mock_web(re.escape(SRC),{'status':200,'body':'print("demo")\n'})
    return b

@pytest.mark.parametrize('license',list(CATALOG))
def test_complete_supported_copyleft(env,license):
    vm,c=env;copyleft(vm,c,license);vm.mock_llm('open-source release evidence reviewer',encode(ANSWER));c.evaluate('demo-good');assert result(c)['verdict']=='COMPLIANT';assert vm.run_validator()

@pytest.mark.parametrize('license',list(CATALOG))
@pytest.mark.parametrize('missing',['license_ref','source_ref'])
def test_missing_copyleft_never_approved(env,license,missing):
    vm,c=env;copyleft(vm,c,license,missing);vm.mock_llm('open-source release evidence reviewer',encode(ANSWER));c.evaluate('demo-good');assert result(c)['verdict']=='INCONCLUSIVE';assert 'COPYLEFT_EVIDENCE_INCOMPLETE' in result(c)['findings'][0]['codes']

@pytest.mark.parametrize('license',list(CATALOG))
@pytest.mark.parametrize('state,verdict',[('VIOLATED','NON_COMPLIANT'),('UNKNOWN','INCONCLUSIVE')])
def test_corresponding_source_obligations(env,license,state,verdict):
    vm,c=env;copyleft(vm,c,license);a=copy.deepcopy(ANSWER);a['dependencies'][0]['obligations']=state;vm.mock_llm('open-source release evidence reviewer',encode(a));c.evaluate('demo-good');assert result(c)['verdict']==verdict;assert vm.run_validator()

@pytest.mark.parametrize('code',[503,429])
def test_transient_retrieval_does_not_consume_revision(env,code):
    vm,c=env;prepare(vm,c,status=code)
    with vm.expect_revert('Temporary failure'):c.evaluate('demo-good')
    r=json.loads(c.get_release('demo-good'));assert r['revision']==1 and r['history']==[]
    vm.clear_mocks();vm.mock_web(re.escape(URL),{'status':200,'body':encode(BUNDLE)});vm.mock_llm('open-source release evidence reviewer',encode(ANSWER));c.evaluate('demo-good');assert result(c)['verdict']=='COMPLIANT'

def test_semantic_unknown_is_terminal_no_favorable_retries(env):
    vm,c=env;a=copy.deepcopy(ANSWER);a['inventory']='UNKNOWN';prepare(vm,c,answer=a);c.evaluate('demo-good')
    with vm.expect_revert('already reviewed'):c.evaluate('demo-good')

def test_unadmitted_participant_cannot_exhaust_global_slots(env):
    vm,c=env
    with vm.prank('0x'+'b'*40):
        with vm.expect_revert('not admitted'):c.create_policy('attacker',encode(POLICY))
    assert len(json.loads(c.get_index())['policies'])==1

def test_account_capacity_reserved_and_unused_slots_reclaimable(env):
    vm,c=env;actor='0x'+'b'*40;c.configure_account(actor,1,1)
    with vm.prank(actor):
        c.create_policy('other',encode(POLICY))
        with vm.expect_revert('Account policy capacity'):c.create_policy('other2',encode(POLICY))
        with vm.expect_revert('Only capacity administrator'):c.configure_account(actor,2,2)
    c.configure_account(actor,1,0)
    with vm.expect_revert('Cannot reclaim'):c.configure_account(actor,0,0)
    # Other accounts cannot consume the administrator's reserved allowance.
    c.create_policy('still-available',encode(POLICY))

def test_global_reservation_bound(env):
    vm,c=env;c.configure_account('0x'+'b'*40,124,120)
    with vm.expect_revert('Global reservation'):c.configure_account('0x'+'c'*40,1,1)
    cap=json.loads(c.get_capacity('0x'+'b'*40));assert cap['reserved_policies']==128 and cap['reserved_releases']==128

def test_global_used_capacity_and_revision_bound(env):
    vm,c=env;cap=json.loads(c.get_capacity('0x'+'0'*40));admin=cap['administrator'];c.configure_account(admin,128,128)
    for i in range(127):c.create_policy('p'+str(i),encode(POLICY))
    with vm.expect_revert('capacity reached'):c.create_policy('overflow',encode(POLICY))
    for i in range(128):c.submit_release('demo-policy','r'+str(i),COMMIT,URL,'1'*64)
    with vm.expect_revert('capacity reached'):c.submit_release('demo-policy','overflow',COMMIT,URL,'1'*64)

def test_source_backed_commit_binding(env):
    vm,c=env;b=copy.deepcopy(BUNDLE);b['source_refs']=[{'kind':'MANIFEST','url':URL,'sha256':'1'*64}];prepare(vm,c,b);c.evaluate('demo-good');assert result(c)['error']=='MALFORMED_EVIDENCE'

@pytest.mark.parametrize('mutation,error',[('hash','DOCUMENT_HASH_MISMATCH'),('oversized','DOCUMENT_TOO_LARGE'),('excerpt','COPYLEFT_TEXT_MISMATCH'),('utf8','MALFORMED_DOCUMENT')])
def test_complete_license_documents_fail_closed(env,mutation,error):
    vm,c=env;b=copyleft(vm,c,'GPL-3.0-only');url=CATALOG['GPL-3.0-only']['url']
    vm.mock_llm('open-source release evidence reviewer',encode(ANSWER));c.evaluate('demo-good')
    b['inventory_method']+=' Revision integrity test.'
    raw=b'\xff' if mutation=='utf8' else b'GNU GENERAL PUBLIC LICENSE excerpt'
    if mutation in ['excerpt','utf8']:
        import hashlib
        ref={'url':'https://raw.githubusercontent.com/ANZA24k/LicenseLens/'+COMMIT+'/evidence/license.txt','sha256':hashlib.sha256(raw).hexdigest()}
        b['dependencies'][0]['license_ref']=ref
    c.revise_evidence('demo-good',URL,digest(encode(b)));vm.clear_mocks()
    vm.mock_web(re.escape(URL),{'status':200,'body':encode(b)});vm.mock_web(re.escape(SRC),{'status':200,'body':'print("demo")\n'})
    doc=(Path(__file__).parents[1]/'evidence/licenses/GPL-3.0-only.txt').read_text()
    vm.mock_web(re.escape(url),{'status':200,'body':'changed bytes' if mutation=='hash' else ('x'*50001 if mutation=='oversized' else doc)})
    if mutation in ['excerpt','utf8']:vm.mock_web(re.escape(ref['url']),{'status':200,'body':raw})
    vm.mock_llm('open-source release evidence reviewer',encode(ANSWER));c.evaluate('demo-good');assert result(c)['error']==error;assert result(c)['verdict']=='INCONCLUSIVE'
