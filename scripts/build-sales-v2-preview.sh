#!/usr/bin/env bash
set -euo pipefail

rm -rf dist public
cp -R vercel-static dist

node scripts/production-50off-cta-v1.mjs dist/index.html
node scripts/real-content-index-v1.mjs dist/index.html
node scripts/content-index-polish-v1.mjs dist/index.html

mkdir -p public
cp dist/index.html public/index.html

python3 scripts/apply-aggressive-sales-v2.py
python3 scripts/apply-aggressive-marketing-v2.py
python3 scripts/apply-visual-comparison-v2.py
python3 scripts/apply-trust-proof-v2.py
python3 scripts/apply-preview-refinements-v3.py

cp public/index.html dist/index.html

echo "Sales v2 preview bundle built successfully."
