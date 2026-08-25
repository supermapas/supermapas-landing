from pathlib import Path

CSS = Path('public/_next/static/chunks/06-3g1k36rw0y.css')

css = CSS.read_text(encoding='utf-8')
original_size = len(css.encode('utf-8'))

landing_marker = '.sm-sales-shell{'
landing_start = css.find(landing_marker)
if landing_start < 0:
    raise SystemExit('landing CSS marker not found')

font_marker = '.manrope_9e067a5b-module__vT7MWq__variable'
font_start = css.find(font_marker)
if font_start < 0:
    raise SystemExit('Manrope variable marker not found')
font_end = css.find('}', font_start)
if font_end < 0:
    raise SystemExit('Manrope variable rule is malformed')
font_end += 1

# Preserve the original global variables/reset byte-for-byte so typography,
# colors and browser defaults remain identical to the approved bundle.
global_start = css.find(':root{', font_end)
global_end_marker = 'button,a{-webkit-tap-highlight-color:transparent}'
if global_start < 0:
    raise SystemExit('global reset start not found')
global_end = css.find(global_end_marker, global_start)
if global_end < 0:
    raise SystemExit('global reset end not found')
global_end += len(global_end_marker)

foundation = css[:font_end]
global_reset = css[global_start:global_end]
landing = css[landing_start:]
trimmed = foundation + '\n' + global_reset + '\n' + landing

checks = {
    'landing shell': '.sm-sales-shell{' in trimmed,
    'persistent checkout dock': '.sm-sales-dock{' in trimmed,
    'desktop hero': '.sm-desktop-hero{' in trimmed,
    'mobile hero': '.sm-mobile-hero{' in trimmed,
    'desktop CTA': '.sm-dh-primary{' in trimmed,
    'mobile CTA': '.sm-mh-cta' in trimmed,
    'Manrope font': '@font-face{font-family:Manrope' in trimmed,
    'Manrope variable': font_marker in trimmed,
    'original root variables': ':root{--bg:#f7f8fc;' in trimmed,
    'original Inter body fallback': 'font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif' in trimmed,
    'generic auth removed': '.auth-shell{' not in trimmed,
    'generic dashboard removed': '.dashboard-page' not in trimmed,
    'generic editor removed': '.editor-page' not in trimmed,
    'generic billing removed': '.billing-page' not in trimmed,
    'generic library removed': '.library-page' not in trimmed,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit('CSS trim validation failed: ' + ', '.join(failed))

new_size = len(trimmed.encode('utf-8'))
if new_size >= original_size * 0.78:
    raise SystemExit(f'CSS reduction too small: {original_size} -> {new_size}')
if new_size < 20000:
    raise SystemExit(f'CSS unexpectedly small after trim: {new_size}')

CSS.write_text(trimmed, encoding='utf-8')
print(f'Trimmed landing CSS: {original_size} -> {new_size} bytes ({100 - (new_size/original_size*100):.1f}% reduction)')
