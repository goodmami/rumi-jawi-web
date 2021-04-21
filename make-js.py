#!/usr/bin/env python3

import sys

if len(sys.argv) != 2:
    sys.exit('usage: make-js.py path/to/rumi-jawi.tsv') 
tsvpath = sys.argv[1]

with open('static/rumi-jawi.js', 'w') as out:
    with open(tsvpath) as f:
        next(f)  # discard header
        parts = [line.rstrip() for line in f]
        data = '\\n'.join(parts).replace('"', '')
        print(f'var rjtsv = "{data}";', file=out)
    print('''
var rjmap = new Map();
var jrmap = new Map();
rjtsv.split("\\n").forEach(function (line) {
  let parts = line.split("\\t");
  let rumi = parts[0].toLowerCase();
  let jawi = parts[1];
  if (!rjmap.has(rumi)) rjmap.set(rumi, []);
  rjmap.get(rumi).push(jawi);
  if (!jrmap.has(jawi)) jrmap.set(jawi, []);
  jrmap.get(jawi).push(rumi);
})''', file=out)
