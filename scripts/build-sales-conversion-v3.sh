#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
cp -R vercel-static dist

node scripts/production-50off-cta-v1.mjs dist/index.html
node scripts/real-content-index-v1.mjs dist/index.html
node scripts/content-index-polish-v1.mjs dist/index.html
node scripts/sales-conversion-v3.mjs dist/index.html
node scripts/sales-conversion-v3-cleanup.mjs dist/index.html
node scripts/audience-pain-bridge-v1.mjs dist/index.html
node scripts/syntax-map-swap-v1.mjs dist/index.html
node scripts/carousel-map-order-v2.mjs dist/index.html
node scripts/carousel-fit-polish-v1.mjs dist/index.html
node scripts/visual-compare-polish-v1.mjs dist/index.html
node scripts/mobile-hero-summary-polish-v1.mjs dist/index.html
node scripts/audience-pain-layout-fix-v1.mjs dist/index.html
node scripts/audience-pain-compact-v2.mjs dist/index.html
node scripts/audience-pain-hard-reset-v1.mjs dist/index.html
node scripts/audience-pain-balance-v4.mjs dist/index.html
node scripts/audience-message-polish-v1.mjs dist/index.html
node scripts/audience-nav-mobile-polish-v1.mjs dist/index.html
node scripts/visual-section-order-v1.mjs dist/index.html
node scripts/audience-visual-transition-polish-v1.mjs dist/index.html
node scripts/nav-order-hard-fix-v1.mjs dist/index.html
node scripts/offer-redundancy-cleanup-v1.mjs dist/index.html
node scripts/fixed-dock-polish-v2.mjs dist/index.html
node scripts/proof-real-screenshots-v1.mjs dist/index.html
node scripts/offer-value-stack-v1.mjs dist/index.html
node scripts/offer-checkout-benefits-polish-v1.mjs dist/index.html
node scripts/offer-value-contrast-polish-v1.mjs dist/index.html
node scripts/cta-offer-routing-v1.mjs dist/index.html
node scripts/creators-authority-polish-v1.mjs dist/index.html

echo "Sales conversion v3 preview built from production base."
