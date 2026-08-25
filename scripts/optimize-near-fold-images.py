#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'public'
INDEX = ROOT / 'index.html'

# These six images sit immediately below the hero. They should start downloading during
# the initial page load, but at lower priority than the hero so they do not compete with LCP.
TARGET_FRAGMENTS = [
    '1a67b8_65fd23abbd49440aa523bd8d2b7142df~mv2.png/v1/fit/w_1200,h_844/file.webp',
    '1a67b8_97c960898bc04b7b8c8e9b1c0c1e49ab~mv2.png/v1/fit/w_760,h_1054/file.webp',
    '1a67b8_01c579c2d24b495bbd011e319bebeb41~mv2.png/v1/fit/w_760,h_1054/file.webp',
    '1a67b8_b696731e83344bc893cf613867cee66c~mv2.png/v1/fit/w_640,h_904/file.webp',
    '1a67b8_fbd380961a1b47d3aa4569aef6278ebb~mv2.png/v1/fit/w_640,h_904/file.webp',
    '1a67b8_4906fb8fd7ef4ec1b33346f2b3ce670d~mv2.png/v1/fit/w_640,h_904/file.webp',
]

html = INDEX.read_text(encoding='utf-8')


def tune_tag(match):
    tag = match.group(0)
    if not any(fragment in tag for fragment in TARGET_FRAGMENTS):
        return tag

    if 'loading="lazy"' in tag:
        tag = tag.replace('loading="lazy"', 'loading="eager"', 1)
    elif 'loading=' not in tag:
        tag = tag.replace('<img', '<img loading="eager"', 1)

    if 'fetchpriority=' not in tag.lower() and 'fetchPriority=' not in tag:
        tag = tag.replace('<img', '<img fetchpriority="low"', 1)

    return tag


html = re.sub(r'<img\b[^>]*>', tune_tag, html)

# Re-assert the same policy after React hydration. This does not reload, rewrite src, or
# touch layout; it only prevents hydration from returning these near-fold images to lazy.
guard = r'''<script id="sm-format-near-eager">(function(){function tune(){document.querySelectorAll('.sm-format-v2-visual img').forEach(function(img){try{img.loading='eager';img.fetchPriority='low'}catch(_){}})}tune();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tune,{once:true});else queueMicrotask(tune)})();</script>'''
if 'id="sm-format-near-eager"' not in html:
    if '</body>' not in html:
        raise SystemExit('closing body missing')
    html = html.replace('</body>', guard + '</body>', 1)

INDEX.write_text(html, encoding='utf-8')

html = INDEX.read_text(encoding='utf-8')
tags = [
    tag for tag in re.findall(r'<img\b[^>]*>', html)
    if any(fragment in tag for fragment in TARGET_FRAGMENTS)
]

if len(tags) != 6:
    raise SystemExit(f'expected 6 near-fold format images, found {len(tags)}')
if not all('loading="eager"' in tag for tag in tags):
    raise SystemExit('not all near-fold format images are eager')
if not all('fetchpriority="low"' in tag.lower() for tag in tags):
    raise SystemExit('not all near-fold format images are low priority')
if 'id="sm-format-near-eager"' not in html:
    raise SystemExit('near-fold hydration guard missing')

print('near-fold format images tuned: 6 eager, low-priority requests')
