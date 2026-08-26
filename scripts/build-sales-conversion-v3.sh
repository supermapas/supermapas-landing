#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
cp -R vercel-static dist

node scripts/production-50off-cta-v1.mjs dist/index.html
node scripts/real-content-index-v1.mjs dist/index.html
node scripts/content-index-polish-v1.mjs dist/index.html
node scripts/sales-conversion-v3.mjs dist/index.html
node scripts/sales-conversion-v3-cleanup.mjs dist/index.html
node scripts/syntax-map-swap-v1.mjs dist/index.html
node scripts/carousel-map-order-v2.mjs dist/index.html
node scripts/carousel-fit-polish-v1.mjs dist/index.html
node scripts/visual-compare-polish-v1.mjs dist/index.html
node scripts/mobile-hero-summary-polish-v1.mjs dist/index.html

echo "Sales conversion v3 preview built from production base."
