"""Validate the portable public package without external services."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
def load(path):
    return json.loads((ROOT / path).read_text())

story = load('public/data/ai-data-center.story.json')
items = story['items']
assert len(items) == 115
assert len({item['asset_id'] for item in items}) == 114
assert story['story']['id'] == 'demo-ai-data-center'
assert [item['position'] for item in items] == sorted(item['position'] for item in items)
assert all(re.fullmatch(r'asset-\d{4}', item['asset_id']) for item in items)
assert all(re.fullmatch(r'item-\d{4}', item['item_id']) for item in items)
assert all(set(item) <= {'position','media_type','container','duration_s','orientation','width','height','start_s','end_s','has_audio','asset_id','item_id','file','note'} for item in items)
for item in items:
    if item['duration_s'] is not None:
        start = item['start_s'] if item['start_s'] is not None else 0
        end = item['end_s'] if item['end_s'] is not None else item['duration_s']
        assert 0 <= start <= end <= item['duration_s'] + 0.05

ai = story['ai_versions'][0]['ai']
for section in ['angles','shorts','beats']:
    for part in ai[section]:
        assert all(isinstance(n,int) and 0 <= n < len(items) for n in part['segments'])
for source in load('public/data/source-manifest.json'):
    assert source['id'] in {i['asset_id'] for i in items}
    assert source['path'].startswith('media/originals/asset-')
for duration in [15,30]:
    plan = load(f'public/demo/plans/nbox-{duration}s.edit.json')
    assert plan['story_id'] == story['story']['id']
    assert sum(c['frames'] for c in plan['cuts']) == duration * plan['fps']
    for cut in plan['cuts']:
        assert items[cut['position']]['asset_id'] == cut['asset_id']
        assert cut['source_file'] == cut['asset_id'] + '.mov'
        assert 0 <= cut['source_start_s'] < cut['source_end_s'] <= items[cut['position']]['duration_s'] + 0.05

for f in load('public/demo/manifest.json')['files']:
    p = PUBLIC / 'demo' / f['path']
    assert p.stat().st_size == f['size_bytes']
    assert hashlib.sha256(p.read_bytes()).hexdigest() == f['sha256']
for f in load('public/data/package-manifest.json')['files']:
    p = PUBLIC / f['path']
    assert p.stat().st_size == f['size_bytes']
    assert hashlib.sha256(p.read_bytes()).hexdigest() == f['sha256']

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        self.urls.extend(value for key,value in attrs if key in ['src','href','poster'] and value)

for html in PUBLIC.rglob('*.html'):
    parser = Links()
    parser.feed(html.read_text())
    for url in parser.urls:
        if url == '#' or urlsplit(url).scheme or url.startswith('//'):
            continue
        assert not url.startswith('/'), (html.relative_to(ROOT), 'absolute static URL')
        p = html.parent / unquote(urlsplit(url).path)
        assert p.exists(), (html.relative_to(ROOT), url)

private = re.compile(r'/Users/|/home/[^\s/]+/|CloudStorage|Dropbox-|com~apple~CloudDocs|studio\.youtube\.com|BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|sk-[A-Za-z0-9_-]{20,}', re.I)
text_ext = {'.html','.js','.css','.json','.md','.py','.tsx','.ts','.srt','.vtt','.svg'}
emails = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
for p in ROOT.rglob('*'):
    rel = p.relative_to(ROOT)
    if any(part in ['.git','node_modules','dist','__pycache__'] for part in rel.parts) or p.name == '.DS_Store':
        continue
    if p.is_file():
        assert p.name != '.DS_Store' and p.suffix not in ['.db','.sqlite','.sqlite3','.pyc'] and not p.name.startswith('.env')
        assert p.stat().st_size < 100*1024*1024, ('GitHub file size limit',str(rel))
        if p.suffix in text_ext:
            text = p.read_text()
            # This validator contains the marker patterns themselves, not private values.
            if rel != Path('scripts/validate.py'):
                assert not private.search(text), ('private marker',str(rel))
                assert all(m.group() == 'hi@remotion.dev' for m in emails.finditer(text)), ('email outside third-party attribution',str(rel))

print('PASS: Story structure, placeholders, positional references, source ranges, output checksums, static links, privacy markers and file exclusions')
