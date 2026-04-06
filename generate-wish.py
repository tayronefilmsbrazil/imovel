#!/usr/bin/env python3
"""Gera index.html do Wish Residence rodando template.js via osascript (JXA) e salvando em UTF-8."""
import subprocess, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))

JXA = r'''
ObjC.import('Foundation');
function readUtf8(path) {
  var ns = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null);
  return ObjC.unwrap(ns);
}
var tplSrc = readUtf8('%s/template.js');
var window = {};
eval(tplSrc);
var data = JSON.parse(readUtf8('%s/wish-data.json'));
var html = window.LandingTemplate.generateLandingPage(data);
html;
''' % (BASE, BASE)

result = subprocess.run(
    ['osascript', '-l', 'JavaScript', '-e', JXA],
    capture_output=True, text=True, encoding='utf-8'
)
if result.returncode != 0:
    print("ERRO:", result.stderr, file=sys.stderr)
    sys.exit(1)

html = result.stdout
# osascript adiciona newline final
if html.endswith('\n'):
    html = html[:-1]

out = os.path.join(BASE, 'index.html')
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"OK — {len(html)/1024:.1f} KB gravado em {out}")
